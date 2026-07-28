# RAL Connect — Complete System Documentation

**Version:** 2.0 (Compliance-First Pivot)
**Last Updated:** April 2026
**Stack:** NestJS (Backend) · MongoDB · Next.js 14 (Frontend) · OpenAI GPT-4o-mini · Cloudinary

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [The Strategic Pivot — Before vs Now](#2-the-strategic-pivot--before-vs-now)
3. [System Architecture](#3-system-architecture)
4. [User Roles](#4-user-roles)
5. [Admin Dashboard — All Pages](#5-admin-dashboard--all-pages)
6. [Facility Owner Dashboard — All Pages](#6-facility-owner-dashboard--all-pages)
7. [Vendor Dashboard — All Pages](#7-vendor-dashboard--all-pages)
8. [Backend Modules Reference](#8-backend-modules-reference)
9. [Deferred Features (Placement Phase)](#9-deferred-features-placement-phase)
10. [How All Three Dashboards Connect](#10-how-all-three-dashboards-connect)
11. [Revenue Model](#11-revenue-model)

---

## 1. Project Overview

RAL Connect is a SaaS platform built specifically for the Arizona assisted living market. It serves three types of users:

- **Facility Owners / Managers** — operators of assisted living facilities (ALFs) in Arizona
- **Vendors / Partners** — staffing agencies, training providers, and service companies that serve ALFs
- **Platform Admin** — the RAL Connect operator who manages the entire platform

### Current Focus (Compliance-First Phase)

The platform currently operates as a **compliance and oversight management system** for Arizona ALF owners. Facility owners pay a recurring subscription per home to:

- Track compliance tasks and never miss a deadline
- Document incidents with full detail for ADHS reporting
- Monitor staff credential expirations automatically
- Receive AI-translated regulatory intelligence about ADHS, ALTCS, CMS, and Arizona Legislature changes

This is the entry point chosen because Arizona has been tightening compliance expectations. Owners feel real pressure around documentation, survey readiness, staffing credentials, and incident reporting. The tool solves an immediate, painful problem — making it a much easier sell than a placement marketplace that requires behavior change from hospitals and families.

### Future Phase (Placement Engine)

The placement side of the platform — connecting hospitals, discharge planners, and families with available facility beds — is fully built in the backend and ready to activate. It is currently hidden from the UI via code comments. It will be enabled once the compliance user base is established and network effects can support the marketplace model.

---

## 2. The Strategic Pivot — Before vs Now

### What It Was Before

The original entry point was a **placement marketplace**.

**How it worked:**
1. A family or hospital discharge planner submits a care inquiry via the public form
2. The matching engine scans approved facilities for available beds, matching services, and zip code proximity
3. Matched facilities are notified and can respond
4. The placement is coordinated through the platform

**Why it was changed:**
The placement model requires behavior change from hospitals and discharge planners who are not actively looking for a new tool. It takes months of relationship-building and scale before producing consistent revenue. The network effect has to exist before the marketplace becomes valuable — a chicken-and-egg problem.

**Client's exact reasoning:**
> "The placement side is still a great long-term play, but it's slower to adopt. It requires behavior change, partnerships, and scale before it really starts producing consistent revenue. Instead of trying to push adoption of a placement platform first, we can pivot what we've already built into a manager compliance and oversight system — using the same core architecture, just repurposed toward tracking tasks, incidents, credentials, and alerts."

### What It Is Now

The entry point is a **compliance and oversight system** — same core architecture (homes, users, dashboards), different data layer and workflows.

**Why this works better as an entry point:**

| Factor | Placement Platform | Compliance Platform |
|---|---|---|
| Buyer | Hospital / Family | Facility Owner / Manager |
| Decision | Behavior change required | Immediate pain point |
| Time to value | Months (needs network) | Day one |
| Revenue model | Transaction / referral | Recurring per home |
| Sell cycle | Long, relationship-based | Short, product-led |
| Arizona fit | Competitive market | Compliance pressure is real and growing |

**What changed in the codebase:**
- Added `ComplianceModule` (Tasks, Incidents, Staff Credentials) — new backend module
- Rewired the facility dashboard home to show live compliance stats instead of placement stats
- Commented out placement-phase sidebar items (Availability, Support Network, Social Boost, Deal Room, Inquiries) — code preserved, not deleted
- Admin sidebar cleaned up to show only compliance-relevant tools
- Intelligence Hub remains as the regulatory intelligence layer — directly supports compliance

**What was NOT changed or deleted:**
- Availability tracking (backend + frontend intact, commented in sidebar)
- Inquiry management (backend + frontend intact, commented in admin sidebar)
- Matching engine (fully built, ready to activate)
- Social Boost (backend + frontend intact, commented in sidebar)
- Deal Room (backend + frontend intact, commented in sidebars)
- Support Network (page exists, commented in sidebar)

To re-enable any placement feature: uncomment the relevant line in the sidebar file. The backend is ready.

---

## 3. System Architecture

### Backend (NestJS + MongoDB)

```
src/
├── auth/                 JWT authentication (login, register, token validation)
├── users/                User management (CRUD, roles, approval)
├── facilities/           Facility listings (CRUD, photos, policies, approval)
├── partners/             Vendor/partner management (CRUD, visibility)
├── compliance/           Compliance module (tasks, incidents, credentials) ← NEW
├── intelligence-hub/     RSS ingestion + OpenAI processing + content management
├── inquiries/            Placement inquiries (deferred)
├── matching/             Placement matching engine (deferred)
├── notifications/        In-app notification system
├── social-boost/         Social media post submissions (deferred)
├── deal-room/            Deal room access + listings (deferred)
├── reports/              Platform analytics
├── cms/                  Content management
├── admin/                Admin configuration
├── cloudinary/           Image upload service (Cloudinary CDN)
├── public/               Public-facing endpoints (inquiry form, search)
└── common/               Guards, decorators, filters, enums
```

**Key technical decisions:**
- MongoDB with Mongoose for all data storage
- JWT bearer tokens for authentication
- Role-based access control: `ADMIN`, `FACILITY`, `VENDOR`
- Cloudinary for all image storage (no local disk)
- OpenAI GPT-4o-mini for intelligence hub article processing
- NestJS Schedule for cron jobs (intelligence hub runs every 2 hours)
- Global ValidationPipe with `whitelist: true` — strips unknown fields from all requests

### Frontend (Next.js 14 App Router)

```
ral-connect/
├── app/                  Next.js App Router pages (re-exports from website/)
│   ├── admin/            Admin dashboard routes
│   ├── dashboard/        Facility owner dashboard routes
│   └── vendor/           Vendor dashboard routes
├── website/              Actual page components
│   ├── admin/            Admin page implementations
│   ├── dashboard/        Facility dashboard implementations
│   └── vendor/           Vendor page implementations
├── components/           Shared UI components (sidebars, topbar, etc.)
├── services/             API service layer (one file per module)
├── hooks/                React Query custom hooks (one file per module)
├── types/                TypeScript type definitions
├── api/endpoints.ts      Centralized API endpoint constants
├── lib/axios.ts          Axios instance with JWT auth interceptor
└── store/                Zustand stores (auth state)
```

**Key technical decisions:**
- React Query (TanStack Query) for all server state — caching, refetching, loading states
- Axios with interceptor automatically attaches JWT to every request
- Centralized endpoint definitions in `api/endpoints.ts` — no hardcoded URLs in components
- Service layer separates API calls from UI logic
- Custom hooks wrap React Query for consistent error handling and toast notifications
- Sonner for toast notifications
- Tailwind CSS for styling

---

## 4. User Roles

| Role | Access | Created By |
|---|---|---|
| `ADMIN` | Full platform access — all dashboards, all data | Seeded on startup or created by another admin |
| `FACILITY` | Facility owner dashboard only — their own data | Self-registers, requires admin approval |
| `VENDOR` | Vendor dashboard only — their own partner profile | Self-registers, admin links to partner profile |

**Authentication flow:**
1. User registers at `/login` (register tab)
2. Account created with `isActive: false` pending admin approval
3. Admin approves account in Users page
4. User can now log in — JWT token issued
5. Token stored in cookie, attached to every API request via Axios interceptor
6. Role-based middleware in Next.js redirects users to their correct dashboard

---

## 5. Admin Dashboard — All Pages

### 5.1 Dashboard Home (`/admin`)

**Purpose:** Platform-wide health overview for the RAL Connect operator.

**What it shows:**
- Total registered users, total facilities, pending approvals
- Recent platform activity
- Quick navigation to key management areas

**Connected to:** Platform-wide aggregate queries across users, facilities, partners collections.

---

### 5.2 Users (`/admin/users`)

**Purpose:** Control who has access to the RAL Connect platform.

**What it does:**
- Lists every registered account with role (FACILITY / VENDOR / ADMIN), status (active/inactive), and join date
- **Approve** pending accounts — new signups cannot log in until approved
- **Activate / Deactivate** any account — deactivated users are immediately locked out
- **Reset Password** — admin generates a temporary password for a user
- Filter by role and status

**Backend endpoints used:**
- `GET /users` — list all users
- `GET /users/pending-approval` — pending accounts
- `PATCH /users/:id/approve` — approve account
- `PATCH /users/:id/activate` — activate
- `PATCH /users/:id/deactivate` — deactivate
- `PATCH /users/:id/reset-password` — reset password

**Why it matters:** No one gets platform access without admin review. This is the first gatekeeper for platform quality.

---

### 5.3 Facilities (`/admin/facilities`)

**Purpose:** Manage and quality-control all facility listings on the platform.

**What it does:**
- Lists every facility with name, owner, status (pending/approved/rejected), and visibility
- **Approve** — facility becomes active on the platform
- **Reject** — facility rejected with ability to add a reason
- **Activate / Deactivate** — toggle visibility without deleting
- **View Drawer** — slide-over panel showing the full facility profile:
  - Owner information (name, email)
  - Capacity and current availability
  - Services offered
  - Contact details (phone, email, website)
  - Description
  - Photo gallery
  - Policies (admission, discharge, visitor, medication, emergency, privacy)
  - Pricing range
  - Timestamps (created, last updated)
- Flagged facilities (inactive >24 hours without updating) are highlighted for admin attention

**Backend endpoints used:**
- `GET /facilities` — list all
- `GET /facilities/flagged` — flagged facilities
- `PATCH /facilities/:id/approve` — approve
- `PATCH /facilities/:id/reject` — reject
- `PATCH /facilities/:id/activate` — activate
- `PATCH /facilities/:id/deactivate` — deactivate
- `DELETE /facilities/:id` — delete

**Why it matters:** Admin controls which facilities are visible on the platform and maintains listing quality.

---

### 5.4 Vendors (`/admin/vendors`)

**Purpose:** Manage the directory of partner businesses that serve Arizona ALF operators.

**What it does:**
- Lists all vendor/partner businesses with name, category, and visibility status
- **Add New Vendor** — admin creates a vendor profile (name, category, description, contact info, logo URL, order weight)
- **Edit** any vendor's details
- **Toggle Visibility** — vendors are hidden until admin explicitly makes them visible
- **Delete** a vendor
- **View Drawer** — full partner profile: logo, description, contact info, category, visibility, order weight, timestamps

**Order Weight:** Controls display priority — higher weight = appears higher in vendor listings when the Support Network page is activated.

**Backend endpoints used:**
- `GET /partners` — list all
- `GET /partners/categories` — available categories
- `POST /partners` — create
- `PATCH /partners/:id` — update
- `PATCH /partners/:id/visibility` — toggle visibility
- `DELETE /partners/:id` — delete

**Why it matters:** Admin curates the vendor directory. Facility owners trust that listed vendors are vetted by RAL Connect. Vendors in this context include staffing agencies, training providers, background check services, and other ALF service companies — all directly relevant to the compliance phase.

---

### 5.5 Intelligence Hub (`/admin/intelligence-hub`)

**Purpose:** The regulatory intelligence engine — processes compliance news and translates it into operator-specific guidance for Arizona ALF owners.

**How it works end-to-end:**

**Step 1 — Ingestion (automatic, every 2 hours)**
The system fetches 17 RSS sources:
- ADHS / Arizona Department of Health
- CMS / Centers for Medicare & Medicaid Services
- AHCCCS / ALTCS (Arizona Medicaid)
- Arizona Legislature senior care bills
- McKnight's Senior Living
- Senior Housing News
- AHCA/NCAL
- LeadingAge
- Kaiser Family Foundation
- CDC Health Alerts
- Google News feeds (assisted living Arizona, caregiver shortage, senior living regulations)
- Local Arizona news sources

Each source uses a 3-layer proxy fallback:
1. Direct fetch
2. allorigins.win proxy (handles 403/rate-limit blocks)
3. rss2json.com API (handles Cloudflare-protected sites)

Articles are filtered — only those published within the last 30 days and containing relevant keywords (assisted living, ALTCS, caregiver, memory care, Medicaid, etc.) are imported.

**Step 2 — AI Processing (OpenAI GPT-4o-mini)**
Each imported article is processed with a purpose-built prompt. The AI persona is a seasoned Arizona ALF operator who translates complex regulatory news into plain language.

Output fields per article:
- `headline` — plain-English headline written for a facility owner, not a journalist
- `summary` — 2-3 sentences, zero jargon, written like explaining to a friend who owns a facility
- `what_this_means` — real-world impact for an Arizona ALF owner specifically (compliance deadlines, staffing ratios, ALTCS billing, inspection criteria)
- `operator_takeaway` — one concrete action starting with a verb (e.g., "Review your medication documentation before your next ADHS inspection")
- `facebook_post` — 150-250 word post for Arizona ALF Facebook groups with hook, explanation, and engagement question
- `email_blurb` — 2-3 sentences for an email newsletter
- `relevance_score` — 1-10 (10 = directly affects Arizona ALF compliance today, 1 = completely unrelated)

**Step 3 — Admin Review**
Admin reviews processed articles in the content table:
- **Filter** by category, priority, status, source name, date range
- **Approve** articles that are relevant and well-processed
- **Reject** irrelevant articles
- **Mark Ready to Post** — flags content for publishing to facility owner feeds
- **Reprocess** — run an article through AI again if the output needs improvement
- **Edit** any AI-generated field before publishing

**Priority levels auto-assigned:**
- `CRITICAL` — articles from ADHS, AHCCCS, Arizona Legislature, CMS (regulatory sources)
- `HIGH` — articles with Arizona-specific keywords (Phoenix, Tucson, ADHS, ALTCS, etc.)
- `NORMAL` — general industry news without Arizona connection

**Categories auto-assigned** by keyword matching:
Arizona Regulations, Compliance & Licensing, ALTCS / Medicaid, Staffing & Caregivers, Memory Care, Risk / Legal / Liability, Market Trends, Residential Assisted Living, Manager Insights, Assisted Living Operations, Senior Care Industry News

**Source management:**
Admin can add new RSS sources, edit existing ones, enable/disable sources, and see when each source was last fetched.

**Backend endpoints used:**
- `GET /intelligence-hub/stats` — article counts by status
- `GET /intelligence-hub/items` — paginated article list with filters
- `PATCH /intelligence-hub/items/:id` — update article fields / approve / reject / ready-to-post
- `DELETE /intelligence-hub/items/:id` — delete
- `POST /intelligence-hub/items/:id/reprocess` — reprocess through AI
- `POST /intelligence-hub/ingest` — manual trigger (5-minute timeout)
- `GET /intelligence-hub/sources` — list sources
- `POST /intelligence-hub/sources` — add source
- `PATCH /intelligence-hub/sources/:id` — edit source
- `DELETE /intelligence-hub/sources/:id` — delete source

**Why it matters:** This is the compliance intelligence layer of the platform. Most compliance tools are just checklists. RAL Connect pairs task tracking with live ADHS/ALTCS regulatory alerts — the system tells owners what changed and what to do about it in one place. This is the primary competitive differentiator.

---

### 5.6 CMS Content (`/admin/cms`)

**Purpose:** Manage static educational content published to platform users — guides, resources, help articles.

**What it does:**
- Admin creates content resources (title, body, category, type)
- Resources saved as drafts until explicitly published
- **Publish** action makes content live and visible to platform users
- Content can cover: ADHS inspection guides, compliance checklists, best practice articles, regulation summaries

**Backend endpoints used:**
- `GET /cms/resources` — list resources
- `POST /cms/resources` — create
- `PATCH /cms/resources/:id` — update
- `PATCH /cms/resources/:id/publish` — publish
- `DELETE /cms/resources/:id` — delete

---

### 5.7 Reports (`/admin/reports`)

**Purpose:** Platform analytics for the RAL Connect operator.

**What it shows:**
- Dashboard summary: total facilities, total users, active vendors, platform growth
- Facility reports: approval rates, activity levels, flagged facilities
- Partner reports: vendor engagement and visibility stats
- Inquiry reports: placement volumes (ready for placement phase activation)

**Backend endpoints used:**
- `GET /reports/dashboard` — summary stats
- `GET /reports/facilities` — facility analytics
- `GET /reports/partners` — partner analytics
- `GET /reports/inquiries` — inquiry analytics

---

### 5.8 Configuration (`/admin/config`)

**Purpose:** Platform-level settings management.

**What it does:**
- Controls global platform behavior
- Matching engine parameters (weights for bed availability, services, location)
- Platform-wide toggles

**Backend endpoints used:**
- `GET /admin/config` — get current config
- `PATCH /admin/config` — update config

---

## 6. Facility Owner Dashboard — All Pages

### 6.1 Dashboard Home (`/dashboard`)

**Purpose:** Immediate compliance health overview — the first thing an owner sees when they log in.

**What it shows:**

**4 Live Stat Cards (pulled from real API):**

1. **Open Tasks**
   - Value: Count of currently open compliance tasks
   - Badge: Number of overdue tasks (red) or "On track" (green)
   - Source: `GET /compliance/stats?facilityId=`

2. **Credential Alerts**
   - Value: Total expired + expiring-soon staff credentials combined
   - Badge: Breakdown of expired vs expiring count
   - Source: Same compliance stats endpoint

3. **Profile Status**
   - Value: Approved / Pending Review / Rejected
   - Badge: Visible / Hidden
   - Source: `GET /facilities/my`

4. **Open Incidents**
   - Value: Count of open + under-review incidents
   - Badge: Critical incidents count if any
   - Source: Same compliance stats endpoint

**Compliance Alerts Panel (live feed):**
Shows the most urgent items across all three compliance areas:
- Overdue tasks — red dot, "OVERDUE" badge
- Expired staff credentials — red dot, "EXPIRED" badge
- Credentials expiring within 30 days — amber dot, "EXPIRING" badge
- Open incidents — orange dot, "OPEN" badge
- **Green "All clear" state** when nothing needs attention — no overdue tasks, no expired credentials, no open incidents

**Quick Action Cards:**
- Compliance Center → `/dashboard/compliance`
- Edit Facility Profile → `/dashboard/facility-profile`
- Log an Incident → `/dashboard/compliance`
- Staff Credentials → `/dashboard/compliance`

**First-time setup:** If no facility exists yet, shows a setup card where owner enters their facility name to create their first listing.

---

### 6.2 Facility Profile (`/dashboard/facility-profile`)

**Purpose:** Owner maintains their facility's information — the record that represents their home on the platform.

**What it does:**

**Basic Information:**
- Facility name, address (street, city, state, zip code)
- Capacity (total beds), current availability count
- Status indicator (approved/pending/rejected) — read-only, admin-controlled

**Services & Details:**
- Services offered (multi-select)
- Description (free text)
- Phone, email, website
- Pricing range (min/max in USD)

**Photo Management:**
- Upload photos directly to Cloudinary CDN
- Add a label to each photo (e.g., "Common Room", "Private Room")
- Delete individual photos
- Photos stored at Cloudinary URL — no server disk usage

**Policies:**
- Admission policy
- Discharge policy
- Visitor policy
- Medication management policy
- Emergency procedures
- Privacy policy

All changes go to `PATCH /facilities/:id` immediately. Profile changes may trigger re-review by admin depending on the nature of the change.

**Backend endpoints used:**
- `GET /facilities/my` — load current facility data
- `PATCH /facilities/:id` — save changes
- `POST /facilities/:id/photos` — upload photo to Cloudinary
- `DELETE /facilities/:id/photos?publicId=` — remove photo from Cloudinary

---

### 6.3 Compliance Center (`/dashboard/compliance`)

**Purpose:** The core product — a complete compliance management tool for ADHS survey readiness and day-to-day operations.

**Facility selector:** If an owner manages multiple facilities, a dropdown at the top lets them switch between homes. Stats and all three tabs update for the selected facility.

**Stats row at top:**
- Open Tasks (with overdue count)
- Overdue Tasks (needs attention)
- Open Incidents (with critical count)
- Credential Alerts (expired + expiring)

---

#### Tab 1: Tasks

**Purpose:** Track every compliance task so nothing falls through the cracks.

**Creating a task:**
- Title (required)
- Description
- Category: Documentation, Staffing, Medication, Safety, Training, Survey Prep, Infection Control, Resident Care, Other
- Priority: Low, Medium, High, Critical
- Due date
- Assigned to (staff member name)
- Recurring: Yes/No — if recurring, set frequency (Daily/Weekly/Monthly/Quarterly/Annually)
- Notes

**Task lifecycle:**
- Created → status is **Open**
- Staff works on it → status updated to **In Progress**
- Past due date with open/in-progress status → system automatically marks **Overdue** (runs on every fetch, no manual action needed)
- Completed → one-click "Done" button → status **Completed**, timestamp and completer recorded

**Filtering:**
- By status (Open, In Progress, Completed, Overdue)
- By priority (Low, Medium, High, Critical)
- By category

**Table sorted by:** Due date ascending (most urgent first), then priority descending.

**Backend endpoints used:**
- `GET /compliance/tasks?facilityId=` — list with filters
- `POST /compliance/tasks` — create
- `PATCH /compliance/tasks/:id` — edit
- `PATCH /compliance/tasks/:id/complete` — mark complete
- `DELETE /compliance/tasks/:id` — delete

---

#### Tab 2: Incidents

**Purpose:** Document every incident with full detail — critical for ADHS inspections and liability protection.

**Logging an incident:**
- Title (required) — brief description of what happened
- Type: Fall, Medication Error, Elopement, Abuse/Neglect, Injury, Illness Outbreak, Property Damage, Behavioral, Other
- Severity: Minor, Moderate, Serious, Critical
- Incident date (required)
- Description — full narrative of what happened
- Immediate actions taken — what staff did in response
- Residents involved — comma-separated names
- Staff involved — comma-separated names
- Witnesses — comma-separated names
- Follow-up required — checkbox, with follow-up date and notes if yes
- Reported to ADHS — checkbox, with report date and report number if yes

**Incident status:**
- **Open** — newly logged, under assessment
- **Under Review** — being investigated or monitored
- **Resolved** — incident fully addressed and closed
- **Reported to ADHS** — formally reported to Arizona Department of Health Services

**Severity color coding:**
- Minor — gray
- Moderate — amber
- Serious — orange
- Critical — red

**Filtering:**
- By type
- By severity
- By status

**Table sorted by:** Incident date descending (most recent first).

**Backend endpoints used:**
- `GET /compliance/incidents?facilityId=` — list with filters
- `POST /compliance/incidents` — create
- `PATCH /compliance/incidents/:id` — edit / update status
- `DELETE /compliance/incidents/:id` — delete

---

#### Tab 3: Credentials

**Purpose:** Track every staff member's required certifications and get warned before they expire — ADHS inspectors check credentials.

**Required credentials tracked:**
- Fingerprint Clearance Card (Arizona DPS requirement)
- CPR / First Aid
- TB Test
- Food Handler Card
- Alzheimer's / Dementia Training
- Manager Certification
- CNA Certificate
- Medication Aide
- Direct Care Worker Certificate
- Other (custom name)

**Adding a credential:**
- Staff name (required)
- Role / Job title (required)
- Credential type (required)
- Credential name (if "Other" type)
- Issue date (optional)
- Expiration date (required)
- Notes

**Auto-computed status (recalculated on every page load):**
- **Valid** (green) — expiration date is more than 30 days away
- **Expiring Soon** (amber) — expiration date is within the next 30 days
- **Expired** (red) — expiration date has already passed

**When a credential is renewed:** Owner edits the record, updates the expiration date, status automatically recalculates to Valid.

**Table sorted by:** Expiration date ascending — most critical credentials always at top. Days remaining shown next to expiring credentials.

**Filtering:**
- By status (Valid, Expiring Soon, Expired)
- By credential type
- By staff name (search)

**Backend endpoints used:**
- `GET /compliance/credentials?facilityId=` — list with filters
- `POST /compliance/credentials` — add credential
- `PATCH /compliance/credentials/:id` — edit / renew
- `DELETE /compliance/credentials/:id` — delete

---

## 7. Vendor Dashboard — All Pages

### 7.1 Vendor Dashboard Home (`/vendor`)

**Purpose:** Vendor's overview of their listing on the RAL Connect platform.

**What it shows:**
- Business name and logo
- Category (e.g., Staffing Agency, Training Provider, Background Check)
- Description
- Contact information (email, phone, website, address)
- **Visibility status** — "Visible to Facilities" (green) or "Hidden" (gray)
- Order weight and member since date
- If hidden: amber warning banner — "Your profile is currently hidden. Contact an administrator to make your profile visible to facilities."
- Edit Profile button

**Backend endpoints used:**
- `GET /partners/my` — load the vendor's own partner profile

---

### 7.2 Vendor Profile (`/vendor/profile`)

**Purpose:** Vendor maintains their own business listing details.

**Editable fields (vendor controls):**
- Business name
- Description — what services they offer, their specialization
- Logo URL — link to their business logo image
- Email
- Phone
- Website
- Address

**Read-only fields (admin controls — displayed but not editable):**
- Category — set by admin when creating the vendor profile
- Visibility — admin decides when a vendor goes live
- Order weight — admin controls display priority

**Save behavior:**
- "Discard Changes" resets all fields to last saved values
- "Save Changes" calls `PATCH /partners/:id` — changes visible to admin immediately
- Toast notification confirms success or shows error

**Backend endpoints used:**
- `GET /partners/my` — load current profile
- `PATCH /partners/:id` — save changes

---

## 8. Backend Modules Reference

| Module | Routes | Purpose |
|---|---|---|
| Auth | `POST /auth/login`, `POST /auth/register` | JWT authentication |
| Users | `GET/PATCH/DELETE /users` | User management and approval |
| Facilities | `GET/POST/PATCH/DELETE /facilities` | Facility listings and photos |
| Partners | `GET/POST/PATCH/DELETE /partners` | Vendor/partner management |
| Compliance | `GET/POST/PATCH/DELETE /compliance/tasks`, `/incidents`, `/credentials` | Compliance tracking — Tasks, Incidents, Credentials |
| Intelligence Hub | `GET/POST/PATCH/DELETE /intelligence-hub/*` | RSS ingestion + AI processing + article management |
| Notifications | `GET/PATCH/DELETE /notifications` | In-app notification system |
| Reports | `GET /reports/*` | Platform analytics |
| CMS | `GET/POST/PATCH/DELETE /cms/resources` | Content management |
| Admin | `GET/PATCH /admin/config` | Platform configuration |
| Inquiries | `GET/POST/PATCH /inquiries` | Placement inquiries (deferred) |
| Matching | `POST /matching/*` | Placement matching engine (deferred) |
| Social Boost | `GET/POST/PATCH/DELETE /social-boost` | Social media posts (deferred) |
| Deal Room | `GET/POST/PATCH/DELETE /deal-room/*` | M&A deal room (deferred) |
| Public | `POST /public/inquiry`, `GET /public/search` | Public-facing endpoints |
| Cloudinary | Internal service | Image upload and deletion |

---

## 9. Deferred Features (Placement Phase)

These features are **fully built** on both backend and frontend. They are hidden via commented-out sidebar entries only. To activate any feature: uncomment the relevant line in the sidebar file.

### Availability Tracking (`/dashboard/availability`)
- Facility owner updates their current available bed count
- Auto-flags facility as inactive if not updated in 24 hours
- Feeds into the matching engine for placement
- **To re-enable:** Uncomment in `components/sidebar/page.tsx`

### Inquiries — Admin (`/admin/inquiries`)
- Admin manages care placement inquiries submitted through the public form
- View inquiry details, assign to matching engine, track status
- **To re-enable:** Uncomment in `components/sidebar/AdminSidebar.tsx`

### Support Network (`/dashboard/support-network`)
- Facility owners browse vetted vendors and referral partners
- Connects facilities with staffing agencies, training providers, and discharge planners
- Powered by the Partners module
- **To re-enable:** Uncomment in `components/sidebar/page.tsx`

### Social Boost (`/dashboard/social-boost`)
- Facility owner submits social media post requests (caption, category, channel, optional image)
- Admin reviews and manages submissions
- Supports Facebook and other channels
- **To re-enable:** Uncomment in `components/sidebar/page.tsx`

### Deal Room (`/dashboard/deal-room` and `/admin/deal-room`)
- Facility owners request access to a curated deal room for M&A activity
- Admin approves/rejects access requests
- Approved facilities can view and create listings (facility acquisitions, partnerships)
- **To re-enable:** Uncomment in both sidebar files

### Matching Engine
- Runs on placement inquiry submission
- Scores facilities based on: available beds, service match, zip code proximity, approval status
- Auto-assigns best matches or allows admin manual assignment
- Full configuration via Admin Config page

---

## 10. How All Three Dashboards Connect

```
┌─────────────────────────────────────────┐
│              ADMIN DASHBOARD            │
│                                         │
│  Creates & approves FACILITY accounts   │
│  Creates & approves VENDOR accounts     │
│  Curates INTELLIGENCE HUB content       │
│  Manages platform settings              │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌──────────────┐  ┌──────────────────┐
│  FACILITY    │  │  VENDOR          │
│  DASHBOARD   │  │  DASHBOARD       │
│              │  │                  │
│  Compliance  │  │  Profile listing │
│  Tasks       │  │  visible to      │
│  Incidents   │  │  facility owners │
│  Credentials │  │  when Support    │
│  Intel feed  │  │  Network enabled │
│  (future)    │  │                  │
└──────────────┘  └──────────────────┘
```

**Admin → Facility:**
- Admin approves facility account → owner can log in
- Admin approves facility listing → listing goes live
- Admin flags inactive facilities → owner notified to update
- Admin publishes CMS content → visible to facility owners
- Admin curates Intelligence Hub articles → regulatory alerts reach facility owners (feed delivery in development)

**Admin → Vendor:**
- Admin creates vendor profile → vendor linked to their account
- Admin sets vendor visible → vendor listing accessible to facilities
- Admin controls category, order weight, visibility

**Vendor → Facility (Placement Phase):**
- Vendor listed in Support Network → facility owners can browse and contact vendors
- Vendors in staffing/training categories directly support facility compliance operations

**Facility → Admin:**
- Facility submits profile → admin reviews and approves
- Facility requests Deal Room access → admin approves/rejects

---

## 11. Revenue Model

### Current Phase — Compliance SaaS

**Model:** Recurring subscription per facility home

**Value delivered per subscription:**
- Compliance task management — never miss a deadline
- Incident documentation — ADHS-ready records always on hand
- Staff credential tracking — automatic expiration alerts
- Regulatory intelligence — AI-translated news from ADHS, CMS, ALTCS, Arizona Legislature

**Target buyer:** Arizona ALF owner or manager

**Sales motion:** Product-led, direct to owner. Short sales cycle because the pain (ADHS compliance pressure) is immediate and real.

**Client's plan:** The client is personally getting certified as an Arizona assisted living manager. This puts them directly inside the ecosystem — using the platform themselves, getting real-world feedback, introducing it organically to other owners, and generating management income while building the user base.

### Future Phase — Placement Marketplace

Once compliance user base is established:

**Model:** Transaction fee or referral fee per placement

**Additional revenue streams:**
- Featured placement in vendor directory
- Premium Deal Room listings
- Social Boost credits
- Enhanced facility profiles

**Why sequence matters:** Compliance users are facility owners who already trust the platform. When placement is activated, they are already users — adoption of the placement features happens from the inside out, not through cold outreach to hospitals and discharge planners.

---

*This document covers the full RAL Connect system as of April 2026. Backend code is at `ral-connect-server/src/`. Frontend code is at `ral-connect/`. For the Intelligence Hub specifically, see also `Intelligence Hub.pdf` in this folder.*
