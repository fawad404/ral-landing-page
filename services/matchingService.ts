import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { MatchResult } from '@/types/inquiry.types';

export interface MatchingConfig {
  matchingWeights: { distance: number; services: number; budget: number };
  maxMatchResults: number;
}

export const matchingService = {
  runMatching: async (inquiryId: string): Promise<MatchResult> => {
    const res = await apiClient.post<MatchResult>(API_ENDPOINTS.MATCHING_RUN(inquiryId));
    return res.data;
  },

  manualAssign: async (inquiryId: string, facilityId: string, reason?: string) => {
    const res = await apiClient.post(API_ENDPOINTS.MATCHING_MANUAL_ASSIGN(inquiryId), {
      facilityId,
      reason,
    });
    return res.data;
  },

  getConfig: async (): Promise<MatchingConfig> => {
    const res = await apiClient.get<MatchingConfig>(API_ENDPOINTS.MATCHING_CONFIG);
    return res.data;
  },
};
