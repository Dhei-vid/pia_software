import axiosInstance from "@/utils/axios-instance";
import axiosInstanceDoc from "@/utils/axios-instance-doc";
import { extractErrorMessage } from "@/common/helpers";
import {
  ComplianceAnalysisResponse,
  GetComplianceDocumentResponse,
} from "./compliance-type";

export const ComplianceDocument = {
  // Document Upload
  uploadDocument: async (document: File) => {
    const formData = new FormData();
    formData.append("document", document);

    try {
      const response = await axiosInstanceDoc.post(
        `/api/v1/document-comparison/compare`,
        formData
      );

      return response.data as ComplianceAnalysisResponse;
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
    return response.data as GetComplianceDocumentResponse;
  },

  // Get by comparison ID
  getByComparisonID: async (id: string) => {
    const response = await axiosInstance.get(
      `/api/v1/document-comparison/${id}`
    );
    return response.data;
  },
};
