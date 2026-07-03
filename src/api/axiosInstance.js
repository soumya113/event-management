import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Vite + MSW
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
     console.log("Interceptor called", error.response);
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    switch (status) {
      case 400:
        toast.warning(message);
        break;

      case 401:
        toast.error(message || "Unauthorized");
        localStorage.removeItem("token");
        break;

      case 403:
        toast.error(message || "Forbidden");
        break;

      case 404:
        toast.error(message || "Not Found");
        break;

      case 500:
        toast.error(message || "Internal Server Error");
        break;

      default:
        toast.error(message);
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;