import axios from "axios";

// Base URL points to our backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5005/api",
});

// Interceptor to attach the token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Assuming Bearer token is used in backend
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor to handle global errors (e.g. 401 unauthorized => logout)
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and force logout if token is expired/invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
