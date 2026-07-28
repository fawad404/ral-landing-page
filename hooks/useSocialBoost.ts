'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { socialBoostService } from '@/services/socialBoostService';
import type { UpdateSocialBoostStatusDto } from '@/types/social-boost.types';

export const SOCIAL_BOOST_KEYS = {
  my: ['social-boost', 'my'] as const,
  all: (status?: string) => ['social-boost', 'all', status] as const,
};

export function useMySocialBoosts() {
  return useQuery({ queryKey: SOCIAL_BOOST_KEYS.my, queryFn: socialBoostService.getMy });
}

export function useAllSocialBoosts(status?: string) {
  return useQuery({ queryKey: SOCIAL_BOOST_KEYS.all(status), queryFn: () => socialBoostService.getAll(status) });
}

export function useSubmitSocialBoost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ caption, category, channel, file }: { caption: string; category: string; channel: string; file?: File }) =>
      socialBoostService.submit(caption, category, channel, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SOCIAL_BOOST_KEYS.my });
      toast.success('Post submitted for review!');
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Submission failed'),
  });
}

export function useUpdateSocialBoostStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSocialBoostStatusDto }) =>
      socialBoostService.updateStatus(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['social-boost'] });
      toast.success('Status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });
}

export function useDeleteSocialBoost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => socialBoostService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SOCIAL_BOOST_KEYS.my });
      toast.success('Submission deleted');
    },
    onError: () => toast.error('Failed to delete submission'),
  });
}
