import api from "./api";

export const getFines = () => {
    return api.get("/Fines");
};

export const getMyFines = () => {
    return api.get("/Fines/my-fines");
};

export const getFineById = (id) => {
    return api.get(`/Fines/${id}`);
};

export const getUnpaidFines = () => {
    return api.get("/Fines/unpaid");
};

export const calculateFine = (loanId) => {
    return api.post(`/Fines/calculate/${loanId}`);
};

export const payFine = (id) => {
    return api.put(`/Fines/${id}/pay`);
};

export const deleteFine = (id) => {
    return api.delete(`/Fines/${id}`);
};