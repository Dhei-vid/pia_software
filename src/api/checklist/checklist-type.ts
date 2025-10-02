export interface Checklist {
  id: string;
  name: string;
  documentId: string;
  userId: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChecklistRequest {
  name: string;
  documentId: string;
}

export interface UpdateChecklistRequest {
  name?: string;
  completed?: boolean;
}

export interface ChecklistResponse {
  success: boolean;
  message: string;
  data: Checklist;
}

export interface ChecklistsResponse {
  success: boolean;
  message: string;
  data: Checklist[];
}

export interface CreateChecklistResponse {
  success: boolean;
  message: string;
  data: Checklist;
}

export interface UpdateChecklistResponse {
  success: boolean;
  message: string;
  data: Checklist;
}

export interface DeleteChecklistResponse {
  success: boolean;
  message: string;
}
