# RAL Connect — Backend (NestJS)

## What This Project Is
A NestJS 11 + MongoDB REST API backend for **RAL Connect** — a platform connecting assisted living facilities, vendors, and care seekers in Arizona. Three user roles: **admin**, **facility**, **vendor**. Also powers the **Arizona Assisted Living Intelligence Hub**, an internal AI-driven content engine.

## Stack
- **Framework:** NestJS 11 (TypeScript)
- **Database:** MongoDB via Mongoose (`@nestjs/mongoose`) — Atlas cluster, DB: `ral-connect-server`
- **Auth:** JWT + Passport (`@nestjs/jwt`, `passport-jwt`)
- **Scheduler:** `@nestjs/schedule` (cron jobs)
- **AI:** OpenAI SDK (`openai`) — GPT-4o-mini (Intelligence Hub only)
- **RSS Parsing:** `rss-parser` (Intelligence Hub only)
- **Docs:** Swagger at `/api/docs`
- **Global prefix:** `/api`
- **Port:** 3000

## Project Structure
```
src/
├── admin/              # Admin config (matching weights, category limits)
├── auth/               # JWT login/register, seed admin on boot
├── cms/                # CMS Resources (blog, guidance, directory)
├── common/
│   ├── decorators/     # @CurrentUser, @Roles
│   ├── enums/          # Role enum: admin | facility | vendor
│   ├── filters/        # GlobalExceptionFilter
│   └── guards/         # JwtAuthGuard, RolesGuard
├── config/
│   └── configuration.ts  # Reads all env vars
├── facilities/         # Facility profiles, approval, availability, visibility
├── inquiries/          # Care placement inquiries (family → facility matching)
├── intelligence-hub/   # AI content engine (see dedicated section below)
├── matching/           # Scoring engine + manual override
├── notifications/      # Internal alerts
├── partners/           # Vendors/partners
├── public/             # Public endpoints (no auth): inquiry submit, facility search
├── reports/            # Analytics dashboard
├── users/              # User management
├── app.module.ts       # Root module — all feature modules imported here
└── main.ts             # Bootstrap, port 3000, global /api prefix
```

