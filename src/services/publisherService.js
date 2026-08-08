import api from "./api";

export const getPublishers = () => {
  return api.get("/Publishers");
};

export const addPublisher = (publisher) => {
  return api.post("/Publishers", publisher);
};

export const updatePublisher = (id, publisher) => {
  return api.put(`/Publishers/${id}`, publisher);
};

export const deletePublisher = (id) => {
  return api.delete(`/Publishers/${id}`);
};