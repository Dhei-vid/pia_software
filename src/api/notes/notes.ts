import axiosInstance from "@/utils/axios-instance";
import { extractErrorMessage } from "@/common/helpers";

export const NoteService = {
  createNotes: async (documentId: string, notes: { body: string }) => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/notes/${documentId}`,
        notes
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  getNotes: async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/notes`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  getNotesById: async (noteId: string) => {
    try {
      const response = await axiosInstance.get(`/api/v1/notes/${noteId}`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Not found
  updateNote: async () => {
    try {
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  removeNote: async (notesId: string) => {
    try {
      const response = await axiosInstance.delete(`/api/v1/notes/${notesId}`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },
};
