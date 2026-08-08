import api from "./api";

export const login = (credentials) => {
  return api.post("/Account/login", credentials);
};