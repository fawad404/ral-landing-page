# RAL Connect — Frontend (Next.js)

## What This Project Is
A Next.js 16 (App Router) frontend for **RAL Connect** — a platform connecting assisted living facilities, vendors, and care seekers in Arizona. Three portals: **Admin**, **Facility Dashboard**, **Vendor**. Also includes the Arizona Assisted Living Intelligence Hub admin UI.

## Stack
- **Framework:** Next.js 16.2 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 — no UI component library. Primary: `#09488B`. Text dark: `#0F172A`. Text muted: `#64748B`. Border: `#E2E8F0`. Background: `#F8FAFC`
- **Server state:** `@tanstack/react-query` v5
- **Client state / auth:** Zustand v5 (`store/authStore.ts`) with `persist` middleware
- **Forms:** `react-hook-form` + `zod` resolvers
- **HTTP client:** axios (`lib/axios.ts`) — custom instance, JWT auto-attached
- **Toasts:** `sonner`
- **Auth token:** JWT in cookie `ral_connect_token` (7-day expiry)
- **Base API URL:** `process.env.NEXT_PUBLIC_API_URL` → `http://localhost:3000/api`

## Project Structure
```
app/                              # Next.js App Router — thin route wrappers ONLY
  layout.tsx                      # Root layout (QueryClient + Toaster providers)
  page.tsx                        # Login page → website/login/page.tsx
  admin/
    layout.tsx                    # Admin shell: Topbar + AdminSidebar + bg-[#F8FAFC]
    page.tsx                      # → website/admin/dashboard/page.tsx
    users/page.tsx
    facilities/page.tsx
    vendors/page.tsx
    inquiries/
      page.tsx
      [id]/page.tsx               # Inquiry detail
    intelligence-hub/
      page.tsx
      [id]/page.tsx
      sources/page.tsx
    cms/page.tsx
    reports/page.tsx
    config/page.tsx
  dashboard/                      # Facility user portal
    layout.tsx
    page.tsx
    compliance/page.tsx
    availability/page.tsx
    facility-profile/page.tsx
    support-network/page.tsx
    social-boost/page.tsx
    deal-room/page.tsx
  vendor/                         # Vendor portal
    layout.tsx
    page.tsx
    profile/page.tsx

website/                          # Actual page implementations (all real UI lives here)
  login/page.tsx
  admin/
    dashboard/page.tsx
    users/page.tsx
    facilities/page.tsx
    vendors/page.tsx
    inquiries/
      page.tsx
      [id]/page.tsx               # Detail: match history, run matching, manual assign
    intelligence-hub/
      page.tsx                    # Stats + filters + paginated table
      detail/page.tsx             # Raw content + AI fields + admin controls
      sources/page.tsx            # Source management by tier
    cms/page.tsx
    reports/page.tsx
    config/page.tsx
  dashboard/                      # Facility portal pages
    page.tsx
    stats.tsx / activityLogs.tsx / otherPages.tsx
    compliance/page.tsx           # Compliance Centre — Tasks, Incidents, Credentials tabs with inline filters
    availability/
    facility-profile/
    support-network/
    social-boost/
    deal-room/
  vendor/
    dashboard/page.tsx
    profile/page.tsx

components/
  sidebar/
    AdminSidebar.tsx              # Admin left nav — add new pages here (navItems array)
    VendorSidebar.tsx
  topbar/page.tsx
  global/
    header.tsx                    # Shared page header
    tab-nav.tsx                   # Reusable tab navigation
    ConfirmDeleteModal.tsx        # Generic delete confirmation modal
    CustomSelect.tsx              # Custom dropdown replacing all native <select> elements

api/
  endpoints.ts                    # All API_ENDPOINTS + APP_ROUTES constants

services/                         # axios calls — one file per domain
  authService.ts
  userService.ts
  facilityService.ts
  inquiryService.ts
  matchingService.ts
  partnerService.ts
  notificationService.ts
  cmsService.ts
  reportService.ts
  adminService.ts
  intelligenceHubService.ts

hooks/                            # React Query wrappers — one file per domain
  useAuth.ts
  useUsers.ts
  useFacilities.ts
  useInquiries.ts
  usePartners.ts
  useNotifications.ts
  useCms.ts
  useReports.ts
  useAdminConfig.ts
  useIntelligenceHub.ts

store/
  authStore.ts                    # Zustand: token, user, isAuthenticated, setAuth, clearAuth, getRole

types/                            # TypeScript interfaces — one file per domain
  auth.types.ts
  user.types.ts
  facility.types.ts
  inquiry.types.ts
  partner.types.ts
  notification.types.ts
  cms.types.ts
  report.types.ts
  intelligence-hub.types.ts

lib/
  axios.ts                        # axios instance — JWT interceptor + 401 global redirect

middleware.ts                     # Edge route guard — role-based redirects
```

