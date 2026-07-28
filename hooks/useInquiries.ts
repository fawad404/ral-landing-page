'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { inquiryService } from '@/services/inquiryService';
import { matchingService } from '@/services/matchingService';

export const INQUIRY_KEYS = {
  all: ['inquiries'] as const,
  detail: (id: string) => ['inquiries', id] as const,
};

export function useInquiries(params?: Record<string, string>) {
  return useQuery({ queryKey: [...INQUIRY_KEYS.all, params], queryFn: () => inquiryService.getAll(params) });
}

export function useInquiry(id: string) {
  return useQuery({ queryKey: INQUIRY_KEYS.detail(id), queryFn: () => inquiryService.getById(id), enabled: !!id });
}

export function useUpdateInquiry(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => inquiryService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: INQUIRY_KEYS.detail(id) }); toast.success('Inquiry updated'); },
    onError: () => toast.error('Update failed'),
  });
}

export function useRunMatching(inquiryId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => matchingService.runMatching(inquiryId),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: INQUIRY_KEYS.detail(inquiryId) });
      toast.success(data.message);
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Matching failed'),
  });
}

export function useManualAssign(inquiryId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ facilityId, reason }: { facilityId: string; reason?: string }) =>
      matchingService.manualAssign(inquiryId, facilityId, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INQUIRY_KEYS.detail(inquiryId) });
      toast.success('Facility assigned');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Assignment failed'),
  });
}

export function useDeleteInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inquiryService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: INQUIRY_KEYS.all }); toast.success('Inquiry deleted'); },
    onError: () => toast.error('Delete failed'),
  });
}
