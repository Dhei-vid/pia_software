"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  location?: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage or API
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check localStorage for existing user data
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          // For demo purposes, create a default user
          // In production, this would come from your authentication API
          const defaultUser: User = {
            id: 'demo-user-123',
            name: 'Williams Chang',
            email: 'williams.chang@example.com',
            company: 'Wright Energy Corp',
            role: 'Petroleum Engineer',
            location: 'Houston, TX'
          };
          setUser(defaultUser);
          localStorage.setItem('currentUser', JSON.stringify(defaultUser));
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    // Redirect to sign-in page
    window.location.href = '/signin';
  };

  const value: UserContextType = {
    user,
    setUser,
    isLoading,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
