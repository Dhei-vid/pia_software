import axiosInstance from "@/utils/axios-instance";
import { extractErrorMessage } from "@/common/helpers";
// import { UpdateCheckListResponse } from "./checklist-type";

export const checklistService = {
  getCheckListById: async (documentId: string) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/checklists/${documentId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Get checklist error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateCheckList: async (documentId: string) => {
    try {
      const response = await axiosInstance.patch(
        `/api/v1/checklists/${documentId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Update checklist error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  addCheckList: async () => {
    try {
      const response = await axiosInstance.post("");
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Add checklist error:", errorMessage);
      throw new Error(errorMessage);
    }
  },

  removeCheckList: async (checklistId: string) => {
    try {
      const response = await axiosInstance.delete(
        `api/v1/checklists/${checklistId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      console.error("Remove checklist error:", errorMessage);
      throw new Error(errorMessage);
    }
  },
};
