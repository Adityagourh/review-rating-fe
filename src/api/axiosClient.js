import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9000";

const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("rately_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Backend issues short-lived tokens (2 min) — bounce to login on expiry/invalid token
    const status = error?.response?.status;
    if (status === 401 || status === 409) {
      localStorage.removeItem("rately_token");
    }
    return Promise.reject(error);
  }
);

export const fileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_URL}${path}`;
};

export default axiosClient;