## Auth & Routing
- JWT decoded at the edge in `middleware.ts` to extract `role`
- Unauthenticated → redirected to `/` (login)
- `admin` → `/admin`, `vendor` → `/vendor`, `facility` → `/dashboard`
- `useAuthStore` (Zustand persist): `setAuth(token, user)` saves cookie + store; `clearAuth()` removes both
- axios interceptor: reads `ral_connect_token` cookie, attaches `Authorization: Bearer <token>`
- On 401 response: cookie removed, redirect to `/`

## Module Pattern (follow this exactly)
1. `types/feature.types.ts` — TypeScript interfaces matching backend schemas
2. `services/featureService.ts` — axios calls, returns typed data
3. `hooks/useFeature.ts` — React Query hooks (`useQuery` / `useMutation`), toast feedback
4. `website/admin/feature/page.tsx` — actual UI (always `'use client'`)
5. `app/admin/feature/page.tsx` — thin wrapper importing from `website/`

## How to Add a New Admin Page
```tsx
// app/admin/my-feature/page.tsx
import MyFeaturePage from '@/website/admin/my-feature/page';
export default function Page() { return <MyFeaturePage />; }
```
Then add to `APP_ROUTES` in `api/endpoints.ts` and add a `navItems` entry in `components/sidebar/AdminSidebar.tsx`.

## API Endpoints Pattern (`api/endpoints.ts`)
```ts
API_ENDPOINTS = {
  SOME_ENDPOINT: '/some-endpoint',
  SOME_BY_ID: (id: string) => `/some-endpoint/${id}`,
}
APP_ROUTES = {
  ADMIN_SOME_PAGE: '/admin/some-page',
  ADMIN_SOME_DETAIL: (id: string) => `/admin/some-page/${id}`,
}
```

## React Query Key Pattern
Each hook file defines a `FEATURE_KEYS` object:
```ts
export const FACILITY_KEYS = {
  all: ['facilities'] as const,
  my: ['facilities', 'my'] as const,
  detail: (id: string) => ['facilities', id] as const,
};
```
Invalidate with `qc.invalidateQueries({ queryKey: FACILITY_KEYS.all })`.

## Error Handling Pattern
```ts
onError: (err: any) => toast.error(err?.response?.data?.message || 'Fallback message')
```
For long-lived errors (e.g. AI failures), also show a persistent inline red banner on the page.

---

## Admin Portal Pages

### `/admin` — Dashboard (`website/admin/dashboard/page.tsx`)
- Stat cards: totalUsers, totalFacilities, activeFacilities, pendingFacilities, totalInquiries, totalPartners
- Inquiries by status breakdown
- Recent inquiries table with links
- Data from `useDashboardReport()` → `GET /api/reports/dashboard`

### `/admin/users` — User Management (`website/admin/users/page.tsx`)
- Tabs: All Users | Pending Approval
- Table: name/email, role badge, active/inactive badge, lastLogin, actions
- Actions: Approve, Activate/Deactivate, Reset Password, Delete
- Hooks: `useUsers`, `usePendingUsers`, `useApproveUser`, `useToggleUserStatus`, `useResetPassword`

### `/admin/facilities` — Facility Management (`website/admin/facilities/page.tsx`)
- Tabs: All | Flagged
- Table: name/city, status badge, availability/capacity, lastUpdated, actions
- Actions: Approve, Reject, Activate/Deactivate, Delete
- Hooks: `useFacilities`, `useFlaggedFacilities`, `useApproveFacility`, `useRejectFacility`, `useToggleFacilityVisibility`

### `/admin/vendors` — Vendor/Partner Management (`website/admin/vendors/page.tsx`)
- List all partners grouped or filtered by category
- Toggle visibility, delete
- Hooks: `usePartners`, `useUpdatePartner`, `useDeletePartner`

### `/admin/inquiries` — Inquiries List (`website/admin/inquiries/page.tsx`)
- Status tabs: All | New | Contacted | Placed | Closed
- Table: family name/email, status badge, requirements summary, createdAt
- Click row → detail page
- Hooks: `useInquiries`, `useDeleteInquiry`

### `/admin/inquiries/[id]` — Inquiry Detail (`website/admin/inquiries/[id]/page.tsx`)
- Family info, requirements, current status
- Run Matching button → `useRunMatching` → displays match results with scores + reasons
- Manual assign facility → `useManualAssign`
- Match history log (who was matched, when, score, manual override flag)
- Update status dropdown
- Hooks: `useInquiry`, `useUpdateInquiry`, `useRunMatching`, `useManualAssign`

### `/admin/cms` — CMS Content (`website/admin/cms/page.tsx`)
- Resource list filtered by type (blog/guidance/directory)
- Create/edit resource with title, content, type, slug, tags, excerpt
- Publish toggle, delete
- Hooks: `useCmsResources`, `useCreateResource`, `useUpdateResource`, `usePublishResource`, `useDeleteResource`

