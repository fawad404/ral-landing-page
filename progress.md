# RAL Connect — Session Progress File
> Read this at the start of every new session. This is the single source of truth for where we left off.

**Last Updated:** April 24, 2026  
**Backend:** `D:\Softnixt Solutions\Projects\RAL Connect\ral-connect-server\ral-connect-server`  
**Frontend:** `D:\Softnixt Solutions\Projects\RAL Connect\ral-connect`

---

## Project Context

RAL Connect is a NestJS + Next.js SaaS platform for Arizona assisted living market. Three user roles: ADMIN, FACILITY, VENDOR.

**Current phase:** Compliance-first platform (placement engine is built but commented out in sidebars — re-enable later).

The client PDF handoff is at `websiteDoc/Intelligence Hub.pdf` — read it for full context on Intelligence Hub requirements including source list and AI prompt structure.

---

## Frontend Work Completed (April 24 Session)

- **`CustomSelect` component** created at `components/global/CustomSelect.tsx` — replaces ALL native `<select>` elements across the entire codebase. Props: `value`, `onChange`, `options`, `placeholder`, `className`. Uses `useRef` click-outside detection. Panel uses `min-w-full` + `whitespace-nowrap` on options so it auto-expands without overflowing.
- **Compliance page filter redesign** (`website/dashboard/compliance/page.tsx`) — filters moved inline with tab types in a `justify-between` row. Filter state lifted to parent `ComplianceContent`. Local `FilterDropdown` component (right-anchored, `h-9`) handles the filter bar. `CustomSelect` used for all form fields in that page.
- **All native `<select>` replaced with `CustomSelect`** across: `deal-room`, `facility-profile`, `social-boost` (facility dashboard); `intelligence-hub/page`, `intelligence-hub/detail`, `intelligence-hub/sources`, `inquiries/detail`, `cms` (admin); `login/pages`.
- **Intelligence hub filter bar styling fixed** — search, date inputs, and Clear button all use `h-10 rounded-lg border-[#E2E8F0]` to match `CustomSelect` height and radius.

---

## What Is Fully Built and Working

### Backend (NestJS + MongoDB)
- Auth module (JWT, login, register, roles)
- Users module (CRUD, approve, activate/deactivate)
- Facilities module (CRUD, photos via Cloudinary, policies, approval flow)
- Partners/Vendors module (CRUD, visibility toggle)
- **Compliance module** — Tasks, Incidents, Staff Credentials (full CRUD + auto-status logic)
- Intelligence Hub module — RSS ingestion + OpenAI processing + content management
- Notifications, Reports, CMS, Admin Config modules
- Inquiries, Matching, Social Boost, Deal Room modules (built but deferred)

### Frontend (Next.js 14)
- Admin dashboard: Users, Facilities, Vendors, Intelligence Hub, CMS, Reports, Config
- Facility dashboard: Home (compliance stats), Facility Profile, **Compliance Center** (Tasks/Incidents/Credentials)
- Vendor dashboard: Home, Profile
- All React Query hooks, services, types wired up
- Compliance alerts panel on facility dashboard home (live API)

### Sidebar State
- Facility sidebar: Compliance is active. **Commented out:** Availability, Support Network, Social Boost, Deal Room
- Admin sidebar: Active items only. **Commented out:** Inquiries, Deal Room
- All commented with: `// ── Placement-phase features — re-enable when placement engine launches ──`

---

## Current Active Issue — Intelligence Hub RSS Ingestion

### Background
The Intelligence Hub ingests RSS feeds from 17 sources every 2 hours, processes them with OpenAI, and stores content for admin review.

### ProxyShare Setup
A residential proxy has been purchased to bypass blocked sources.

**Credentials in `.env`:**
```
PROXY_HOST=proxy.proxyshare.com
PROXY_PORT=5959
PROXY_USERNAME=ps-v42tset601dm
PROXY_PASSWORD=NewProxySA123
```

**ProxyShare sub-account setup:**
- Traffic Limit: 10000 GB (set correctly)
- Daily Traffic Limit: 0 (no cap — correct)
- Auth is confirmed working (tested — returns residential IP)

**`package.json` start scripts** already updated with `--insecure-http-parser` flag:
```json
"start": "nest start -- --insecure-http-parser",
"start:dev": "nest start --watch -- --insecure-http-parser",
"start:prod": "node --insecure-http-parser dist/main"
```

