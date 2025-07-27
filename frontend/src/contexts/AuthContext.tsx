import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiService, User, LoginRequest, RegisterRequest } from '@/lib/apiService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
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

  const isAuthenticated = !!user;

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userData = await apiService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get current user:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await apiService.login(credentials);
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Try to get user data, but don't fail if it doesn't work
      try {
        const userData = await apiService.getCurrentUser();
        setUser(userData);
      } catch (userError) {
        console.warn('Could not fetch user data after login:', userError);
        // We can't create a user object from login data since we don't have the user info
        // This is a fallback - the user will need to refresh or try again
        toast.error('Login successful but could not fetch user data. Please try refreshing the page.');
        throw userError;
      }
      
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await apiService.register(userData);
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Try to get user data, but don't fail if it doesn't work
      try {
        const user = await apiService.getCurrentUser();
        setUser(user);
      } catch (userError) {
        console.warn('Could not fetch user data after registration:', userError);
        // Create a basic user object from the registration data
        setUser({
          id: 0, // We don't know the ID yet
          email: userData.email,
          firstname: userData.firstname,
          lastname: userData.lastname,
          role: 'USER'
        });
      }
      
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const refreshAuth = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await apiService.refreshToken(refreshToken);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      const userData = await apiService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 