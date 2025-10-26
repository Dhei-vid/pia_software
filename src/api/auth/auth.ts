import { Auth } from "./auth-type";
import axiosInstance from "@/utils/axios-instance";
import { extractErrorMessage } from "@/common/helpers";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { performLogout } from "@/utils/helpers";

interface UserForm {
  fullName: string;
  password: string;
  jobTitle: string;
  company: string;
  location: string;
  email: string;
}

const AuthService = {
  register: async (data: UserForm): Promise<Auth> => {
    try {
      const response = await axiosInstance.post(`/api/v1/auth/reg`, data);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Registration error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  login: async (data: { email: string; password: string }): Promise<Auth> => {
    try {
      const response = await axiosInstance.post(`/api/v1/auth/login`, data);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Login error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  logout: async (router: AppRouterInstance): Promise<void> => {
    performLogout(router);
  },
};

export default AuthService;
