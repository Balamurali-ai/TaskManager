import { useState, useEffect } from "react";
import { checkLoginStatus, getUserProfile } from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const isLoggedIn = await checkLoginStatus();
        setIsAuthenticated(isLoggedIn);
        
        if (isLoggedIn) {
          const userProfile = await getUserProfile();
          setUser(userProfile);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  return {
    user,
    isAuthenticated,
    loading,
    updateUser,
  };
};