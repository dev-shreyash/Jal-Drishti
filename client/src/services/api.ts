import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isRegisterPage = window.location.pathname === "/register";

    if (error.response?.status === 401 && !isRegisterPage) {
      localStorage.removeItem("token");
      localStorage.removeItem("role"); 
      window.location.href = "/admin/login"; 
    }
    
    return Promise.reject(error);
  }
);

export default api;