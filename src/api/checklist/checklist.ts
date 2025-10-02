import axiosInstance from "@/utils/axios-instance";
import { extractErrorMessage } from "@/common/helpers";
import {
  Checklist,
  CreateChecklistRequest,
  UpdateChecklistRequest,
  ChecklistResponse,
  ChecklistsResponse,
  CreateChecklistResponse,
  UpdateChecklistResponse,
  DeleteChecklistResponse,
} from "./checklist-type";

export const ChecklistService = {
  // Create a new checklist
  createChecklist: async (
    checklistData: CreateChecklistRequest
  ): Promise<CreateChecklistResponse> => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/checklists`,
        checklistData
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Create checklist error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Get all checklists for a specific document
  getChecklistsByDocument: async (documentId: string): Promise<ChecklistsResponse> => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/checklists/document/${documentId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Get checklists error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Get all checklists for the current user
  getAllChecklists: async (): Promise<ChecklistsResponse> => {
    try {
      const response = await axiosInstance.get(`/api/v1/checklists`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Get all checklists error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Get a specific checklist by ID
  getChecklistById: async (checklistId: string): Promise<ChecklistResponse> => {
    try {
      const response = await axiosInstance.get(`/api/v1/checklists/${checklistId}`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Get checklist error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Update an existing checklist
  updateChecklist: async (
    checklistId: string,
    checklistData: UpdateChecklistRequest
  ): Promise<UpdateChecklistResponse> => {
    try {
      const response = await axiosInstance.patch(
        `/api/v1/checklists/${checklistId}`,
        checklistData
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Update checklist error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Delete a checklist
  deleteChecklist: async (checklistId: string): Promise<DeleteChecklistResponse> => {
    try {
      const response = await axiosInstance.delete(`/api/v1/checklists/${checklistId}`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Delete checklist error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Legacy methods for backward compatibility
  getCheckList: async (documentId: string) => {
    return ChecklistService.getChecklistsByDocument(documentId);
  },

  updateCheckList: async (checklistId: string) => {
    return ChecklistService.updateChecklist(checklistId, { completed: true });
  },

  addCheckList: async (documentId: string) => {
    return ChecklistService.createChecklist({ 
      name: "New Checklist", 
      documentId 
    });
  },

  removeCheckList: async (checklistId: string) => {
    return ChecklistService.deleteChecklist(checklistId);
  },
};
