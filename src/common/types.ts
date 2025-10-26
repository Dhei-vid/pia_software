interface ChapterPart {
  id: string;
  title: string;
  isSelected?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
  parts: ChapterPart[];
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone?: string | null;
  avatar?: string | null;
  location: string;
  documentId: string;
  documentTitle: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserInput {
  fullName?: string;
  location?: string;
  company?: string;
  jobTitle?: string;
  avatar?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
