export interface Checklist {
  id: string;
  item: string;
  documentId: string;
  userId: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  document?: {
    id: string;
    title: string;
  };
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
  data: { checklist: Array<Checklist> };
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
