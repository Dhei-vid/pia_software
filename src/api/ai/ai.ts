import axiosInstance from "@/utils/axios-instance";
import { extractErrorMessage } from "@/common/helpers";

export const AIService = {
  search: async (documentId: string) => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/documents/${documentId}/search`
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  processing: async (documentId: string) => {
    const response = await axiosInstance.post(
      `/api/v1/documents/${documentId}/status`
    );
    return response.data;
  },
};
