'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { partnerService } from '@/services/partnerService';
import type { CreatePartnerDto, UpdatePartnerDto } from '@/types/partner.types';

export const PARTNER_KEYS = {
  all: ['partners'] as const,
  my: ['partners', 'my'] as const,
  categories: ['partners', 'categories'] as const,
  detail: (id: string) => ['partners', id] as const,
};

// ── Facility hook — visible partners only ────────────────────────────────────

export function useVisiblePartners() {
  return useQuery({ queryKey: [...PARTNER_KEYS.all, 'visible'], queryFn: partnerService.getVisible });
}

// ── Admin hooks ───────────────────────────────────────────────────────────────

export function usePartners(params?: Record<string, string>) {
  return useQuery({ queryKey: [...PARTNER_KEYS.all, params], queryFn: () => partnerService.getAll(params) });
}

export function usePartnerCategories() {
  return useQuery({ queryKey: PARTNER_KEYS.categories, queryFn: partnerService.getCategories });
}

export function useApprovePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnerService.approve(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PARTNER_KEYS.all }); toast.success('Partner approved'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Action failed'),
  });
}

export function useRejectPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => partnerService.reject(id, reason),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PARTNER_KEYS.all }); toast.success('Partner rejected'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Action failed'),
  });
}

export function useTogglePartnerVisibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnerService.toggleVisibility(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PARTNER_KEYS.all }); toast.success('Visibility updated'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Action failed'),
  });
}

export function useAdminUpdatePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) => partnerService.adminUpdate(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PARTNER_KEYS.all }); toast.success('Partner updated'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Update failed'),
  });
}

export function useDeletePartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partnerService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PARTNER_KEYS.all }); toast.success('Partner removed'); },
    onError: () => toast.error('Delete failed'),
  });
}

// ── Vendor hooks ──────────────────────────────────────────────────────────────

export function useMyPartner() {
  return useQuery({ queryKey: PARTNER_KEYS.my, queryFn: partnerService.getMy });
}

export function useCreateMyPartner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePartnerDto) => partnerService.createMy(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PARTNER_KEYS.my }); toast.success('Profile submitted for review'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Create failed'),
  });
}

export function useUpdateMyPartner(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePartnerDto) => partnerService.updateMy(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PARTNER_KEYS.my }); toast.success('Profile updated'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Update failed'),
  });
}

export function useUploadPartnerLogo(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => partnerService.uploadLogo(id, file),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PARTNER_KEYS.my }); toast.success('Logo uploaded'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Upload failed'),
  });
}
