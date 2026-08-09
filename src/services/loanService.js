import api from "./api";

export const getLoans = () => {
    return api.get("/Loans");
};

export const getMyLoans = () => {
    return api.get("/Loans/my-loans");
};

export const getLoanById = (id) => {
    return api.get(`/Loans/${id}`);
};

export const createLoan = (loanData) => {
    return api.post("/Loans", loanData);
};

export const updateLoan = (id, dueDate) => {
    return api.put(`/Loans/${id}`, {
        dueDate: dueDate
    });
};

export const returnLoan = (id) => {
    return api.put(`/Loans/${id}/return`);
};

export const deleteLoan = (id) => {
    return api.delete(`/Loans/${id}`);
};

export const getAvailableBooksForLoan = () => {
    return api.get("/Books/available");
};

export const getMembersForLoan = (search = "") => {
    if (search.trim()) {
        return api.get("/Users/members", {
            params: {
                search: search
            }
        });
    }

    return api.get("/Users/members");
};