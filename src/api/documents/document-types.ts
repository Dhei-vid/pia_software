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

export interface AIProcessingStatus {
  documentId: string;
  processed: boolean;
  processingStatus: string | null;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  documentId: string;
  createdAt: string;
  results?: SearchResult[];
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

// Table of Content - START
export interface TOCResponse {
  message: string;
  success: boolean;
  data: TOC;
}

interface TOCSchedules {
  id: string;
  scheduleNumber: number;
  scheduleTitle: string;
}

interface TOCChapters {
  id: string;
  chapterNumber: number;
  chapterTitle: string;
  parts: TOCParts[];
}

interface TOCParts {
  id: string;
  partNumber: number;
  partTitle: string;
  sections: {
    id: string;
    sectionNumber: number;
    sectionTitle: string;
  }[];
}

export interface TOC {
  tableOfContents: {
    id: string;
    title: string;
    year: number;
    actNumber: string;
    schedules: TOCSchedules[];
    chapters: TOCChapters[];
  };
}

// Document Content - START
export interface DocumentContentResponse {
  message: string;
  success: boolean;
  data: DocumentContentData;
}

interface DocumentContentData {
  content: DocumentContent;
  format: "structured" | "raw";
}

interface DocumentSchedule {
  id: string;
  schedule: string;
  scheduleNumber: number;
  scheduleTitle: string;
  markdownContent: string;
}

interface DocumentSection {
  id: string;
  markdownContent: string;
  section: string;
  sectionNumber: number;
  sectionTitle: string;
}

export interface DocumentParts {
  id: string;
  part: string;
  partNumber: string;
  partTitle: string;
  sections: DocumentSection[];
}

interface DocumentChapter {
  chapter: string;
  chapterNumber: number;
  chapterTitle: string;
  id: string;
  parts: DocumentParts[];
}

interface DocumentContent {
  id: string;
  actNumber: string;
  title: string;
  description: string;
  chapters: DocumentChapter[];
  year: number;
  commencementDate: string;
  schedules: DocumentSchedule[];
  metadata: {
    encoding: string;
    format: string;
    pageRange: string;
    publisher: string;
    source: string;
  };
}

// History - START
export interface HistoryResponse {
  success: boolean;
  message: string;
  data: HistoryData;
}

export interface HistoryData {
  pagination: Pagination;
  searches: Array<Searches>;
}

interface SearchResults {
  aiResponse: string;
  chunks: Array<{
    id: string;
    chapter: string;
    content: string;
  }>;
}

export interface Searches {
  createdAt: string;
  documentId: string;
  document: {
    id: string;
    title: string;
  };
  id: string;
  query: string;
  userId: string;
  results: Array<SearchResults>;
}
