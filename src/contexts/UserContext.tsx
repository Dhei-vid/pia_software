"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { User } from "@/common/types";
import AuthService from "@/api/auth/auth";
// import { UserService } from "@/api/user/user";

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

  // ✅ Initialize from cookies/localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = getCookie("mlToken");
        const savedUser = localStorage.getItem("mlUser");

        if (savedToken && typeof savedToken === "string") {
          setToken(savedToken);

          if (savedUser) {
            // Restore user data from localStorage
            setUser(JSON.parse(savedUser));
          } else {
            // Optionally fetch from backend to validate
            // const userData = await UserService.getUserProfile();
            // if (userData.success && userData.data) {
            //   setUser(userData.data);
            //   localStorage.setItem("mlUser", JSON.stringify(userData.data));
            // } else {
            //   throw new Error("Invalid user data");
            // }
          }
        }
      } catch (error) {
        console.error("Error initializing authentication:", error);
        handleClearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ✅ Login: save token + user
  const login = (authData: AuthData) => {
    try {
      // Store token in cookie
      setCookie("mlToken", authData.token, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
      // Store user in localStorage
      localStorage.setItem("mlUser", JSON.stringify(authData.user));

      setUser(authData.user);
      setToken(authData.token);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  // ✅ Logout: clear everything
  const handleClearAuth = () => {
    deleteCookie("mlToken");
    localStorage.removeItem("mlUser");
    setUser(null);
    setToken(null);
  };

  const logout = async () => {
    try {
      await AuthService.logout(router);
    } finally {
      handleClearAuth();
    }
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
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
