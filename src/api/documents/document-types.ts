import { Pagination } from "@/common/types";

export interface Document {
  id: string;
  title: string;
  content: string;
  fileSize: number;
  fileUrl: string;
  filename: string;
  processed: boolean;
  processingStatus: string | null;
  uploadedAt: string;
  uploadedById: string;
}

export interface DocumentResponse {
  documents: Document[];
  pagination: Pagination;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  documentId: string;
  createdAt: string;
  results?: SearchResult[];
}

export interface AIProcessingStatus {
  documentId: string;
  processed: boolean;
  processingStatus: string | null;
}

export interface SearchRequest {
  query: string;
  filters?: {
    dateRange?: {
      start: string;
      end: string;
    };
    fileType?: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  query: string;
  searchTime: number;
}

export interface UploadResponse {
  documentId: string;
  message: string;
  status: "uploaded" | "processing";
}

export interface DocumentApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  relevanceScore: number;
  pageNumber?: number;
  section?: string;
}
