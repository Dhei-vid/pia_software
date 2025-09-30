export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

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
  results?: any[];
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
  results: Array<{
    id: string;
    title: string;
    content: string;
    relevanceScore: number;
    pageNumber?: number;
    section?: string;
  }>;
  totalResults: number;
  query: string;
  searchTime: number;
}

export interface UploadResponse {
  documentId: string;
  message: string;
  status: "uploaded" | "processing";
}

export interface DocumentApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
