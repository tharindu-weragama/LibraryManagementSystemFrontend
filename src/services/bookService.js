import api from "./api";

export const getBooks = () => {
  return api.get("/Books");
};

export const getBookById = (id) => {
  return api.get(`/Books/${id}`);
};

export const addBook = (book) => {
  return api.post("/Books", book);
};

export const updateBook = (id, book) => {
  return api.put(`/Books/${id}`, book);
};

export const deleteBook = (id) => {
  return api.delete(`/Books/${id}`);
};