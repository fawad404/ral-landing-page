// Shared category list — used by both the ingestion/service layer and the
// AI prompt (ai-processing.service.ts), kept in its own file to avoid a
// circular import between those two.
export const CATEGORIES = [
  // ── Original categories ───────────────────────────────────────────────────
  'Arizona Regulations',
  'Compliance & Licensing',
  'Assisted Living Operations',
  'ALTCS / Medicaid',
  'Staffing & Caregivers',
  'Residential Assisted Living',
  'Memory Care',
  'Senior Care Industry News',
  'Risk / Legal / Liability',
  'Manager Insights',
  'Market Trends',
  // ── Newsletter aggregator categories (Phase 2) ────────────────────────────
  'Compliance & Regulatory',
  'Staffing & Caregiver News',
  'Industry News & Operations',
  'Emergency & Safety Alerts',
  'Law / Policy / ALTCS Updates',
];
