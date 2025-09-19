import axios from "axios";
import { toast } from "sonner";
import { host } from "./helpers";
import { getCookie, deleteCookie } from "cookies-next";

// Fallback URL if NEXT_PUBLIC_API_URL is not set
const fallbackURL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: host || fallbackURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const mlToken = getCookie("mlToken");
    config.headers.Authorization = `Bearer ${mlToken}`;

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    const { success, message } = response.data;
    if (success && message) {
      toast(message);
    }
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();

    if (status === 401) {
      deleteCookie("mlToken");

      // Clear any stored user data in localStorage/sessionStorage if any
      if (typeof window !== "undefined") {
        // Force page reload to clear all state
        window.location.href = "/signin";
      }

      toast.error("Session expired. Please sign in again.");
      console.error(`Unauthorized: ${errorMessage}`);
    } else if (status === 403) {
      toast.error(`Access forbidden: ${errorMessage}`);
      console.error(`Forbidden: ${errorMessage}`);
    } else if (status === 404) {
      toast.error(
        "Endpoint not found. Please check your backend configuration."
      );
      console.error(
        `404 Error - URL: ${method} ${error.config?.baseURL}${url}`
      );
      console.error("Possible causes:");
      console.error("1. Backend server not running");
      console.error("2. Wrong endpoint path");
      console.error("3. Wrong HTTP method");
      console.error("4. CORS issues");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
      console.error("Server Error:", error.response?.data);
    } else if (error.code === "ERR_NETWORK" || !error.response) {
      toast.error("Network error. Please check your connection.");
      console.error("Network Error:", error.message);
      console.error("Full URL attempted:", `${error.config?.baseURL}${url}`);
    } else {
      toast.error(errorMessage);
      console.error("Request Error:", error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
