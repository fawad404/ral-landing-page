export type InquiryStatus = 'new' | 'contacted' | 'placed' | 'closed';

export interface InquiryFamilyData {
  name: string;
  email: string;
  phone?: string;
  relationship?: string;
}

export interface InquiryBudget {
  min?: number;
  max?: number;
}

export interface InquiryRequirements {
  zipCode?: string;
  services?: string[];
  budget?: InquiryBudget;
  roomType?: string;
  urgency?: string;
  notes?: string;
}

export interface MatchHistoryEntry {
  facilityId: string | { _id: string; name: string };
  reason: string;
  score: number;
  assignedAt: string;
  isManualOverride: boolean;
}

export interface Inquiry {
  _id: string;
  familyData: InquiryFamilyData;
  requirements?: InquiryRequirements;
  status: InquiryStatus;
  assignedFacilityIds: Array<string | { _id: string; name: string; address?: any; services?: string[] }>;
  matchReason: string;
  notes?: string;
  assignedTo?: string | null;
  matchHistory: MatchHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInquiryDto {
  familyData: InquiryFamilyData;
  requirements?: InquiryRequirements;
  notes?: string;
}

export interface MatchResult {
  message: string;
  inquiry?: Inquiry;
  matches: Array<{
    facilityId: string;
    facilityName: string;
    score: number;
    scorePercent: string;
    matchReasons: string[];
    availabilityCount: number;
    address?: any;
    services?: string[];
  }>;
}
