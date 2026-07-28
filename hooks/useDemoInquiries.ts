'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { demoInquiryService } from '@/services/demoInquiryService';

export const DEMO_INQUIRY_KEYS = {
  all: ['demo-inquiries'] as const,
  detail: (id: string) => ['demo-inquiries', id] as const,
};

export function useDemoInquiries(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...DEMO_INQUIRY_KEYS.all, params],
    queryFn: () => demoInquiryService.getAll(params),
  });
}

export function useDemoInquiry(id: string) {
  return useQuery({
    queryKey: DEMO_INQUIRY_KEYS.detail(id),
    queryFn: () => demoInquiryService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateDemoInquiry(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { status?: string; adminNotes?: string }) =>
      demoInquiryService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEMO_INQUIRY_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: DEMO_INQUIRY_KEYS.all });
      toast.success('Inquiry updated');
    },
    onError: () => toast.error('Update failed'),
  });
}

export function useDeleteDemoInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => demoInquiryService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEMO_INQUIRY_KEYS.all });
      toast.success('Inquiry deleted');
    },
    onError: () => toast.error('Delete failed'),
  });
}
