export type FacilityStatus = 'pending' | 'approved' | 'rejected';

export interface FacilityPhoto {
  url: string;
  publicId: string;
  label: string;
  uploadedAt: string;
}

export interface FacilityPolicies {
  admission?: string;
  discharge?: string;
  visitor?: string;
  medication?: string;
  emergency?: string;
  privacy?: string;
}

export interface FacilityAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface FacilityPricing {
  min?: number;
  max?: number;
  currency?: string;
}

export interface FacilitySocialMedia {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export interface Facility {
  _id: string;
  ownerId: string | { _id: string; email: string; firstName?: string; lastName?: string };
  name: string;
  address?: FacilityAddress;
  capacity: number;
  availabilityCount: number;
  status: FacilityStatus;
  services: string[];
  isVisible: boolean;
  lastUpdated: string;
  isFlagged: boolean;
  description?: string;
  phone?: string;
  secondaryPhone?: string;
  fax?: string;
  email?: string;
  pricing?: FacilityPricing;
  website?: string;
  socialMedia?: FacilitySocialMedia;
  adminName?: string;
  licenseType?: string;
  genderPreference?: string;
  photos?: FacilityPhoto[];
  policies?: FacilityPolicies;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAvailabilityDto {
  availabilityCount: number;
}

export interface UpdateFacilityDto {
  name?: string;
  address?: FacilityAddress;
  capacity?: number;
  availabilityCount?: number;
  services?: string[];
  description?: string;
  phone?: string;
  secondaryPhone?: string;
  fax?: string;
  email?: string;
  pricing?: FacilityPricing;
  website?: string;
  socialMedia?: FacilitySocialMedia;
  adminName?: string;
  licenseType?: string;
  genderPreference?: string;
  policies?: FacilityPolicies;
}
