import { useState, useCallback } from "react";
import { ChecklistService } from "@/api/checklist/checklist";
import {
  CreateChecklistRequest,
  UpdateChecklistRequest,
  Checklist,
} from "@/api/checklist/checklist-type";

export const useChecklists = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createChecklist = useCallback(
    async (checklistData: CreateChecklistRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await ChecklistService.createChecklist(checklistData);
        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create checklist";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateChecklist = useCallback(
    async (checklistId: string, checklistData: UpdateChecklistRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await ChecklistService.updateChecklist(
          checklistId,
          checklistData
        );
        setChecklists((prev) =>
          prev.map((checklist) =>
            checklist.id === checklistId ? response.data : checklist
          )
        );
        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update checklist";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteChecklist = useCallback(async (checklistId: string) => {
    setLoading(true);
    setError(null);
    try {
      await ChecklistService.deleteChecklist(checklistId);
      setChecklists((prev) =>
        prev.filter((checklist) => checklist.id !== checklistId)
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete checklist";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChecklists = useCallback(async (documentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ChecklistService.getAllChecklists(documentId);
      console.log("Hook: fetched checklists ", response.data.checklist);
      setChecklists(response.data.checklist);
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch checklists";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    checklists,
    loading,
    error,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    fetchChecklists,
    clearError,
  };
};
