import { Pagination } from "@/common/types";

export interface Note {
  id: string;
  body: string;
  document?: { id: string; title: string };
  documentId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  body: string;
  documentId: string;
}

export interface UpdateNoteRequest {
  body: string;
}

interface NotesData {
  notes: Note[];
  pagination: Pagination;
}

export interface NotesResponse {
  success: boolean;
  message: string;
  data: NotesData;
}

export interface NoteResponse {
  success: boolean;
  message: string;
  data: Note;
}

export interface CreateNoteResponse {
  success: boolean;
  message: string;
  data: Note;
}

export interface UpdateNoteResponse {
  success: boolean;
  message: string;
  data: Note;
}

export interface DeleteNoteResponse {
  success: boolean;
  message: string;
}
