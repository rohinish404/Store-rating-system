import axiosInstance from './axiosInstance';

export const userApi = {
  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await axiosInstance.patch('/user/password', {
      currentPassword,
      newPassword,
    });
  },
};
