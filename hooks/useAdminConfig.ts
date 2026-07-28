'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminService } from '@/services/adminService';

export function useAdminConfig() {
  return useQuery({ queryKey: ['admin', 'config'], queryFn: adminService.getConfig });
}

export function useUpdateAdminConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => adminService.updateConfig(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'config'] }); toast.success('Configuration saved'); },
    onError: () => toast.error('Save failed'),
  });
}
