export type ContentStatus =
  // legacy AI pipeline statuses (kept for existing DB records)
  | 'pending'
  | 'processed'
  // active pipeline statuses
  | 'new'
  | 'processing'
  | 'pending_review'
  // newsletter workflow statuses
  | 'approved'
  | 'rejected'
  | 'scheduled'
  | 'published'
  | 'archived';
export type PriorityLevel = 'normal' | 'high' | 'critical';
export type SourceType = 'rss' | 'scrape' | 'manual';
export type SourceTier = 'tier1' | 'tier2' | 'tier3';

export interface IHSource {
  _id: string;
  name: string;
  rssUrl: string;
  websiteUrl?: string;
  type: SourceType;
  tier: SourceTier;
  isActive: boolean;
  description?: string;
  lastFetchedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItem {
  _id: string;
  // Raw fields
  sourceName: string;
  sourceUrl?: string;
  articleUrl: string;
  originalTitle: string;
  originalExcerpt?: string;
  originalContent?: string;
  originalPublishDate?: string;
  importedAt: string;
  category?: string;
  tags: string[];
  status: ContentStatus;
  // AI fields
  aiHeadline?: string;
  aiSummary?: string;
  aiWhatThisMeans?: string;
  aiOperatorTakeaway?: string;
  aiFacebookPost?: string;
  aiEmailBlurb?: string;
  aiRelevanceScore?: number;
  // Admin fields
  reviewed: boolean;
  approved: boolean;
  priority: PriorityLevel;
  featured: boolean;
  readyToPost: boolean;
  notes?: string;
  editedBy?: string;
  editedAt?: string;
  scheduledFor?: string;
  publishedAt?: string;
  isArizonaSpecific: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentItemsResponse {
  items: ContentItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IHStats {
  total: number;
  newItems: number;
  pendingReview: number;
  processing: number;
  approved: number;
  rejected: number;
  readyToPost: number;
  scheduled: number;
  published: number;
  archived: number;
}

export interface IngestResult {
  imported: number;
  alreadyExists: number;
  notRelevant: number;
  skipped: number;
  errors: number;
  failedSources: string[];
}

export interface ContentItemFilters {
  search?: string;
  category?: string;
  sourceName?: string;
  status?: ContentStatus | '';
  priority?: PriorityLevel | '';
  approved?: boolean | '';
  reviewed?: boolean | '';
  readyToPost?: boolean | '';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
