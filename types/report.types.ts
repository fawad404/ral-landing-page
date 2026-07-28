export interface DashboardSummary {
  totalUsers: number;
  totalFacilities: number;
  activeFacilities: number;
  inactiveFacilities: number;
  pendingFacilities: number;
  flaggedFacilities: number;
  totalInquiries: number;
  totalPartners: number;
  visiblePartners: number;
}

export interface DashboardReport {
  summary: DashboardSummary;
  inquiriesByStatus: Record<string, number>;
  recentInquiries: Array<{
    _id: string;
    familyData: { name: string; email: string };
    status: string;
    createdAt: string;
  }>;
}

export interface FacilityReport {
  byStatus: Array<{ _id: string; count: number }>;
  byService: Array<{ _id: string; count: number }>;
  flagged: Array<{ _id: string; name: string; address?: any; lastUpdated: string }>;
  avgAvailability: { avgAvailability: number; totalCapacity: number; totalAvailable: number } | null;
}

export interface InquiryReport {
  total: number;
  byStatus: Array<{ _id: string; count: number }>;
  recent30Days: number;
  placementRate: string;
  avgMatchedFacilities: number;
}

export interface PartnerReport {
  total: number;
  byCategory: Array<{ _id: string; count: number; visible: number }>;
  visible: number;
  hidden: number;
}
