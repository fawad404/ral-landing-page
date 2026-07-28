'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '@/services/userService';

export const USER_KEYS = {
  all: ['users'] as const,
  pending: ['users', 'pending'] as const,
  activity: ['users', 'activity'] as const,
};

export function useUsers(params?: Record<string, string>) {
  return useQuery({ queryKey: [...USER_KEYS.all, params], queryFn: () => userService.getAll(params) });
}

export function usePendingUsers() {
  return useQuery({ queryKey: USER_KEYS.pending, queryFn: userService.getPending });
}

export function useUserActivity() {
  return useQuery({ queryKey: USER_KEYS.activity, queryFn: () => userService.getActivity(20) });
}

export function useApproveUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.approve(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: USER_KEYS.all }); toast.success('User approved'); },
    onError: () => toast.error('Action failed'),
  });
}

export function useToggleUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? userService.activate(id) : userService.deactivate(id),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success(vars.active ? 'User activated' : 'User deactivated');
    },
    onError: () => toast.error('Action failed'),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (id: string) => userService.resetPassword(id),
    onSuccess: (data) => toast.success(`Temp password: ${data.temporaryPassword}`, { duration: 10000 }),
    onError: () => toast.error('Reset failed'),
  });
}
