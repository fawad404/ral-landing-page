'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { facilityService } from '@/services/facilityService';
import type { UpdateFacilityDto, UpdateAvailabilityDto } from '@/types/facility.types';

export const FACILITY_KEYS = {
  all: ['facilities'] as const,
  my: ['facilities', 'my'] as const,
  flagged: ['facilities', 'flagged'] as const,
  detail: (id: string) => ['facilities', id] as const,
};

export function useFacilities(params?: Record<string, string>) {
  return useQuery({ queryKey: [...FACILITY_KEYS.all, params], queryFn: () => facilityService.getAll(params) });
}

export function useMyFacilities() {
  return useQuery({ queryKey: FACILITY_KEYS.my, queryFn: facilityService.getMy });
}

export function useFlaggedFacilities() {
  return useQuery({ queryKey: FACILITY_KEYS.flagged, queryFn: facilityService.getFlagged });
}

export function useFacility(id: string) {
  return useQuery({ queryKey: FACILITY_KEYS.detail(id), queryFn: () => facilityService.getById(id), enabled: !!id });
}

export function useUpdateFacility(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateFacilityDto) => facilityService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FACILITY_KEYS.my }); toast.success('Profile updated'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Update failed'),
  });
}

export function useUpdateAvailability(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateAvailabilityDto) => facilityService.updateAvailability(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FACILITY_KEYS.my }); toast.success('Availability saved'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Update failed'),
  });
}

export function useApproveFacility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => facilityService.approve(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FACILITY_KEYS.all }); toast.success('Facility approved'); },
    onError: () => toast.error('Action failed'),
  });
}

export function useRejectFacility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => facilityService.reject(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FACILITY_KEYS.all }); toast.success('Facility rejected'); },
    onError: () => toast.error('Action failed'),
  });
}

export function useCreateFacility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) => facilityService.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FACILITY_KEYS.my }); toast.success('Facility created!'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create facility'),
  });
}

export function useAddFacilityPhoto(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, label }: { file: File; label: string }) => facilityService.addPhoto(id, file, label),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FACILITY_KEYS.my }); toast.success('Photo uploaded'); },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Upload failed'),
  });
}

export function useRemoveFacilityPhoto(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (filename: string) => facilityService.removePhoto(id, filename),
    onSuccess: () => { qc.invalidateQueries({ queryKey: FACILITY_KEYS.my }); toast.success('Photo removed'); },
    onError: () => toast.error('Failed to remove photo'),
  });
}

export function useToggleFacilityVisibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? facilityService.activate(id) : facilityService.deactivate(id),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: FACILITY_KEYS.all });
      toast.success(vars.active ? 'Facility activated' : 'Facility deactivated');
    },
    onError: () => toast.error('Action failed'),
  });
}
