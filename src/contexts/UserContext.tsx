"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/common/types";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { UserService } from "@/api/user/user";
import AuthService from "@/api/auth/auth";

interface AuthData {
  token: string;
  user: User;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: AuthData) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from token and register logout function
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const mlToken = getCookie("mlToken");

        if (mlToken && typeof mlToken === "string") {
          // Token is a plain backend token - validate it and fetch user data
          setToken(mlToken);

          try {
            // Fetch user profile from backend to validate token and get user data
            const userData = await UserService.getUserProfile();

            if (userData.success && userData.data) {
              setUser(userData.data);
            } else {
              throw new Error("Invalid user data received");
            }
          } catch (fetchError) {
            console.error("Error fetching user profile:", fetchError);
            // Clear invalid token
            deleteCookie("mlToken");
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error initializing authentication:", error);
        // Clear invalid token
        deleteCookie("mlToken");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (authData: AuthData) => {
    try {
      // Store the backend token directly in cookie
      setCookie("mlToken", authData.token, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        httpOnly: false, // Set to false so client can access it
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/", // Ensure cookie is available across all paths
      });

      // Set user data and token in state
      setUser(authData.user);
      setToken(authData.token);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    await AuthService.logout(router);
  };

  const value: UserContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
