export type SocialBoostStatus = 'pending' | 'approved' | 'posted' | 'rejected';

export interface SocialBoostSubmission {
  _id: string;
  facilityId: string;
  facilityName: string;
  submittedBy: string;
  caption: string;
  category: string;
  channel: string;
  fileUrl?: string;
  status: SocialBoostStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSocialBoostDto {
  caption: string;
  category: string;
  channel: string;
  file?: File;
}

export interface UpdateSocialBoostStatusDto {
  status: SocialBoostStatus;
  reviewNotes?: string;
}
