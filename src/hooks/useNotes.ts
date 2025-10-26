import { useState, useCallback } from "react";
import { NoteService } from "@/api/notes/notes";
import {
  Note,
  CreateNoteRequest,
  UpdateNoteRequest,
  NotesResponse,
} from "@/api/notes/notes-type";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all notes for the current user
  const getAllNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = (await NoteService.getAllNotes()) as NotesResponse;
      setNotes(response.data.notes);
      return response.data.notes;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch notes";
      setError(errorMessage);
      setNotes([]);
      console.error("Failed to fetch notes:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a specific note by ID
  const getNoteById = useCallback(async (noteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await NoteService.getNoteById(noteId);
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch note";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new note
  const createNote = useCallback(async (noteData: CreateNoteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await NoteService.createNote(noteData);
      setNotes((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create note";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing note
  const updateNote = useCallback(
    async (noteId: string, noteData: UpdateNoteRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await NoteService.updateNote(noteId, noteData);
        setNotes((prev) =>
          prev.map((note) => (note.id === noteId ? response.data : note))
        );
        return response.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update note";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete a note
  const deleteNote = useCallback(async (noteId: string) => {
    setLoading(true);
    setError(null);
    try {
      await NoteService.deleteNote(noteId);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete note";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    notes,
    loading,
    error,
    getAllNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
  };
};
