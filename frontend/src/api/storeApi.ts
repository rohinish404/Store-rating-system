import axiosInstance from './axiosInstance';
import type { Store, StoreWithUserRating } from '../types';

export const storeApi = {
  getAllStores: async (filters?: {
    name?: string;
    address?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<StoreWithUserRating[]> => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.address) params.append('address', filters.address);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await axiosInstance.get<StoreWithUserRating[]>(`/user/stores?${params.toString()}`);
    return response.data;
  },

  getStoreById: async (id: string): Promise<Store> => {
    const response = await axiosInstance.get<Store>(`/user/stores/${id}`);
    return response.data;
  },
};
