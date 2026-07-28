export type LeadType = 'facility' | 'partner';
export type LeadStatus = 'new' | 'reviewed' | 'approved' | 'rejected';

export interface Lead {
  _id: string;
  type: LeadType;
  status: LeadStatus;
  name: string;
  email: string;
  phone?: string;
  // Facility
  homeName?: string;
  city?: string;
  beds?: string;
  availability?: string;
  situation?: string;
  referrals?: string;
  // Partner
  companyName?: string;
  role?: string;
  serviceArea?: string;
  description?: string;
  // Admin
  adminNotes?: string;
  linkedUserId?: string;
  createdAt: string;
  updatedAt: string;
}
