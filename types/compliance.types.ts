// ─── Enums ────────────────────────────────────────────────────────────────────

export type TaskCategory =
  | 'documentation'
  | 'staffing'
  | 'medication'
  | 'safety'
  | 'training'
  | 'survey_prep'
  | 'infection_control'
  | 'resident_care'
  | 'other';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'open' | 'in_progress' | 'completed' | 'overdue';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';

export type IncidentType =
  | 'fall'
  | 'medication_error'
  | 'elopement'
  | 'abuse_neglect'
  | 'injury'
  | 'illness_outbreak'
  | 'property_damage'
  | 'behavioral'
  | 'other';

export type IncidentSeverity = 'minor' | 'moderate' | 'serious' | 'critical';
export type IncidentStatus = 'open' | 'under_review' | 'resolved' | 'reported_to_adhs';

export type CredentialType =
  | 'fingerprint_clearance'
  | 'cpr_first_aid'
  | 'tb_test'
  | 'food_handler'
  | 'alzheimers_training'
  | 'manager_certification'
  | 'cna'
  | 'medication_aide'
  | 'direct_care_worker'
  | 'other';

export type CredentialStatus = 'valid' | 'expiring_soon' | 'expired';

// ─── Models ───────────────────────────────────────────────────────────────────

export interface ComplianceTask {
  _id: string;
  facilityId: string;
  createdBy: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedTo?: string;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceIncident {
  _id: string;
  facilityId: string;
  createdBy: string;
  title: string;
  type: IncidentType;
  severity: IncidentSeverity;
  incidentDate: string;
  reportedDate?: string;
  description?: string;
  residentsInvolved: string[];
  staffInvolved: string[];
  witnessNames: string[];
  immediateActions?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  reportedToAdhs: boolean;
  adhsReportDate?: string;
  adhsReportNumber?: string;
  status: IncidentStatus;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffCredential {
  _id: string;
  facilityId: string;
  staffName: string;
  role: string;
  credentialType: CredentialType;
  credentialName?: string;
  issueDate?: string;
  expirationDate: string;
  status: CredentialStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API response shapes ──────────────────────────────────────────────────────

export interface ComplianceStats {
  tasks: {
    total: number;
    open: number;
    inProgress: number;
    overdue: number;
    completed: number;
  };
  incidents: {
    total: number;
    open: number;
    critical: number;
  };
  credentials: {
    total: number;
    expired: number;
    expiringSoon: number;
  };
}

export interface PaginatedTasks {
  items: ComplianceTask[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedIncidents {
  items: ComplianceIncident[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedCredentials {
  items: StaffCredential[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
