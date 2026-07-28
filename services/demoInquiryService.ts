import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { DemoInquiry } from '@/types/demo-inquiry.types';

export const demoInquiryService = {
  getAll: async (params?: Record<string, string>): Promise<DemoInquiry[]> => {
    const res = await apiClient.get<DemoInquiry[]>(API_ENDPOINTS.DEMO_INQUIRIES, { params });
    return res.data;
  },

  getById: async (id: string): Promise<DemoInquiry> => {
    const res = await apiClient.get<DemoInquiry>(API_ENDPOINTS.DEMO_INQUIRY_BY_ID(id));
    return res.data;
  },

  update: async (id: string, data: { status?: string; adminNotes?: string }): Promise<DemoInquiry> => {
    const res = await apiClient.patch<DemoInquiry>(API_ENDPOINTS.DEMO_INQUIRY_BY_ID(id), data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.DEMO_INQUIRY_BY_ID(id));
  },
};
