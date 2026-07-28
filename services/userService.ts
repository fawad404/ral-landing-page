import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { User, ResetPasswordResponse } from '@/types/user.types';

export const userService = {
  getAll: async (params?: Record<string, string>): Promise<User[]> => {
    const res = await apiClient.get<User[]>(API_ENDPOINTS.USERS, { params });
    return res.data;
  },

  getPending: async (): Promise<User[]> => {
    const res = await apiClient.get<User[]>(API_ENDPOINTS.USERS_PENDING);
    return res.data;
  },

  getActivity: async (limit?: number): Promise<User[]> => {
    const res = await apiClient.get<User[]>(API_ENDPOINTS.USERS_ACTIVITY, {
      params: limit ? { limit } : {},
    });
    return res.data;
  },

  approve: async (id: string): Promise<User> => {
    const res = await apiClient.patch<User>(API_ENDPOINTS.USER_APPROVE(id));
    return res.data;
  },

  activate: async (id: string): Promise<User> => {
    const res = await apiClient.patch<User>(API_ENDPOINTS.USER_ACTIVATE(id));
    return res.data;
  },

  deactivate: async (id: string): Promise<User> => {
    const res = await apiClient.patch<User>(API_ENDPOINTS.USER_DEACTIVATE(id));
    return res.data;
  },

  resetPassword: async (id: string): Promise<ResetPasswordResponse> => {
    const res = await apiClient.patch<ResetPasswordResponse>(API_ENDPOINTS.USER_RESET_PASSWORD(id));
    return res.data;
  },
};
