import { User } from "@/common/types";

export interface userResponse {
  data: User;
  message: string;
  success: boolean;
}

interface Issues {
  field: string;
  message: string;
}

export interface userErrorResponse {
  error: string;
  errors: string[];
  issues: Issues[];
  message: string;
  success: boolean;
}
