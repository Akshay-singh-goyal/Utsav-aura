import axios from "axios";

// safely read env variable
const API_URL = (import.meta.env && import.meta.env.VITE_API_URL) 
  ? import.meta.env.VITE_API_URL 
  : "http://localhost:5000/api";

console.log("API URL being used:", API_URL);

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default api;
