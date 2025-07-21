'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, User, SignInRequest, SignUpRequest, handleApiError } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: SignInRequest) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpRequest) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      // Verify token and get user data
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('accessToken');
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (credentials: SignInRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiClient.signIn(credentials);
      
      if (response.success && response.data) {
        // Store access token
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);
        
        // Redirect based on user role
        const dashboardRoute = getDashboardRoute(response.data.user.role);
        router.push(dashboardRoute);
        
        return { success: true };
      } else {
        return { success: false, error: handleApiError(response) };
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiClient.signUp(data);
      
      if (response.success && response.data) {
        // Store access token
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);
        
        // Redirect to admin dashboard (signup creates admin user)
        router.push('/admin/dashboard');
        
        return { success: true };
      } else {
        return { success: false, error: handleApiError(response) };
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Call API to revoke refresh token
      await apiClient.signOut();
    } catch (error) {
      console.error('Sign out API call failed:', error);
    } finally {
      // Always clear local state regardless of API call result
      localStorage.removeItem('accessToken');
      setUser(null);
      router.push('/login');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const getDashboardRoute = (role: User['role']): string => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'site_manager':
        return '/site-manager/dashboard';
      case 'worker':
        return '/worker/dashboard';
      case 'client':
        return '/client/dashboard';
      default:
        return '/login';
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};