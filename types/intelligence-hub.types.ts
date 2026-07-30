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
export type ChangeType =
  | 'new_regulation'
  | 'updated_regulation'
  | 'deadline_changed'
  | 'funding_opportunity'
  | 'technology_release'
  | 'survey_guidance'
  | 'industry_trend'
  | 'ownership_change'
  | 'executive_appointment'
  | 'partnership_announcement'
  | 'other';
export type UrgencyLevel = 'immediate' | 'this_week' | 'monitor' | 'no_action';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type OpportunityLevel = 'low' | 'medium' | 'high';
export type SourceType = 'rss' | 'scrape' | 'manual';
export type SourcePriority = 'low' | 'medium' | 'high' | 'critical';
export type TrustLevel = 'low' | 'medium' | 'high';
export type HealthStatus = 'healthy' | 'warning' | 'failing';

export interface IHSource {
  _id: string;
  name: string;
  rssUrl: string;
  websiteUrl?: string;
  type: SourceType;
  industry: string;
  categories: string[];
  scanFrequencyHours: number;
  priority: SourcePriority;
  trustLevel: TrustLevel;
  isActive: boolean;
  description?: string;
  lastScanAt?: string;
  lastSuccessfulScanAt?: string;
  healthStatus: HealthStatus;
  consecutiveFailures: number;
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
  changeType: ChangeType;
  aiWhoIsAffected?: string;
  urgency: UrgencyLevel;
  riskLevel: RiskLevel;
  opportunityLevel: OpportunityLevel;
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
  contentHash?: string;
  contentUpdated: boolean;
  contentUpdatedAt?: string;
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
  modified: number;
  alreadyExists: number;
  notRelevant: number;
  skipped: number;
  errors: number;
  failedSources: string[];
}

export type ScanOutcome = 'success' | 'failed';

export interface ScanLog {
  _id: string;
  sourceId: string;
  sourceName: string;
  scannedAt: string;
  outcome: ScanOutcome;
  imported: number;
  modified: number;
  alreadyExists: number;
  notRelevant: number;
  errorMessage?: string;
  triggeredManually: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScanLogsResponse {
  logs: ScanLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ScanLogFilters {
  sourceId?: string;
  outcome?: ScanOutcome | '';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface ContentItemFilters {
  search?: string;
  category?: string;
  sourceName?: string;
  status?: ContentStatus | '';
  priority?: PriorityLevel | '';
  changeType?: ChangeType | '';
  urgency?: UrgencyLevel | '';
  riskLevel?: RiskLevel | '';
  opportunityLevel?: OpportunityLevel | '';
  approved?: boolean | '';
  reviewed?: boolean | '';
  readyToPost?: boolean | '';
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}
