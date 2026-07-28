export const TOKEN_COOKIE_KEY = 'ral_connect_token';

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',

  // Users (Admin)
  USERS: '/users',
  USERS_ACTIVITY: '/users/activity',
  USERS_PENDING: '/users/pending-approval',
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_ACTIVATE: (id: string) => `/users/${id}/activate`,
  USER_DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
  USER_APPROVE: (id: string) => `/users/${id}/approve`,
  USER_RESET_PASSWORD: (id: string) => `/users/${id}/reset-password`,

  // Facilities
  FACILITIES: '/facilities',
  FACILITIES_FLAGGED: '/facilities/flagged',
  FACILITIES_MY: '/facilities/my',
  FACILITY_BY_ID: (id: string) => `/facilities/${id}`,
  FACILITY_AVAILABILITY: (id: string) => `/facilities/${id}/availability`,
  FACILITY_APPROVE: (id: string) => `/facilities/${id}/approve`,
  FACILITY_REJECT: (id: string) => `/facilities/${id}/reject`,
  FACILITY_ACTIVATE: (id: string) => `/facilities/${id}/activate`,
  FACILITY_DEACTIVATE: (id: string) => `/facilities/${id}/deactivate`,

  // Partners / Vendors
  PARTNERS: '/partners',
  PARTNERS_CATEGORIES: '/partners/categories',
  PARTNERS_VISIBLE: '/partners/visible',
  PARTNERS_MY: '/partners/my',
  PARTNER_BY_ID: (id: string) => `/partners/${id}`,
  PARTNER_MY_UPDATE: (id: string) => `/partners/my/${id}`,
  PARTNER_MY_LOGO: (id: string) => `/partners/my/${id}/logo`,
  PARTNER_VISIBILITY: (id: string) => `/partners/${id}/visibility`,
  PARTNER_APPROVE: (id: string) => `/partners/${id}/approve`,
  PARTNER_REJECT: (id: string) => `/partners/${id}/reject`,

  // Inquiries
  INQUIRIES: '/inquiries',
  INQUIRY_BY_ID: (id: string) => `/inquiries/${id}`,

  // Matching
  MATCHING_RUN: (id: string) => `/matching/run/${id}`,
  MATCHING_MANUAL_ASSIGN: (id: string) => `/matching/${id}/manual-assign`,
  MATCHING_CONFIG: '/matching/config',

  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATIONS_UNREAD_COUNT: '/notifications/unread-count',
  NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: '/notifications/read-all',
  NOTIFICATION_DELETE: (id: string) => `/notifications/${id}`,

  // CMS
  CMS_RESOURCES: '/cms/resources',
  CMS_RESOURCE_BY_ID: (id: string) => `/cms/resources/${id}`,
  CMS_RESOURCE_PUBLISH: (id: string) => `/cms/resources/${id}/publish`,

  // Admin Config
  ADMIN_CONFIG: '/admin/config',

  // Reports
  REPORTS_DASHBOARD: '/reports/dashboard',
  REPORTS_FACILITIES: '/reports/facilities',
  REPORTS_INQUIRIES: '/reports/inquiries',
  REPORTS_PARTNERS: '/reports/partners',

  // Public
  PUBLIC_INQUIRY: '/public/inquiry',
  PUBLIC_SEARCH: '/public/search',

  // Facility Photos (upload = POST, delete = DELETE with ?publicId=... query param)
  FACILITY_PHOTOS: (id: string) => `/facilities/${id}/photos`,

  // Social Boost
  SOCIAL_BOOST_SUBMIT: '/social-boost',
  SOCIAL_BOOST_MY: '/social-boost/my',
  SOCIAL_BOOST_ALL: '/social-boost',
  SOCIAL_BOOST_STATUS: (id: string) => `/social-boost/${id}/status`,
  SOCIAL_BOOST_DELETE: (id: string) => `/social-boost/${id}`,

  // Deal Room
  DEAL_ROOM_REQUEST: '/deal-room/request',
  DEAL_ROOM_MY_REQUEST: '/deal-room/my-request',
  DEAL_ROOM_ALL_REQUESTS: '/deal-room/requests',
  DEAL_ROOM_APPROVE: (id: string) => `/deal-room/requests/${id}/approve`,
  DEAL_ROOM_REJECT: (id: string) => `/deal-room/requests/${id}/reject`,
  DEAL_ROOM_LISTINGS: '/deal-room/listings',
  DEAL_ROOM_LISTINGS_MY: '/deal-room/listings/my',
  DEAL_ROOM_LISTING_DELETE: (id: string) => `/deal-room/listings/${id}`,

  // Intelligence Hub (Admin)
  IH_STATS: '/intelligence-hub/stats',
  IH_CATEGORIES: '/intelligence-hub/categories',
  IH_INGEST: '/intelligence-hub/ingest',
  IH_SOURCES: '/intelligence-hub/sources',
  IH_SOURCE_BY_ID: (id: string) => `/intelligence-hub/sources/${id}`,
  IH_ITEMS: '/intelligence-hub/items',
  IH_ITEM_BY_ID: (id: string) => `/intelligence-hub/items/${id}`,
  IH_ITEM_REPROCESS: (id: string) => `/intelligence-hub/items/${id}/reprocess`,

  // Leads (Landing Page Submissions)
  LEADS: '/leads',
  LEAD_BY_ID: (id: string) => `/leads/${id}`,
  LEAD_CREATE_ACCOUNT: (id: string) => `/leads/${id}/create-account`,

  // Demo Inquiries (Demo Portal Submissions)
  DEMO_INQUIRIES: '/demo-inquiries',
  DEMO_INQUIRY_BY_ID: (id: string) => `/demo-inquiries/${id}`,

  // Caregiver Directory
  CAREGIVERS: '/caregivers',
  CAREGIVERS_VISIBLE: '/caregivers/visible',
  CAREGIVERS_APPLY: '/caregivers/apply',
  CAREGIVER_BY_ID: (id: string) => `/caregivers/${id}`,
  CAREGIVER_APPROVE: (id: string) => `/caregivers/${id}/approve`,
  CAREGIVER_REJECT: (id: string) => `/caregivers/${id}/reject`,
  CAREGIVER_VISIBILITY: (id: string) => `/caregivers/${id}/visibility`,

  // Compliance
  COMPLIANCE_STATS: '/compliance/stats',
  COMPLIANCE_TASKS: '/compliance/tasks',
  COMPLIANCE_TASK_BY_ID: (id: string) => `/compliance/tasks/${id}`,
  COMPLIANCE_TASK_COMPLETE: (id: string) => `/compliance/tasks/${id}/complete`,
  COMPLIANCE_INCIDENTS: '/compliance/incidents',
  COMPLIANCE_INCIDENT_BY_ID: (id: string) => `/compliance/incidents/${id}`,
  COMPLIANCE_CREDENTIALS: '/compliance/credentials',
  COMPLIANCE_CREDENTIAL_BY_ID: (id: string) => `/compliance/credentials/${id}`,
} as const;

