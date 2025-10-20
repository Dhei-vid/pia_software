import axiosInstance from "@/utils/axios-instance";
import { extractErrorMessage } from "@/common/helpers";
import {
  CreateNoteRequest,
  UpdateNoteRequest,
  NotesResponse,
  NoteResponse,
  CreateNoteResponse,
  UpdateNoteResponse,
  DeleteNoteResponse,
} from "./notes-type";

export const NoteService = {
  // Create a new note
  createNote: async (
    noteData: CreateNoteRequest
  ): Promise<CreateNoteResponse> => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/notes/${noteData.documentId}`,
        { body: noteData.body }
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Get all notes for a specific document
  getNotesByDocument: async (documentId: string): Promise<NotesResponse> => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/notes/document/${documentId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Get all notes for the current user
  getAllNotes: async (): Promise<NotesResponse> => {
    try {
      const response = await axiosInstance.get(`/api/v1/notes`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Get a specific note by ID
  getNoteById: async (noteId: string): Promise<NoteResponse> => {
    try {
      const response = await axiosInstance.get(`/api/v1/notes/${noteId}`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Update an existing note
  updateNote: async (
    noteId: string,
    noteData: UpdateNoteRequest
  ): Promise<UpdateNoteResponse> => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/notes/${noteId}`,
        noteData
      );
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Delete a note
  deleteNote: async (noteId: string): Promise<DeleteNoteResponse> => {
    try {
      const response = await axiosInstance.delete(`/api/v1/notes/${noteId}`);
      return response.data;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  // Legacy method for backward compatibility
  createNotes: async (documentId: string, notes: { body: string }) => {
    return NoteService.createNote({ documentId, body: notes.body });
  },

  getNotes: async () => {
    return NoteService.getAllNotes();
  },

  getNotesById: async (noteId: string) => {
    return NoteService.getNoteById(noteId);
  },

  removeNote: async (notesId: string) => {
    return NoteService.deleteNote(notesId);
  },
};
