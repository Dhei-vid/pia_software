import { useUser } from "@/contexts/UserContext";

/**
 * Custom hook for authentication status and user data
 * Use this when you need to check auth status in components
 */
export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading } = useUser();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isLoggedIn: isAuthenticated,
  };
};

export default useAuth;
