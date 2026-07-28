export type DealRoomStatus = 'pending' | 'approved' | 'rejected';

export interface DealRoomRequest {
  _id: string;
  facilityId: string;
  facilityName: string;
  ownerId: string;
  status: DealRoomStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ListingType = 'equipment' | 'real-estate' | 'supplies' | 'other';
export type ListingCondition = 'new' | 'used' | 'as-is';

export interface DealRoomListing {
  _id: string;
  title: string;
  description: string;
  type: ListingType;
  condition: ListingCondition;
  price: number;
  priceNegotiable: boolean;
  imageUrl?: string;
  imagePublicId?: string;
  facilityId: string;
  facilityName: string;
  ownerId: string | { _id: string; firstName?: string; lastName?: string; email: string };
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingDto {
  title: string;
  description: string;
  type: ListingType;
  condition?: ListingCondition;
  price?: number;
  priceNegotiable?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  image?: File;
}
