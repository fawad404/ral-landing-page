'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { complianceService } from '@/services/complianceService';

export const COMPLIANCE_KEYS = {
  stats: (facilityId: string) => ['compliance-stats', facilityId] as const,
  tasks: (facilityId: string, filters?: Record<string, any>) =>
    ['compliance-tasks', facilityId, filters] as const,
  incidents: (facilityId: string, filters?: Record<string, any>) =>
    ['compliance-incidents', facilityId, filters] as const,
  credentials: (facilityId: string, filters?: Record<string, any>) =>
    ['compliance-credentials', facilityId, filters] as const,
};

// ─── STATS ────────────────────────────────────────────────────────────────────

export function useComplianceStats(facilityId: string) {
  return useQuery({
    queryKey: COMPLIANCE_KEYS.stats(facilityId),
    queryFn: () => complianceService.getStats(facilityId),
    enabled: !!facilityId,
    refetchInterval: 60000,
  });
}

// ─── TASKS ────────────────────────────────────────────────────────────────────

export function useComplianceTasks(
  facilityId: string,
  filters?: {
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    page?: number;
    limit?: number;
  },
) {
  return useQuery({
    queryKey: COMPLIANCE_KEYS.tasks(facilityId, filters),
    queryFn: () => complianceService.getTasks({ facilityId, ...filters }),
    enabled: !!facilityId,
    placeholderData: (prev) => prev,
  });
}

export function useCreateTask(facilityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => complianceService.createTask(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-tasks', facilityId] });
      qc.invalidateQueries({ queryKey: COMPLIANCE_KEYS.stats(facilityId) });
      toast.success('Task created');
    },
    onError: () => toast.error('Failed to create task'),
  });
}

export function useUpdateTask(facilityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      complianceService.updateTask(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-tasks', facilityId] });
      qc.invalidateQueries({ queryKey: COMPLIANCE_KEYS.stats(facilityId) });
      toast.success('Task updated');
    },
    onError: () => toast.error('Failed to update task'),
  });
}

export function useCompleteTask(facilityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complianceService.completeTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-tasks', facilityId] });
      qc.invalidateQueries({ queryKey: COMPLIANCE_KEYS.stats(facilityId) });
      toast.success('Task marked complete');
    },
    onError: () => toast.error('Failed to complete task'),
  });
}

export function useDeleteTask(facilityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complianceService.deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-tasks', facilityId] });
      qc.invalidateQueries({ queryKey: COMPLIANCE_KEYS.stats(facilityId) });
      toast.success('Task deleted');
    },
    onError: () => toast.error('Failed to delete task'),
  });
}

// ─── INCIDENTS ────────────────────────────────────────────────────────────────

export function useComplianceIncidents(
  facilityId: string,
  filters?: {
    type?: string;
    severity?: string;
    status?: string;
    page?: number;
    limit?: number;
  },
) {
  return useQuery({
    queryKey: COMPLIANCE_KEYS.incidents(facilityId, filters),
    queryFn: () => complianceService.getIncidents({ facilityId, ...filters }),
    enabled: !!facilityId,
    placeholderData: (prev) => prev,
  });
}

export function useCreateIncident(facilityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => complianceService.createIncident(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-incidents', facilityId] });
      qc.invalidateQueries({ queryKey: COMPLIANCE_KEYS.stats(facilityId) });
      toast.success('Incident logged');
    },
    onError: () => toast.error('Failed to log incident'),
  });
}

export function useUpdateIncident(facilityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      complianceService.updateIncident(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-incidents', facilityId] });
      qc.invalidateQueries({ queryKey: COMPLIANCE_KEYS.stats(facilityId) });
      toast.success('Incident updated');
    },
    onError: () => toast.error('Failed to update incident'),
  });
}

export function useDeleteIncident(facilityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complianceService.deleteIncident(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-incidents', facilityId] });
      qc.invalidateQueries({ queryKey: COMPLIANCE_KEYS.stats(facilityId) });
      toast.success('Incident deleted');
    },
    onError: () => toast.error('Failed to delete incident'),
  });
}

// ─── CREDENTIALS ──────────────────────────────────────────────────────────────

export function useStaffCredentials(
  facilityId: string,
  filters?: {
    status?: string;
    credentialType?: string;
    staffName?: string;
    page?: number;
    limit?: number;
  },
) {
  return useQuery({
    queryKey: COMPLIANCE_KEYS.credentials(facilityId, filters),
    queryFn: () => complianceService.getCredentials({ facilityId, ...filters }),
    enabled: !!facilityId,
    placeholderData: (prev) => prev,
  });
}

export function useCreateCredential(facilityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => complianceService.createCredential(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-credentials', facilityId] });
      qc.invalidateQueries({ queryKey: COMPLIANCE_KEYS.stats(facilityId) });
      toast.success('Credential added');
    },
    onError: () => toast.error('Failed to add credential'),
  });
}

export function useUpdateCredential(facilityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      complianceService.updateCredential(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-credentials', facilityId] });
      qc.invalidateQueries({ queryKey: COMPLIANCE_KEYS.stats(facilityId) });
      toast.success('Credential updated');
    },
    onError: () => toast.error('Failed to update credential'),
  });
}

export function useDeleteCredential(facilityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complianceService.deleteCredential(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['compliance-credentials', facilityId] });
      qc.invalidateQueries({ queryKey: COMPLIANCE_KEYS.stats(facilityId) });
      toast.success('Credential deleted');
    },
    onError: () => toast.error('Failed to delete credential'),
  });
}