### `/admin/reports` — Reports (`website/admin/reports/page.tsx`)
- Tabs: Dashboard | Facilities | Inquiries | Partners
- Charts/tables from report endpoints
- Hooks: `useDashboardReport`, `useFacilityReport`, `useInquiryReport`, `usePartnerReport`

### `/admin/config` — Configuration (`website/admin/config/page.tsx`)
- Matching weights sliders (distance 0.4, services 0.4, budget 0.2 — must sum to 1.0)
- Max match results
- Category limits per vendor category
- Hook: `useAdminConfig`, `useUpdateAdminConfig`

### `/admin/intelligence-hub` — Intelligence Hub List
See Intelligence Hub section below.

---

## Facility Dashboard Portal (`/dashboard`)
Accessed by users with role `facility`. Layout has its own sidebar (no admin nav).

| Route | Page | Description |
|---|---|---|
| `/dashboard` | `website/dashboard/page.tsx` | Stats (capacity, availability, status) + activity log + quick links |
| `/dashboard/compliance` | `website/dashboard/compliance/page.tsx` | Compliance Centre — Tasks / Incidents / Credentials tabs; filters inline with tab nav (justify-between); uses local `FilterDropdown` for filter bar |
| `/dashboard/availability` | `.../availability/` | Update available bed count |
| `/dashboard/facility-profile` | `.../facility-profile/` | Edit facility profile (name, address, services, pricing, description) |
| `/dashboard/support-network` | `.../support-network/` | Browse partners/vendors |
| `/dashboard/social-boost` | `.../social-boost/` | Social media content tools |
| `/dashboard/deal-room` | `.../deal-room/` | Deal/referral tracking |

---

## Vendor Portal (`/vendor`)
Accessed by users with role `vendor`.

| Route | Description |
|---|---|
| `/vendor` | Vendor dashboard |
| `/vendor/profile` | Edit partner/vendor profile |

---

## Intelligence Hub Frontend (Admin Only)

### List page — `/admin/intelligence-hub` (`website/admin/intelligence-hub/page.tsx`)
- 7 stat cards: total, pending, processing, processed, approved, rejected, readyToPost
- Filter toolbar: search text, category dropdown, source name, status, priority, approved flag, readyToPost flag, date range
- Paginated table with inline actions: approve / reject / mark ready to post / delete
- "Trigger Ingest" button at top → `useTriggerIngest()` → toast with imported/skipped counts

### Detail page — `/admin/intelligence-hub/[id]` (`website/admin/intelligence-hub/detail/page.tsx`)
- Two-column layout
- **Left:** raw content (title, excerpt, source, date, original URL) + admin controls (category select, priority select, tags, notes textarea, checkboxes: reviewed / approved / readyToPost / featured)
- **Right:** all AI fields editable inline (headline, summary, whatThisMeans, operatorTakeaway, facebookPost with copy button, emailBlurb, relevanceScore), "Re-run AI" button
- Red error banner above grid when AI reprocessing fails — reads `reprocess.error?.response?.data?.message`

### Sources page — `/admin/intelligence-hub/sources` (`website/admin/intelligence-hub/sources/page.tsx`)
- Source list grouped by Tier 1 / Tier 2 / Tier 3
- Add/edit modal, enable/disable toggle, delete with confirm

### Intelligence Hub Hooks (`hooks/useIntelligenceHub.ts`)
| Hook | Purpose |
|---|---|
| `useIHStats` | GET stats, refetch every 30s |
| `useIHCategories` | GET categories, staleTime: Infinity |
| `useTriggerIngest` | POST ingest, invalidates stats + items |
| `useIHSources` | GET sources |
| `useCreateSource` / `useUpdateSource` / `useDeleteSource` | CRUD sources |
| `useIHItems(filters)` | GET paginated items |
| `useIHItem(id)` | GET single item |
| `useUpdateItem` | PATCH item, updates cache |
| `useDeleteItem` | DELETE item |
| `useReprocessItem` | POST reprocess, shows AI error in toast + banner |

---

## Key Conventions
- `'use client'` on every file using hooks, state, or browser APIs
- Tailwind only — no UI library, no shadcn, no MUI
- All admin pages: thin wrapper in `app/admin/` + real implementation in `website/admin/`
- React Query keys defined as constants at top of each hook file
- `sonner` toast for all mutation feedback; `toast.error(message, { duration: 6000 })` for AI/critical errors
- `placeholderData: (prev) => prev` on paginated queries to prevent loading flicker
- Loading state: `<div className="w-8 h-8 border-4 border-[#09488B] border-t-transparent rounded-full animate-spin" />`
- Status/role badges: `text-xs font-semibold px-2 py-0.5 rounded-full capitalize`

## Environment Variables
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