### Current Ingestion Errors (8 sources failing)

| Source | Current URL in DB | Error | Root Cause |
|---|---|---|---|
| ADHS Newsroom | `https://www.azdhs.gov/rss.xml` | Parse Error: Invalid header value char | Cloudflare — needs `insecureHTTPParser` on axios agents |
| AHCA/NCAL | `https://www.ahcancal.org/rss.xml` | socket hang up | Cloudflare blocked |
| LeadingAge | `https://leadingage.org/rss.xml` | Maximum number of redirects exceeded | Wrong URL — correct URL is `/feed/` |
| McKnight's Senior Living | `https://www.mcknightsseniorliving.com/feed/` | 403 | Cloudflare blocked |
| Modern Healthcare | `https://www.modernhealthcare.com/rss.xml` | ENOTFOUND | DNS fail — domain wrong |
| AZ Central | `https://www.azcentral.com/rss/` | 409 | Wrong URL / Cloudflare |
| Phoenix Business Journal | `https://www.bizjournals.com/phoenix/rss.xml` | ENOTFOUND | DNS fail |
| ABC15 Arizona | `https://www.abc15.com/rss` | 404 | Wrong URL |
| CMS Newsroom | (working fetch) | Cast to date failed "Invalid Date" | Date parsing bug in service |

### What Was Tested and Confirmed Working
All Google News RSS feeds work perfectly (confirmed via test):
```
https://news.google.com/rss/search?q=arizona+department+health+services+ADHS&hl=en-US&gl=US&ceid=US:en
https://news.google.com/rss/search?q=McKnights+senior+living&hl=en-US&gl=US&ceid=US:en
https://news.google.com/rss/search?q=AHCA+NCAL+long+term+care&hl=en-US&gl=US&ceid=US:en
https://news.google.com/rss/search?q=modern+healthcare+news&hl=en-US&gl=US&ceid=US:en
https://news.google.com/rss/search?q=arizona+health+senior+care+site:azcentral.com&hl=en-US&gl=US&ceid=US:en
https://news.google.com/rss/search?q=phoenix+business+journal+health&hl=en-US&gl=US&ceid=US:en
https://news.google.com/rss/search?q=ABC15+arizona+health+senior&hl=en-US&gl=US&ceid=US:en
https://leadingage.org/feed/
```

**Note from client PDF (page 20–21):** Client explicitly approved Google News as "BONUS: SMART HACK" for filling gaps. ADHS says "if unavailable, scrape newsroom page" — Google News search is the equivalent approach.

---

## Fixes Needed in Next Session

### Fix 1 — `feed-ingestion.service.ts` (3 code bugs)

**File:** `src/intelligence-hub/feed-ingestion.service.ts`

**Bug 1 — Missing http/https imports + insecureHTTPParser on axios agents:**
Add at top of file (after `import axios`):
```typescript
import * as https from 'https';
import * as http from 'http';
```

In the `fetchFeed` method, update the axios call to add agents:
```typescript
const response = await axios.get<string>(rssUrl, {
  proxy: {
    protocol: 'http',
    host,
    port: Number(port),
    auth: { username, password },
  },
  httpsAgent: new https.Agent({ insecureHTTPParser: true }),
  httpAgent: new http.Agent({ insecureHTTPParser: true }),
  timeout: 30000,
  responseType: 'text',
  headers: this.PROXY_HEADERS,
  maxRedirects: 10,   // Bug 2 fix — was 5, LeadingAge needs more
});
```

**Bug 3 — Invalid date crash (CMS Newsroom):**
In `ingestSource`, after this line:
```typescript
const publishDate = item.pubDate ? new Date(item.pubDate) : new Date();
```
Add:
```typescript
if (isNaN(publishDate.getTime())) { notRelevant++; continue; }
```

### Fix 2 — Update Source URLs in MongoDB

Write and run a one-time Node.js migration script that connects to MongoDB and updates the `rssUrl` for broken sources.

