import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { supabase } from '@/lib/supabase';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
}

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config): Promise<InternalAxiosRequestConfig> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g., redirect to login)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Define user profile type for better type safety
interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
}

// API methods
export const userService = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    try {
      const response = await api.get<UserProfile>('/user');
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      };
    }
  },
};

export default api;