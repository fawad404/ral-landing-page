import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth.types';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, data);
    return res.data;
  },
};
