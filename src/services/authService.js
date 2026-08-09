import api from "./api";

export const login = (data) => {
    return api.post("/Account/login", data);
};

export const register = (data) => {
    return api.post("/Account/register", data);
};

export const refreshToken = (data) => {
    return api.post("/Account/refresh-token", data);
};

export const forgotPassword = (email) => {
    return api.post("/Account/forgot-password", {
        email,
    });
};

export const resetPassword = (data) => {
    return api.post("/Account/reset-password", data);
};

export const changePassword = (data) => {
    return api.put("/Account/change-password", data);
};

export const createLibrarian = (data) => {
    return api.post("/Account/create-librarian", data);
};

export const adminResetPassword = (data) => {
    return api.put("/Account/admin-reset-password", data);
};

export const revoke = () => {
    return api.post("/Account/revoke");
};

export const confirmEmail = (userId, token) => {
    return api.get("/Account/confirm-email", {
        params: {
            userId,
            token,
        },
    });
};