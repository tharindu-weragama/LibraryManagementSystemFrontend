import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((request) => {
        if (error) {
            request.reject(error);
        } else {
            request.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/Account/login") &&
            !originalRequest.url?.includes("/Account/refresh-token")
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve,
                        reject,
                    });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization =
                            `Bearer ${token}`;

                        return api(originalRequest);
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const accessToken =
                localStorage.getItem("accessToken");

            const refreshToken =
                localStorage.getItem("refreshToken");

            if (!accessToken || !refreshToken) {
                isRefreshing = false;

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");

                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/Account/refresh-token`,
                    {
                        accessToken,
                        refreshToken,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const newAccessToken =
                    response.data.accessToken;

                const newRefreshToken =
                    response.data.refreshToken;

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                localStorage.setItem(
                    "refreshToken",
                    newRefreshToken
                );

                if (response.data.user) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(response.data.user)
                    );
                }

                api.defaults.headers.common.Authorization =
                    `Bearer ${newAccessToken}`;

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                processQueue(
                    null,
                    newAccessToken
                );

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(
                    refreshError,
                    null
                );

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");

                window.location.href = "/login";

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;