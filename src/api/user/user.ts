import { UpdateUserInput } from "@/common/types";
import axiosInstance from "@/utils/axios-instance";
import { extractErrorMessage } from "@/common/helpers";

export const UserService = {
  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get("/api/v1/users/profile");
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  },

  removeUserById: async (userId: string) => {
    try {
      const response = await axiosInstance.delete(`/api/v1/users/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateUser: async (data: UpdateUserInput) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/users/update`, data);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  },
};
