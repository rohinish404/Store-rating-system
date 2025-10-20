import axiosInstance from './axiosInstance';
import type { AuthResponse, User } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    address: string;
  }): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/profile');
    return response.data;
  },
};
