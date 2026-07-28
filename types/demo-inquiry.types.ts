export type DemoInquiryType = 'discharge-planner' | 'facility' | 'preferred-partner';
export type DemoInquiryStatus = 'new' | 'reviewed';

export interface DemoInquiry {
  _id: string;
  type: DemoInquiryType;
  status: DemoInquiryStatus;
  name: string;
  email: string;
  phone?: string;
  // Discharge-planner fields
  organization?: string;
  role?: string;
  // Facility fields
  facilityName?: string;
  city?: string;
  beds?: string;
  availability?: string;
  // Preferred-partner fields
  company?: string;
  serviceCategory?: string;
  // Admin
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