export const APP_ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  DASHBOARD_AVAILABILITY: '/dashboard/availability',
  DASHBOARD_PROFILE: '/dashboard/facility-profile',
  DASHBOARD_SUPPORT: '/dashboard/support-network',
  DASHBOARD_SOCIAL: '/dashboard/social-boost',
  DASHBOARD_DEAL: '/dashboard/deal-room',

  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_FACILITIES: '/admin/facilities',
  ADMIN_VENDORS: '/admin/vendors',
  ADMIN_INQUIRIES: '/admin/inquiries',
  ADMIN_INQUIRY_DETAIL: (id: string) => `/admin/inquiries/${id}`,
  ADMIN_CMS: '/admin/cms',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_CONFIG: '/admin/config',
  ADMIN_DEAL_ROOM: '/admin/deal-room',
  ADMIN_INTELLIGENCE_HUB: '/admin/intelligence-hub',
  ADMIN_INTELLIGENCE_HUB_ITEM: (id: string) => `/admin/intelligence-hub/${id}`,
  ADMIN_INTELLIGENCE_HUB_SOURCES: '/admin/intelligence-hub/sources',
  ADMIN_NEWSLETTER: '/admin/newsletter',

  ADMIN_LEADS: '/admin/leads',
  ADMIN_LEAD_DETAIL: (id: string) => `/admin/leads/${id}`,

  ADMIN_DEMO_INQUIRIES: '/admin/demo-inquiries',
  ADMIN_DEMO_INQUIRY_DETAIL: (id: string) => `/admin/demo-inquiries/${id}`,

  VENDOR: '/vendor',
  VENDOR_PROFILE: '/vendor/profile',

  DASHBOARD_COMPLIANCE: '/dashboard/compliance',
  DASHBOARD_CAREGIVERS: '/dashboard/caregivers',

  ADMIN_CAREGIVERS: '/admin/caregivers',
} as const;
