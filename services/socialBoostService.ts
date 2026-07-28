import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { SocialBoostSubmission, UpdateSocialBoostStatusDto } from '@/types/social-boost.types';

export const socialBoostService = {
  submit: async (caption: string, category: string, channel: string, file?: File): Promise<SocialBoostSubmission> => {
    const form = new FormData();
    form.append('caption', caption);
    form.append('category', category);
    form.append('channel', channel);
    if (file) form.append('file', file);
    const res = await apiClient.post<SocialBoostSubmission>(API_ENDPOINTS.SOCIAL_BOOST_SUBMIT, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getMy: async (): Promise<SocialBoostSubmission[]> => {
    const res = await apiClient.get<SocialBoostSubmission[]>(API_ENDPOINTS.SOCIAL_BOOST_MY);
    return res.data;
  },

  getAll: async (status?: string): Promise<SocialBoostSubmission[]> => {
    const res = await apiClient.get<SocialBoostSubmission[]>(API_ENDPOINTS.SOCIAL_BOOST_ALL, {
      params: status ? { status } : undefined,
    });
    return res.data;
  },

  updateStatus: async (id: string, dto: UpdateSocialBoostStatusDto): Promise<SocialBoostSubmission> => {
    const res = await apiClient.patch<SocialBoostSubmission>(API_ENDPOINTS.SOCIAL_BOOST_STATUS(id), dto);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.SOCIAL_BOOST_DELETE(id));
  },
};
