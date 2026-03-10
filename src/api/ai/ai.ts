import axiosInstance from "@/utils/axios-instance";
import { extractErrorMessage } from "@/common/helpers";

export const AIService = {
  search: async (documentId: string, query: string) => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/documents/${documentId}/search`,
        {
          query: query,
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },


  taxQuery: async (query: string) => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/tax-query`,
        {
          query: query,
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  taxDocumentUpload: async (file: File) => {
    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await axiosInstance.post(
        `/api/v1/tax-query/answer-upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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
