import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data; // Returns { data: ... }
  },
  (error) => {
    return Promise.reject(error);
  }
);