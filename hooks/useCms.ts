'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cmsService } from '@/services/cmsService';
import type { CreateResourceDto, UpdateResourceDto } from '@/types/cms.types';

export const CMS_KEYS = {
  all: ['cms'] as const,
  detail: (id: string) => ['cms', id] as const,
};

export function useResources(params?: Record<string, string>) {
  return useQuery({ queryKey: [...CMS_KEYS.all, params], queryFn: () => cmsService.getAll(params) });
}

export function useCreateResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateResourceDto) => cmsService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CMS_KEYS.all }); toast.success('Resource created'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Create failed'),
  });
}

export function useUpdateResource(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateResourceDto) => cmsService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CMS_KEYS.all }); toast.success('Resource updated'); },
    onError: () => toast.error('Update failed'),
  });
}

export function useTogglePublish() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cmsService.togglePublish(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CMS_KEYS.all }); toast.success('Status updated'); },
    onError: () => toast.error('Action failed'),
  });
}

export function useDeleteResource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cmsService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: CMS_KEYS.all }); toast.success('Resource deleted'); },
    onError: () => toast.error('Delete failed'),
  });
}
