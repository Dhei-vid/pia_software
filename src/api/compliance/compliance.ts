import axiosInstance from "@/utils/axios-instance";
import axiosInstanceDoc from "@/utils/axios-instance-doc";
import { extractErrorMessage } from "@/common/helpers";

export const ComplianceDocument = {
  // Document Upload
  uploadDocument: async (document: File) => {
    const formData = new FormData();
    formData.append("document", document);

    try {
      const response = await axiosInstanceDoc.post(
        `https://wrightenergy.onrender.com/api/v1/document-comparison/compare`,
        formData
      );

      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error(errorMessage);
    }
  },

  // comparison History
  comparisonHistory: async () => {
    const response = await axiosInstance.get(
      "/api/v1/document-comparison/history"
    );
    console.log("Comparison Hostory Response ", response);
    return response.data;
  },

  // Get by comparison ID
  getByComparisonID: async (id: string) => {
    const response = await axiosInstance.get(
      `/api/v1/document-comparison/${id}`
    );
    console.log("Comparison Document by ID response ", response);
    return response.data;
  },
};
