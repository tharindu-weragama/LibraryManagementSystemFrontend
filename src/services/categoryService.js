import api from "./api";

export const getCategories = () => {
    return api.get("/Categories");
};

export const addCategory = (category) => {
    return api.post("/Categories", category);
};

export const updateCategory = (id, category) => {
    return api.put(`/Categories/${id}`, category);
};

export const deleteCategory = (id) => {
    return api.delete(`/Categories/${id}`);
};