import axiosInstance from "@/utils/axios-instance";
// import { extractErrorMessage } from "@/common/helpers";

export const ComplianceDocument = {
  // Document Upload
  uploadDocument: async (document: File) => {
    const response = await axiosInstance.post(
      "/api/v1/document-comparison/compare",
      document
    );
    console.log("Document upload response ", response);
    return response.data;
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
