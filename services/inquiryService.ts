import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Inquiry, CreateInquiryDto } from '@/types/inquiry.types';

export const inquiryService = {
  getAll: async (params?: Record<string, string>): Promise<Inquiry[]> => {
    const res = await apiClient.get<Inquiry[]>(API_ENDPOINTS.INQUIRIES, { params });
    return res.data;
  },

  getById: async (id: string): Promise<Inquiry> => {
    const res = await apiClient.get<Inquiry>(API_ENDPOINTS.INQUIRY_BY_ID(id));
    return res.data;
  },

  create: async (data: CreateInquiryDto): Promise<Inquiry> => {
    const res = await apiClient.post<Inquiry>(API_ENDPOINTS.INQUIRIES, data);
    return res.data;
  },

  update: async (id: string, data: Partial<Inquiry>): Promise<Inquiry> => {
    const res = await apiClient.patch<Inquiry>(API_ENDPOINTS.INQUIRY_BY_ID(id), data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.INQUIRY_BY_ID(id));
  },
};
