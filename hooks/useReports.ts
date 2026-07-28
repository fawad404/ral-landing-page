'use client';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/reportService';

export function useDashboardReport() {
  return useQuery({ queryKey: ['reports', 'dashboard'], queryFn: reportService.getDashboard });
}

export function useFacilityReport() {
  return useQuery({ queryKey: ['reports', 'facilities'], queryFn: reportService.getFacilityStats });
}

export function useInquiryReport() {
  return useQuery({ queryKey: ['reports', 'inquiries'], queryFn: reportService.getInquiryStats });
}

export function usePartnerReport() {
  return useQuery({ queryKey: ['reports', 'partners'], queryFn: reportService.getPartnerStats });
}
