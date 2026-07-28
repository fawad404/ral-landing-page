export type CaregiverStatus = 'pending' | 'active' | 'inactive';

export interface Caregiver {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  workAreas: string[];
  availability: string[];
  certifications: string[];
  specializations: string[];
  experienceYears: number;
  availableNow: boolean;
  bio?: string;
  status: CaregiverStatus;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaregiverDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  workAreas?: string[];
  availability?: string[];
  certifications?: string[];
  specializations?: string[];
  experienceYears?: number;
  availableNow?: boolean;
  bio?: string;
  status?: CaregiverStatus;
  isVisible?: boolean;
}

export type UpdateCaregiverDto = Partial<CreateCaregiverDto>;

export const WORK_AREAS = ['Phoenix', 'Glendale', 'Peoria', 'Surprise', 'Scottsdale', 'Mesa', 'Chandler', 'Tempe', 'Gilbert', 'Other'] as const;
export const SHIFT_OPTIONS = ['Morning', 'Afternoon', 'Evening', 'Overnight', 'Weekdays', 'Weekends', 'PRN', 'Live-In'] as const;
export const CREDENTIAL_OPTIONS = ['CPR', 'Fingerprint Card', 'Caregiver Certificate', 'Med Tech', 'CNA', 'Dementia Experience', 'Hospice Experience'] as const;

// Aliases used by existing admin page components
export const CERTIFICATIONS = CREDENTIAL_OPTIONS;
export const AVAILABILITY_OPTIONS = SHIFT_OPTIONS;
export const SPECIALIZATION_OPTIONS = [] as const;
