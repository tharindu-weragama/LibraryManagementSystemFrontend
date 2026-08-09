import api from "./api";

export const changePassword = (data) => {
    return api.put("/Account/change-password", data);
};