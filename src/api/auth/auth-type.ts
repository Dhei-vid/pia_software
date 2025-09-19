import { User } from "@/common/types";

export interface Auth {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}
