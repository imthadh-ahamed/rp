import axios from "axios";
import Cookies from "js-cookie";

// Create axios instance without static auth header
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject latest token from cookies on each request
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("token")?.replace(/(^"|"$)/g, "");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(
    "[HTTP Service] Request:",
    config.method,
    config.url,
    config.headers
  );
  return config;
});

// Log responses and propagate data or errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      "[HTTP Service] Response:",
      response.status,
      response.config.url,
      response.data
    );
    return response;
  },
  (error) => {
    console.error(
      "[HTTP Service] Error Response:",
      error.response?.status,
      error.config?.url,
      error.response?.data
    );
    // Throw to allow caller catch
    throw error;
  }
);

export default axiosInstance;