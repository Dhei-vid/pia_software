import { useState, useCallback } from "react";
import { DocumentService } from "@/api/documents/document";
import {
  Document,
  SearchHistoryItem,
  AIProcessingStatus,
  SearchRequest,
  SearchResponse,
  // DocumentResponse,
  // UploadResponse,
} from "@/api/documents/document-types";
import { Pagination } from "@/common/types";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllDocuments = useCallback(
    async (page: number = 1, limit: number = 10) => {
      setLoading(true);
      setError(null);
      try {
        const data = await DocumentService.getAllDocuments(page, limit);
        setDocuments(data.documents);
        setPagination(data.pagination);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch documents";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getDocument = useCallback(async (documentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await DocumentService.getDocument(documentId);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch document";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (documentId: string) => {
    setLoading(true);
    setError(null);
    try {
      await DocumentService.deleteDocument(documentId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete document";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);
      try {
        const data = await DocumentService.uploadDocument(file);
        // Optionally refresh the documents list after upload
        await getAllDocuments();
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload document";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [getAllDocuments]
  );

  return {
    documents,
    pagination,
    loading,
    error,
    getAllDocuments,
    getDocument,
    deleteDocument,
    uploadDocument,
  };
};

export const useDocumentSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDocument = useCallback(
    async (documentId: string, searchRequest: SearchRequest) => {
      setLoading(true);
      setError(null);
      try {
        const data = await DocumentService.searchDocument(
          documentId,
          searchRequest
        );
        setSearchResults(data);
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Search failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearSearchResults = useCallback(() => {
    setSearchResults(null);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchDocument,
    clearSearchResults,
  };
};

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSearchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DocumentService.getSearchHistory();
      setSearchHistory(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch search history";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchHistory,
    loading,
    error,
    getSearchHistory,
  };
};

export const useAIProcessingStatus = (documentId: string) => {
  const [status, setStatus] = useState<AIProcessingStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProcessingStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DocumentService.getAIProcessingStatus(documentId);
      setStatus(data);
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch processing status";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  return {
    status,
    loading,
    error,
    getProcessingStatus,
  };
};
