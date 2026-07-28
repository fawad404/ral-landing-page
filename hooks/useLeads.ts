'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { leadService } from '@/services/leadService';

export const LEAD_KEYS = {
  all: ['leads'] as const,
  detail: (id: string) => ['leads', id] as const,
};

export function useLeads(params?: Record<string, string>) {
  return useQuery({ queryKey: [...LEAD_KEYS.all, params], queryFn: () => leadService.getAll(params) });
}

export function useLead(id: string) {
  return useQuery({ queryKey: LEAD_KEYS.detail(id), queryFn: () => leadService.getById(id), enabled: !!id });
}

export function useUpdateLead(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { status?: string; adminNotes?: string }) => leadService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LEAD_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: LEAD_KEYS.all });
      toast.success('Lead updated');
    },
    onError: () => toast.error('Update failed'),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: LEAD_KEYS.all }); toast.success('Lead deleted'); },
    onError: () => toast.error('Delete failed'),
  });
}

export function useCreateLeadAccount(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ password, loginUrl }: { password: string; loginUrl: string }) =>
      leadService.createAccount(id, password, loginUrl),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LEAD_KEYS.detail(id) });
      toast.success('Account created and login details sent via email');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create account'),
  });
}
