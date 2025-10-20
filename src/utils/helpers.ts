import { User } from "@/common/types";
import jwt, { SignOptions } from "jsonwebtoken";

interface Payload {
  [key: string]: User;
}

const tokenSecret = process.env.NEXT_PUBLIC_JWT_SECRET as string;

export const generateToken = (data: Payload, time: string | number): string => {
  if (!tokenSecret) {
    throw new Error("JWT secret is not defined, GEN");
  }

  const options: SignOptions = {
    expiresIn: time as SignOptions["expiresIn"],
  };

  const token = jwt.sign(data, tokenSecret, options);
  return token;
};

interface DecryptTokenResult {
  success: boolean;
  data: Payload | null;
}

export const decryptToken = (token: string): DecryptTokenResult => {
  let tokenData: DecryptTokenResult = { success: false, data: null };
  if (!tokenSecret) {
    throw new Error("JWT secret is not defined");
  }
  jwt.verify(token, tokenSecret, (error, decoded) => {
    if (!error && decoded) {
      tokenData = { success: true, data: decoded as Payload };
    }
  });
  return tokenData;
};

export const host = process.env.NEXT_PUBLIC_BASE_URL;
export const xApiKey = process.env.NEXT_PUBLIC_AUTH_API_KEY;
