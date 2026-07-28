'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { caregiverService } from '@/services/caregiverService';
import type { CreateCaregiverDto, UpdateCaregiverDto } from '@/types/caregiver.types';

export const CAREGIVER_KEYS = {
  all: ['caregivers'] as const,
  visible: ['caregivers', 'visible'] as const,
  detail: (id: string) => ['caregivers', id] as const,
};

export function useVisibleCaregivers(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...CAREGIVER_KEYS.visible, params],
    queryFn: () => caregiverService.getVisible(params),
    select: (res) => res.data,
  });
}

export function useCaregivers(params?: Record<string, string>) {
  return useQuery({
    queryKey: [...CAREGIVER_KEYS.all, params],
    queryFn: () => caregiverService.getAll(params),
  });
}

export function useApplyCaregiver() {
  return useMutation({
    mutationFn: (data: CreateCaregiverDto) => caregiverService.apply(data),
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Submission failed'),
  });
}

export function useApproveCaregiver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => caregiverService.approve(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CAREGIVER_KEYS.all }); toast.success('Caregiver approved'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Action failed'),
  });
}

export function useRejectCaregiver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => caregiverService.reject(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CAREGIVER_KEYS.all }); toast.success('Caregiver rejected'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Action failed'),
  });
}

export function useCreateCaregiver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCaregiverDto) => caregiverService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CAREGIVER_KEYS.all }); toast.success('Caregiver added'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Create failed'),
  });
}

export function useUpdateCaregiver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCaregiverDto }) => caregiverService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CAREGIVER_KEYS.all }); toast.success('Caregiver updated'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Update failed'),
  });
}

export function useToggleCaregiverVisibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => caregiverService.toggleVisibility(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CAREGIVER_KEYS.all }); toast.success('Visibility updated'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Action failed'),
  });
}

export function useDeleteCaregiver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => caregiverService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CAREGIVER_KEYS.all }); toast.success('Caregiver removed'); },
    onError: () => toast.error('Delete failed'),
  });
}
