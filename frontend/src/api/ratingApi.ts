import axiosInstance from './axiosInstance';
import type { Rating } from '../types';

export const ratingApi = {
  createRating: async (storeId: string, rating: number): Promise<Rating> => {
    const response = await axiosInstance.post<Rating>(`/user/stores/${storeId}/rating`, {
      rating,
    });
    return response.data;
  },

  updateRating: async (storeId: string, rating: number): Promise<Rating> => {
    const response = await axiosInstance.patch<Rating>(`/user/stores/${storeId}/rating`, {
      rating,
    });
    return response.data;
  },
};
