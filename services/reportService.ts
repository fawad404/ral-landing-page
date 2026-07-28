import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { DashboardReport, FacilityReport, InquiryReport, PartnerReport } from '@/types/report.types';

export const reportService = {
  getDashboard: async (): Promise<DashboardReport> => {
    const res = await apiClient.get<DashboardReport>(API_ENDPOINTS.REPORTS_DASHBOARD);
    return res.data;
  },

  getFacilityStats: async (): Promise<FacilityReport> => {
    const res = await apiClient.get<FacilityReport>(API_ENDPOINTS.REPORTS_FACILITIES);
    return res.data;
  },

  getInquiryStats: async (): Promise<InquiryReport> => {
    const res = await apiClient.get<InquiryReport>(API_ENDPOINTS.REPORTS_INQUIRIES);
    return res.data;
  },

  getPartnerStats: async (): Promise<PartnerReport> => {
    const res = await apiClient.get<PartnerReport>(API_ENDPOINTS.REPORTS_PARTNERS);
    return res.data;
  },
};
