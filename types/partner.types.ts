export type PartnerStatus = 'pending' | 'approved' | 'rejected';

export interface PartnerContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
}

export interface Partner {
  _id: string;
  name: string;
  category: string;
  status: PartnerStatus;
  isVisible: boolean;
  orderWeight: number;
  contactInfo?: PartnerContactInfo;
  description?: string;
  logoUrl?: string;
  logoPublicId?: string;
  rejectionReason?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerDto {
  name: string;
  category: string;
  description?: string;
  contactInfo?: PartnerContactInfo;
}

export interface UpdatePartnerDto {
  name?: string;
  category?: string;
  description?: string;
  contactInfo?: PartnerContactInfo;
}
