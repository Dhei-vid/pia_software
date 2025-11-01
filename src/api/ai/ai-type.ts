export interface SearchResponseChunks {
  id: string;
  embedding?: string | null;
  documentId: string;
  createdAt: string;
  content: string;
  chapter: string;
}

export interface SearchResult {
  answer: string;
  chunks: Array<SearchResponseChunks>;
}

export interface SearchDataResponse {
  results: SearchResult;
  searchId: string;
}

export interface SearchResponse {
  data: SearchDataResponse;
  message: string;
  success: boolean;
}
