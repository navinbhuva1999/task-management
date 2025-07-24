import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLogin, useRegister, useVerifyOtp, useLogout } from '../hooks/api/useAuth';
import { getStoredUser, isAuthenticated, storeAuthData } from '../utils/auth/authUtils';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loginMutation = useLogin({
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data.user);
      }
    }
  });

  const registerMutation = useRegister({
    onSuccess: (data) => {
      if (data.success) {
        setUser(data.data.user);
      }
    }
  });

  const verifyOtpMutation = useVerifyOtp();
  const logoutFn = useLogout();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = getStoredUser();
          setUser(userData);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      return await loginMutation.mutateAsync(credentials);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      return await registerMutation.mutateAsync(userData);
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (otpData) => {
    try {
      return await verifyOtpMutation.mutateAsync(otpData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    logoutFn();
  };

  const updateProfileImage = (profileImageData) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      profile_image: profileImageData
    };
    
    setUser(updatedUser);
    
    const authToken = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (authToken && refreshToken) {
      storeAuthData({
        token: authToken,
        refreshToken: refreshToken,
        user: updatedUser
      });
    }
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    verifyOtp,
    logout,
    updateProfileImage,
    loginLoading: loginMutation.isPending,
    registerLoading: registerMutation.isPending,
    verifyOtpLoading: verifyOtpMutation.isPending
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 