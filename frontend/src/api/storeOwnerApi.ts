import axiosInstance from './axiosInstance';
import type { Rating } from '../types';

export interface StoreOwnerDashboard {
  storeId: string;
  storeName: string;
  email: string;
  address: string;
  averageRating: number;
  totalRatings: number;
}

export interface RatingWithUser extends Omit<Rating, 'user'> {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const storeOwnerApi = {
  getStoreRatings: async (): Promise<RatingWithUser[]> => {
    const response = await axiosInstance.get<RatingWithUser[]>('/store-owner/ratings');
    return response.data;
  },

  getDashboard: async (): Promise<StoreOwnerDashboard> => {
    const response = await axiosInstance.get<StoreOwnerDashboard>('/store-owner/dashboard');
    return response.data;
  },

  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await axiosInstance.patch('/store-owner/password', {
      currentPassword,
      newPassword,
    });
  },
};
