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

export interface TaxReference {
  note: string;
  section: string;
}

export interface TaxBreakdown {
  description: string;
  amount: number;
  rate: string;
}

export interface TaxCalculation {
  amount?: number;
  eligible?: boolean;
  breakdown?: TaxBreakdown[];
  effectiveRate?: number;
}

export interface TaxResult {
  answer: string;
  confidence: string;
  references?: TaxReference[];
  taxCalculation?: TaxCalculation;
  message?: string;
}

export interface TaxQueryResponse {
  success: boolean;
  message: string;
  data?: TaxResult;
  result?: TaxResult;
}

export type APIResponse = SearchResponse | TaxQueryResponse;


export interface SearchResponse {
  data: SearchDataResponse;
  message: string;
  success: boolean;
}
