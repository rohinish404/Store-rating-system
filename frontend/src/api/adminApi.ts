import axiosInstance from './axiosInstance';
import type { User, Store, DashboardStats, Role } from '../types';

export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get<DashboardStats>(
      '/admin/dashboard/stats',
    );
    return response.data;
  },

  getUsers: async (filters?: {
    name?: string;
    email?: string;
    address?: string;
    role?: Role | '';
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<User[]> => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.email) params.append('email', filters.email);
    if (filters?.address) params.append('address', filters.address);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await axiosInstance.get<User[]>(
      `/admin/users?${params.toString()}`,
    );
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    address: string;
    role: Role;
  }): Promise<User> => {
    const response = await axiosInstance.post<User>('/admin/users', userData);
    return response.data;
  },

  getStores: async (filters?: {
    name?: string;
    email?: string;
    address?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<Store[]> => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.email) params.append('email', filters.email);
    if (filters?.address) params.append('address', filters.address);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await axiosInstance.get<Store[]>(
      `/admin/stores?${params.toString()}`,
    );
    return response.data;
  },

  createStore: async (storeData: {
    name: string;
    email: string;
    address: string;
    ownerId: string;
  }): Promise<Store> => {
    const response = await axiosInstance.post<Store>(
      '/admin/stores',
      storeData,
    );
    return response.data;
  },

  getStoreOwners: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/admin/users?role=storeOwner');
    return response.data;
  },
};