**Mapping (old URL → new URL):**
```
LeadingAge:            leadingage.org/rss.xml        → leadingage.org/feed/
ADHS Newsroom:         azdhs.gov/rss.xml             → news.google.com/rss/search?q=arizona+department+health+services+ADHS&hl=en-US&gl=US&ceid=US:en
AHCA/NCAL:             ahcancal.org/rss.xml           → news.google.com/rss/search?q=AHCA+NCAL+long+term+care&hl=en-US&gl=US&ceid=US:en
McKnight's:            mcknightsseniorliving.com/feed/ → news.google.com/rss/search?q=McKnights+senior+living&hl=en-US&gl=US&ceid=US:en
Modern Healthcare:     modernhealthcare.com/rss.xml   → news.google.com/rss/search?q=modern+healthcare+long+term+care&hl=en-US&gl=US&ceid=US:en
AZ Central:            azcentral.com/rss/             → news.google.com/rss/search?q=arizona+senior+assisted+living+site:azcentral.com&hl=en-US&gl=US&ceid=US:en
Phoenix BizJournal:    bizjournals.com/phoenix/rss.xml → news.google.com/rss/search?q=phoenix+business+health+senior+care&hl=en-US&gl=US&ceid=US:en
ABC15 Arizona:         abc15.com/rss                  → news.google.com/rss/search?q=ABC15+arizona+assisted+living+senior&hl=en-US&gl=US&ceid=US:en
```

**Migration script location:** Write at `scripts/fix-source-urls.js` in backend project.

**Script template:**
```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const URL_MAP = {
  'https://leadingage.org/rss.xml': 'https://leadingage.org/feed/',
  'https://www.azdhs.gov/rss.xml': 'https://news.google.com/rss/search?q=arizona+department+health+services+ADHS&hl=en-US&gl=US&ceid=US:en',
  // ... rest of map
};

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Source = mongoose.model('Source', new mongoose.Schema({}, { strict: false }), 'sources');
  for (const [oldUrl, newUrl] of Object.entries(URL_MAP)) {
    const result = await Source.updateOne({ rssUrl: oldUrl }, { $set: { rssUrl: newUrl } });
    console.log(oldUrl, '->', result.modifiedCount ? 'UPDATED' : 'NOT FOUND');
  }
  await mongoose.disconnect();
}
run();
```

---

## Environment Variables (Backend .env)

```
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
OPENAI_API_KEY=sk-proj-...
CLOUDINARY_CLOUD_NAME=dc9shyxcm
CLOUDINARY_API_KEY=538692727994995
CLOUDINARY_API_SECRET=5a_TBr8ZG2CV2EEbrD5Cm6vcBjM
PROXY_HOST=proxy.proxyshare.com
PROXY_PORT=5959
PROXY_USERNAME=ps-v42tset601dm
PROXY_PASSWORD=NewProxySA123
```

---

## Key File Paths

### Backend
- Main module: `src/app.module.ts`
- Feed ingestion (has the bugs): `src/intelligence-hub/feed-ingestion.service.ts`
- Compliance service: `src/compliance/compliance.service.ts`
- Compliance controller: `src/compliance/compliance.controller.ts`
- Source schema: `src/intelligence-hub/schemas/source.schema.ts`

### Frontend
- Admin sidebar: `components/sidebar/AdminSidebar.tsx`
- Facility sidebar: `components/sidebar/page.tsx`
- Compliance page: `website/dashboard/compliance/page.tsx`
- Dashboard home stats: `website/dashboard/stats.tsx`
- Dashboard compliance alerts: `website/dashboard/activityLogs.tsx`
- API endpoints: `api/endpoints.ts`
- Compliance hooks: `hooks/useCompliance.ts`
- Compliance service: `services/complianceService.ts`

---

## Packages Installed (Backend)

```
axios ^1.15.0          — used for proxy fetch in feed-ingestion
https-proxy-agent ^5.0.1 — installed but currently unused (axios handles proxy natively)
```

---

## What to Do in Next Session

**Priority order:**
1. Apply Fix 1 (3 code bugs in `feed-ingestion.service.ts`)
2. Write and run Fix 2 (MongoDB migration script for source URLs)
3. Restart backend and trigger manual ingestion to verify all 17 sources work
4. Confirm 0 errors in ingestion result

After RSS is fixed, remaining deferred work:
- Social Boost backend module (was in progress)
- Deal Room backend module
- Wire new modules into app.module.ts
- Update frontend types/endpoints/services/hooks for any remaining gaps
