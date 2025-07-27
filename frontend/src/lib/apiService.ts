import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
}

export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.api(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Call refresh token endpoint
            const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
              refreshToken
            });

            // Store new tokens
            const { token, refreshToken: newRefreshToken } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('refreshToken', newRefreshToken);

            // Update auth header for original request
            originalRequest.headers.Authorization = `Bearer ${token}`;

            // Process queued requests
            this.processQueue(null, token);

            // Retry original request
            return this.api(originalRequest);
          } catch (err) {
            // If refresh fails, clear tokens and redirect to login
            this.processQueue(err, null);
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            
            // Show error message
            toast.error('Session expired. Please log in again.');
            
            // Redirect to login (you might want to use React Router instead)
            window.location.href = '/';
            return Promise.reject(err);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // Authentication endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/authenticate', data);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      // Don't throw error for logout, just clear local storage
      console.warn('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/refresh-token', { refreshToken });
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>('/auth/me');
    return response.data;
  }

  // Test endpoint
  async testConnection(): Promise<string> {
    const response = await this.api.get<string>('/auth/test');
    return response.data;
  }

  // Generic request method for other API calls
  async request<T>(endpoint: string, options: any = {}): Promise<T> {
    const response = await this.api.request<T>({
      url: endpoint,
      ...options,
    });
    return response.data;
  }
}

export const apiService = new ApiService(); 