import axios from 'axios';
import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Caregiver, CreateCaregiverDto, UpdateCaregiverDto } from '@/types/caregiver.types';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface PaginatedCaregivers {
  data: Caregiver[];
  total: number;
  page: number;
  totalPages: number;
}

export const caregiverService = {
  apply: async (data: CreateCaregiverDto): Promise<Caregiver> => {
    const res = await axios.post<Caregiver>(`${baseURL}${API_ENDPOINTS.CAREGIVERS_APPLY}`, data);
    return res.data;
  },

  getVisible: async (params?: Record<string, string>): Promise<PaginatedCaregivers> => {
    const res = await apiClient.get<PaginatedCaregivers>(API_ENDPOINTS.CAREGIVERS_VISIBLE, { params });
    return res.data;
  },

  getAll: async (params?: Record<string, string>): Promise<Caregiver[]> => {
    const res = await apiClient.get<Caregiver[]>(API_ENDPOINTS.CAREGIVERS, { params });
    return res.data;
  },

  getById: async (id: string): Promise<Caregiver> => {
    const res = await apiClient.get<Caregiver>(API_ENDPOINTS.CAREGIVER_BY_ID(id));
    return res.data;
  },

  create: async (data: CreateCaregiverDto): Promise<Caregiver> => {
    const res = await apiClient.post<Caregiver>(API_ENDPOINTS.CAREGIVERS, data);
    return res.data;
  },

  update: async (id: string, data: UpdateCaregiverDto): Promise<Caregiver> => {
    const res = await apiClient.patch<Caregiver>(API_ENDPOINTS.CAREGIVER_BY_ID(id), data);
    return res.data;
  },

  approve: async (id: string): Promise<Caregiver> => {
    const res = await apiClient.patch<Caregiver>(API_ENDPOINTS.CAREGIVER_APPROVE(id));
    return res.data;
  },

  reject: async (id: string): Promise<Caregiver> => {
    const res = await apiClient.patch<Caregiver>(API_ENDPOINTS.CAREGIVER_REJECT(id));
    return res.data;
  },

  toggleVisibility: async (id: string): Promise<Caregiver> => {
    const res = await apiClient.patch<Caregiver>(API_ENDPOINTS.CAREGIVER_VISIBILITY(id));
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CAREGIVER_BY_ID(id));
  },
};
