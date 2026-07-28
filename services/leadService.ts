import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Lead } from '@/types/lead.types';

export const leadService = {
  getAll: async (params?: Record<string, string>): Promise<Lead[]> => {
    const res = await apiClient.get<Lead[]>(API_ENDPOINTS.LEADS, { params });
    return res.data;
  },

  getById: async (id: string): Promise<Lead> => {
    const res = await apiClient.get<Lead>(API_ENDPOINTS.LEAD_BY_ID(id));
    return res.data;
  },

  update: async (id: string, data: { status?: string; adminNotes?: string }): Promise<Lead> => {
    const res = await apiClient.patch<Lead>(API_ENDPOINTS.LEAD_BY_ID(id), data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.LEAD_BY_ID(id));
  },

  createAccount: async (id: string, password: string, loginUrl: string): Promise<{ email: string }> => {
    const res = await apiClient.post(API_ENDPOINTS.LEAD_CREATE_ACCOUNT(id), { password, loginUrl });
    return res.data;
  },
};
