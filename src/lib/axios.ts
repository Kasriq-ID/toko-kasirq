import axios from "axios";
import { API_BASE_URL } from "@/url";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // TODO: Add auth token when available
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.error("Unauthorized request");
      }
      if (status === 500) {
        console.error("Server error");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
