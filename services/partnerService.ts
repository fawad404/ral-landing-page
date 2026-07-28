import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Partner, CreatePartnerDto, UpdatePartnerDto } from '@/types/partner.types';

export const partnerService = {
  // Facility / any auth — visible partners only
  getVisible: async (): Promise<Partner[]> => {
    const res = await apiClient.get<Partner[]>(API_ENDPOINTS.PARTNERS_VISIBLE);
    return res.data;
  },

  // Admin
  getAll: async (params?: Record<string, string>): Promise<Partner[]> => {
    const res = await apiClient.get<Partner[]>(API_ENDPOINTS.PARTNERS, { params });
    return res.data;
  },

  getCategories: async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>(API_ENDPOINTS.PARTNERS_CATEGORIES);
    return res.data;
  },

  getById: async (id: string): Promise<Partner> => {
    const res = await apiClient.get<Partner>(API_ENDPOINTS.PARTNER_BY_ID(id));
    return res.data;
  },

  approve: async (id: string): Promise<Partner> => {
    const res = await apiClient.patch<Partner>(API_ENDPOINTS.PARTNER_APPROVE(id));
    return res.data;
  },

  reject: async (id: string, reason?: string): Promise<Partner> => {
    const res = await apiClient.patch<Partner>(API_ENDPOINTS.PARTNER_REJECT(id), { reason });
    return res.data;
  },

  toggleVisibility: async (id: string): Promise<Partner> => {
    const res = await apiClient.patch<Partner>(API_ENDPOINTS.PARTNER_VISIBILITY(id));
    return res.data;
  },

  adminUpdate: async (id: string, data: Record<string, any>): Promise<Partner> => {
    const res = await apiClient.patch<Partner>(API_ENDPOINTS.PARTNER_BY_ID(id), data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PARTNER_BY_ID(id));
  },

  // Vendor
  getMy: async (): Promise<Partner[]> => {
    const res = await apiClient.get<Partner[]>(API_ENDPOINTS.PARTNERS_MY);
    return res.data;
  },

  createMy: async (data: CreatePartnerDto): Promise<Partner> => {
    const res = await apiClient.post<Partner>(API_ENDPOINTS.PARTNERS_MY, data);
    return res.data;
  },

  updateMy: async (id: string, data: UpdatePartnerDto): Promise<Partner> => {
    const res = await apiClient.patch<Partner>(API_ENDPOINTS.PARTNER_MY_UPDATE(id), data);
    return res.data;
  },

  uploadLogo: async (id: string, file: File): Promise<Partner> => {
    const form = new FormData();
    form.append('file', file);
    const res = await apiClient.post<Partner>(API_ENDPOINTS.PARTNER_MY_LOGO(id), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
