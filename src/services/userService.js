import api from "./api";

export const getUsers = () => {
    return api.get("/Users");
};

export const getUserById = (id) => {
    return api.get(`/Users/${id}`);
};

export const getMembers = (search = "") => {
    return api.get("/Users/members", {
        params: {
            search: search
        }
    });
};