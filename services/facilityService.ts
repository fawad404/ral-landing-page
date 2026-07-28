import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { Facility, UpdateFacilityDto, UpdateAvailabilityDto } from '@/types/facility.types';

export const facilityService = {
  create: async (data: { name: string }): Promise<Facility> => {
    const res = await apiClient.post<Facility>(API_ENDPOINTS.FACILITIES, data);
    return res.data;
  },

  getAll: async (params?: Record<string, string>): Promise<Facility[]> => {
    const res = await apiClient.get<Facility[]>(API_ENDPOINTS.FACILITIES, { params });
    return res.data;
  },

  getMy: async (): Promise<Facility[]> => {
    const res = await apiClient.get<Facility[]>(API_ENDPOINTS.FACILITIES_MY);
    return res.data;
  },

  getFlagged: async (): Promise<Facility[]> => {
    const res = await apiClient.get<Facility[]>(API_ENDPOINTS.FACILITIES_FLAGGED);
    return res.data;
  },

  getById: async (id: string): Promise<Facility> => {
    const res = await apiClient.get<Facility>(API_ENDPOINTS.FACILITY_BY_ID(id));
    return res.data;
  },

  update: async (id: string, data: UpdateFacilityDto): Promise<Facility> => {
    const res = await apiClient.patch<Facility>(API_ENDPOINTS.FACILITY_BY_ID(id), data);
    return res.data;
  },

  updateAvailability: async (id: string, data: UpdateAvailabilityDto): Promise<Facility> => {
    const res = await apiClient.patch<Facility>(API_ENDPOINTS.FACILITY_AVAILABILITY(id), data);
    return res.data;
  },

  approve: async (id: string): Promise<Facility> => {
    const res = await apiClient.patch<Facility>(API_ENDPOINTS.FACILITY_APPROVE(id));
    return res.data;
  },

  reject: async (id: string): Promise<Facility> => {
    const res = await apiClient.patch<Facility>(API_ENDPOINTS.FACILITY_REJECT(id));
    return res.data;
  },

  activate: async (id: string): Promise<Facility> => {
    const res = await apiClient.patch<Facility>(API_ENDPOINTS.FACILITY_ACTIVATE(id));
    return res.data;
  },

  deactivate: async (id: string): Promise<Facility> => {
    const res = await apiClient.patch<Facility>(API_ENDPOINTS.FACILITY_DEACTIVATE(id));
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.FACILITY_BY_ID(id));
  },

  addPhoto: async (id: string, file: File, label: string): Promise<import('@/types/facility.types').Facility> => {
    const form = new FormData();
    form.append('file', file);
    form.append('label', label);
    const res = await apiClient.post<import('@/types/facility.types').Facility>(API_ENDPOINTS.FACILITY_PHOTOS(id), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  removePhoto: async (id: string, publicId: string): Promise<void> => {
    // publicId is passed as a query param to avoid slash issues in route params
    await apiClient.delete(API_ENDPOINTS.FACILITY_PHOTOS(id), { params: { publicId } });
  },
};
