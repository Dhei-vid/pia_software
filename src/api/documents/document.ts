import axiosInstance from "@/utils/axios-instance";
import { extractErrorMessage } from "@/common/helpers";
import {
  Document,
  DocumentResponse,
  HistoryResponse,
  AIProcessingStatus,
  SearchRequest,
  SearchResponse,
  UploadResponse,
  DocumentApiResponse,
} from "./document-types";

export const DocumentService = {
  // Get the document: {{baseURL}}/api/v1/notes/:documentId
  getDocument: async (documentId: string): Promise<Document> => {
    try {
      const response = await axiosInstance.get(`/api/v1/notes/${documentId}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Get search history: {{baseURL}}/api/v1/documents/search-history
  getSearchHistory: async (): Promise<HistoryResponse> => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/documents/search-history`
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // AI processing status: {{baseURL}}/api/v1/documents/:documentId/status
  getAIProcessingStatus: async (
    documentId: string
  ): Promise<AIProcessingStatus> => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/documents/${documentId}/status`
      );
      const document = response.data.data;
      return {
        documentId: document.id,
        processed: document.processed,
        processingStatus: document.processingStatus,
      };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Delete the document: {{baseURL}}/api/v1/documents/:documentId
  deleteDocument: async (documentId: string): Promise<DocumentApiResponse> => {
    try {
      const response = await axiosInstance.delete(
        `/api/v1/documents/${documentId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Input search: {{baseURL}}/api/v1/documents/:documentId/search
  searchDocument: async (
    documentId: string,
    searchRequest: SearchRequest
  ): Promise<SearchResponse> => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/documents/${documentId}/search`,
        searchRequest
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Upload document: {{baseURL}}/api/v1/documents/upload
  uploadDocument: async (file: File): Promise<UploadResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        `/api/v1/documents/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Get all documents with pagination
  getAllDocuments: async (
    page: number = 1,
    limit: number = 10
  ): Promise<DocumentResponse> => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/documents?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Get chapter TOC
  getChapterTOC: async (documentId: string) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/documents/${documentId}/toc`
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Get documents contents
  getAllDocumentContent: async (
    documentId: string,
    format: "structured" | "raw"
  ) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/documents/${documentId}/content?format=${format}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
};