## Auth Pattern
- All protected routes: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.ADMIN)` / `@Roles(Role.FACILITY)` etc.
- JWT from `Authorization: Bearer <token>` header
- `@CurrentUser()` decorator injects authenticated user in controllers
- Three roles: `admin`, `facility`, `vendor`

## Module Pattern (follow this exactly)
Each module has: `module.ts`, `controller.ts`, `service.ts`, `schemas/`, `dto/`
- **Schema:** `@Schema({ timestamps: true })` + `SchemaFactory.createForClass()`
- **DTOs:** class-validator decorators + `@ApiProperty` for Swagger; Update DTOs use `PartialType(CreateDto)`
- **Services:** `@InjectModel(Name.name)` + throw `NotFoundException` when not found
- **Controllers:** `@ApiTags`, `@ApiBearerAuth('JWT-auth')`, `@ApiOperation`

## Environment Variables (.env)
```
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3001
ADMIN_SEED_EMAIL=admin@ralconnect.com
ADMIN_SEED_PASSWORD=Admin@123456
OPENAI_API_KEY=sk-proj-...     # required for Intelligence Hub only
```

## Key Conventions
- Always add new modules to `app.module.ts` imports
- Always add new config keys to `src/config/configuration.ts`
- `timestamps: true` gives `createdAt`/`updatedAt` automatically
- Global validation pipe: `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`

---

## Module Reference

### Auth (`src/auth/`)
- `POST /api/auth/register` — create account (facility or vendor)
- `POST /api/auth/login` — returns JWT token
- Seed: admin user auto-created on boot via `onModuleInit` if none exists

### Users (`src/users/`)
**Schema fields:** email, password (select:false), role, isApproved, isActive, lastLogin, firstName, lastName, phone

| Endpoint | Role | Description |
|---|---|---|
| `GET /api/users` | admin | List all users |
| `GET /api/users/activity` | admin | Recent activity |
| `GET /api/users/pending-approval` | admin | Users awaiting approval |
| `GET /api/users/:id` | admin | User detail |
| `PATCH /api/users/:id` | admin | Update user |
| `PATCH /api/users/:id/approve` | admin | Approve user |
| `PATCH /api/users/:id/activate` | admin | Activate user |
| `PATCH /api/users/:id/deactivate` | admin | Deactivate user |
| `PATCH /api/users/:id/reset-password` | admin | Reset password |
| `DELETE /api/users/:id` | admin | Delete user |

### Facilities (`src/facilities/`)
**Schema fields:** ownerId (ref User), name, address {street, city, state, zipCode, country}, capacity, availabilityCount, status (pending/approved/rejected), services[], isVisible, lastUpdated, isFlagged, description, phone, email, pricing {min, max, currency}

| Endpoint | Role | Description |
|---|---|---|
| `POST /api/facilities` | facility | Create facility |
| `GET /api/facilities` | admin | List all facilities (filters: status, search) |
| `GET /api/facilities/flagged` | admin | Flagged facilities |
| `GET /api/facilities/my` | facility | Own facility |
| `GET /api/facilities/:id` | any | Facility detail |
| `PATCH /api/facilities/:id` | facility/admin | Update facility |
| `PATCH /api/facilities/:id/availability` | facility | Update availability count |
| `PATCH /api/facilities/:id/approve` | admin | Approve facility |
| `PATCH /api/facilities/:id/reject` | admin | Reject facility |
| `PATCH /api/facilities/:id/activate` | admin | Activate |
| `PATCH /api/facilities/:id/deactivate` | admin | Deactivate |
| `DELETE /api/facilities/:id` | admin | Delete facility |

### Inquiries (`src/inquiries/`)
**Schema fields:** familyData {name, email, phone, relationship}, requirements {zipCode, services[], budget {min, max}, roomType, urgency, notes}, status (new/contacted/placed/closed), assignedFacilityIds[], matchHistory[] {facilityId, reason, score, assignedAt, isManualOverride}

| Endpoint | Role | Description |
|---|---|---|
| `POST /api/inquiries` | admin | Create inquiry |
| `GET /api/inquiries` | admin | List inquiries (filter: status) |
| `GET /api/inquiries/:id` | admin | Inquiry detail |
| `PATCH /api/inquiries/:id` | admin | Update inquiry/status |
| `DELETE /api/inquiries/:id` | admin | Delete inquiry |

Public (no auth): `POST /api/public/inquiry`

### Matching (`src/matching/`)
Scoring algorithm: location/zip code match (weight 0.4), services overlap (weight 0.4), budget fit (weight 0.2). Weights configurable via AdminConfig.

| Endpoint | Role | Description |
|---|---|---|
| `POST /api/matching/run/:inquiryId` | admin | Run matching algorithm, stores results with matchReason |
| `POST /api/matching/:inquiryId/manual-assign` | admin | Manually link facility to inquiry (isManualOverride: true) |
| `GET /api/matching/config` | admin | Get current matching weights |

### Partners / Vendors (`src/partners/`)
**Schema fields:** name, category, isVisible, orderWeight, contactInfo {email, phone, website, address}, description, logoUrl, userId

| Endpoint | Role | Description |
|---|---|---|
| `POST /api/partners` | vendor | Create partner profile |
| `GET /api/partners` | any | List visible partners |
| `GET /api/partners/categories` | any | List partner categories |
| `GET /api/partners/my` | vendor | Own partner profile |
| `GET /api/partners/:id` | any | Partner detail |
| `PATCH /api/partners/:id` | vendor/admin | Update partner |
| `PATCH /api/partners/:id/visibility` | admin | Toggle visibility |
| `DELETE /api/partners/:id` | admin | Delete partner |

### Notifications (`src/notifications/`)
**Schema fields:** userId (ref User, nullable = broadcast), type (new_inquiry/facility_inactive/user_signup/general), title, message, isRead, metadata {}
Auto-created by services: new inquiry created → `new_inquiry`, facility inactive 24h → `facility_inactive`, new user signup → `user_signup`.

| Endpoint | Role | Description |
|---|---|---|
| `GET /api/notifications` | admin | List notifications |
| `GET /api/notifications/unread-count` | admin | Unread count |
| `PATCH /api/notifications/:id/read` | admin | Mark one read |
| `PATCH /api/notifications/read-all` | admin | Mark all read |
| `DELETE /api/notifications/:id` | admin | Delete |

### CMS (`src/cms/`)
**Schema fields:** title, content, type (blog/guidance/directory), slug (unique), isPublished, authorId (ref User), tags[], excerpt, featuredImage

| Endpoint | Role | Description |
|---|---|---|
| `POST /api/cms/resources` | admin | Create resource |
| `GET /api/cms/resources` | any | List resources (filter: type, published) |
| `GET /api/cms/resources/slug/:slug` | any | Get by slug |
| `GET /api/cms/resources/:id` | any | Get by ID |
| `PATCH /api/cms/resources/:id` | admin | Update resource |
| `PATCH /api/cms/resources/:id/publish` | admin | Toggle publish |
| `DELETE /api/cms/resources/:id` | admin | Delete resource |

### Reports (`src/reports/`)
All admin-only. Aggregated statistics only — no separate schema, queries existing collections.

| Endpoint | Description |
|---|---|
| `GET /api/reports/dashboard` | Summary stats: total facilities, inquiries, users, partners + recent activity |
| `GET /api/reports/facilities` | Facility breakdown by status, availability trends |
| `GET /api/reports/inquiries` | Inquiry breakdown by status |
| `GET /api/reports/partners` | Partner performance stats |

### Admin Config (`src/admin/`)
Single document (`configKey: 'default'`). **Schema fields:** categoryLimits {}, defaultCategoryLimit (5), matchingWeights {distance:0.4, services:0.4, budget:0.2}, maxMatchResults (10)

| Endpoint | Description |
|---|---|
| `GET /api/admin/config` | Get current config |
| `PATCH /api/admin/config` | Update config (matching weights, limits) |

### Public (`src/public/`)
No auth required.
- `POST /api/public/inquiry` — submit care inquiry from website
- `GET /api/public/search` — search approved facilities (params: zipCode, services, budgetMin, budgetMax, limit)

---

## Intelligence Hub Module (`src/intelligence-hub/`)
Internal AI content engine for Arizona assisted living market intelligence.

### Collections
- `sources` — RSS feed sources (17 pre-seeded)
- `contentitems` — imported articles with raw + AI + admin fields

### Key Files
| File | Purpose |
|---|---|
| `schemas/source.schema.ts` | Source: name, rssUrl, type (rss/scrape/manual), tier (tier1/2/3), isActive |
| `schemas/content-item.schema.ts` | ContentItem: raw fields + AI fields (aiHeadline, aiSummary, aiWhatThisMeans, aiOperatorTakeaway, aiFacebookPost, aiEmailBlurb, aiRelevanceScore) + admin flags (reviewed, approved, priority, readyToPost, featured) |
| `ai-processing.service.ts` | OpenAI GPT-4o-mini. Throws typed `AiProcessingError` (invalid key, no credits, rate limit, server error) |
| `feed-ingestion.service.ts` | RSS parsing, dedup by articleUrl, keyword filter, Arizona-boost, auto-categorize. Cron: every 2 hours |
| `intelligence-hub.service.ts` | Seeds sources + categories on `onModuleInit`. `reprocessItem` wraps AI error as HttpException |

### Content Item Status Flow
`pending` → `processing` → `processed` → (admin) `approved` / `rejected`

### AI Error Handling
`AiProcessingError` wraps OpenAI errors: 401→invalid key, 429+insufficient_quota→no credits, 429+rate_limit→rate limited, 5xx→server error.
Background cron swallows errors (logs only). Manual reprocess (`throwOnError=true`) bubbles as `HttpException`.

### API Endpoints
```
GET  /api/intelligence-hub/stats
GET  /api/intelligence-hub/categories
POST /api/intelligence-hub/ingest          (manual trigger)
GET  /api/intelligence-hub/sources
POST /api/intelligence-hub/sources
PATCH /api/intelligence-hub/sources/:id
DELETE /api/intelligence-hub/sources/:id
GET  /api/intelligence-hub/items           (filters: search, category, sourceName, status, priority, approved, reviewed, readyToPost, dateFrom, dateTo, page, limit)
GET  /api/intelligence-hub/items/:id
PATCH /api/intelligence-hub/items/:id
DELETE /api/intelligence-hub/items/:id
POST /api/intelligence-hub/items/:id/reprocess
```

### Categories (11, pre-seeded)
Arizona Regulations, Compliance & Licensing, Assisted Living Operations, ALTCS / Medicaid, Staffing & Caregivers, Residential Assisted Living, Memory Care, Senior Care Industry News, Risk / Legal / Liability, Manager Insights, Market Trends

### Sources (17, pre-seeded)
Tier 1: ADHS, McKnight's, Senior Housing News, CMS, AHCA/NCAL, LeadingAge, Google News ×3
Tier 2: AHCCCS, KFF, CDC, Modern Healthcare
Tier 3: AZ Central, Phoenix Business Journal, 12 News Arizona, ABC15 Arizona
