import apiClient from '@/lib/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type {
  ComplianceStats,
  ComplianceTask,
  ComplianceIncident,
  StaffCredential,
  PaginatedTasks,
  PaginatedIncidents,
  PaginatedCredentials,
} from '@/types/compliance.types';

export const complianceService = {
  // ─── Stats ──────────────────────────────────────────────────────────────────
  getStats: async (facilityId: string): Promise<ComplianceStats> => {
    const res = await apiClient.get<ComplianceStats>(API_ENDPOINTS.COMPLIANCE_STATS, {
      params: { facilityId },
    });
    return res.data;
  },

  // ─── Tasks ──────────────────────────────────────────────────────────────────
  getTasks: async (params: {
    facilityId: string;
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedTasks> => {
    const res = await apiClient.get<PaginatedTasks>(API_ENDPOINTS.COMPLIANCE_TASKS, { params });
    return res.data;
  },

  getTaskById: async (id: string): Promise<ComplianceTask> => {
    const res = await apiClient.get<ComplianceTask>(API_ENDPOINTS.COMPLIANCE_TASK_BY_ID(id));
    return res.data;
  },

  createTask: async (data: Record<string, any>): Promise<ComplianceTask> => {
    const res = await apiClient.post<ComplianceTask>(API_ENDPOINTS.COMPLIANCE_TASKS, data);
    return res.data;
  },

  updateTask: async (id: string, data: Record<string, any>): Promise<ComplianceTask> => {
    const res = await apiClient.patch<ComplianceTask>(
      API_ENDPOINTS.COMPLIANCE_TASK_BY_ID(id),
      data,
    );
    return res.data;
  },

  completeTask: async (id: string): Promise<ComplianceTask> => {
    const res = await apiClient.patch<ComplianceTask>(API_ENDPOINTS.COMPLIANCE_TASK_COMPLETE(id));
    return res.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.COMPLIANCE_TASK_BY_ID(id));
  },

  // ─── Incidents ──────────────────────────────────────────────────────────────
  getIncidents: async (params: {
    facilityId: string;
    type?: string;
    severity?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedIncidents> => {
    const res = await apiClient.get<PaginatedIncidents>(API_ENDPOINTS.COMPLIANCE_INCIDENTS, {
      params,
    });
    return res.data;
  },

  getIncidentById: async (id: string): Promise<ComplianceIncident> => {
    const res = await apiClient.get<ComplianceIncident>(
      API_ENDPOINTS.COMPLIANCE_INCIDENT_BY_ID(id),
    );
    return res.data;
  },

  createIncident: async (data: Record<string, any>): Promise<ComplianceIncident> => {
    const res = await apiClient.post<ComplianceIncident>(API_ENDPOINTS.COMPLIANCE_INCIDENTS, data);
    return res.data;
  },

  updateIncident: async (id: string, data: Record<string, any>): Promise<ComplianceIncident> => {
    const res = await apiClient.patch<ComplianceIncident>(
      API_ENDPOINTS.COMPLIANCE_INCIDENT_BY_ID(id),
      data,
    );
    return res.data;
  },

  deleteIncident: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.COMPLIANCE_INCIDENT_BY_ID(id));
  },

  // ─── Credentials ────────────────────────────────────────────────────────────
  getCredentials: async (params: {
    facilityId: string;
    status?: string;
    credentialType?: string;
    staffName?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedCredentials> => {
    const res = await apiClient.get<PaginatedCredentials>(API_ENDPOINTS.COMPLIANCE_CREDENTIALS, {
      params,
    });
    return res.data;
  },

  getCredentialById: async (id: string): Promise<StaffCredential> => {
    const res = await apiClient.get<StaffCredential>(
      API_ENDPOINTS.COMPLIANCE_CREDENTIAL_BY_ID(id),
    );
    return res.data;
  },

  createCredential: async (data: Record<string, any>): Promise<StaffCredential> => {
    const res = await apiClient.post<StaffCredential>(
      API_ENDPOINTS.COMPLIANCE_CREDENTIALS,
      data,
    );
    return res.data;
  },

  updateCredential: async (id: string, data: Record<string, any>): Promise<StaffCredential> => {
    const res = await apiClient.patch<StaffCredential>(
      API_ENDPOINTS.COMPLIANCE_CREDENTIAL_BY_ID(id),
      data,
    );
    return res.data;
  },

  deleteCredential: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.COMPLIANCE_CREDENTIAL_BY_ID(id));
  },
};
