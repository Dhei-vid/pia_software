import axios from "axios";
import { toast } from "sonner";
import { host } from "./helpers";
import { getCookie } from "cookies-next";
import { performLogout } from "./helpers";

const fallbackURL = "http://localhost:8000";
const baseURL = host || process.env.NEXT_PUBLIC_API_URL || fallbackURL;

const axiosInstanceDoc = axios.create({
  baseURL,
});

// REQUEST INTERCEPTOR
axiosInstanceDoc.interceptors.request.use(
  (config) => {
    const token = getCookie("mlToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
axiosInstanceDoc.interceptors.response.use(
  (response) => {
    const { success, message } = response.data;
    // if (success && message) toast.success(message);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;

    switch (status) {
      case 401:
        toast.error("Session expired. Redirecting to sign in...");
        performLogout();
        break;

      case 403:
        toast.error(`Access forbidden: ${message}`);
        break;

      case 404:
        toast.error(
          "Endpoint not found. Please check your backend configuration."
        );
        console.error(`404 → ${method} ${url}`);
        break;

      default:
        if (error.code === "ERR_NETWORK" || !error.response) {
          toast.error("Network error. Please check your connection.");
        } else if (status && status >= 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(message);
        }
    }

    console.error(`[${method}] ${url} → ${status || "N/A"} | ${message}`);
    return Promise.reject(error);
  }
);

export default axiosInstanceDoc;
