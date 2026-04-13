# Academix Frontend — Development Guide

> This document is designed to be consumed by AI models or developers continuing work on this project.
> Last updated: 2026-04-13. All 104 tests passing.

## Tech Stack

| Component | Version | Notes |
|-----------|---------|-------|
| Next.js | 14.2.35 | App Router, pinned to 14 (v16 had React 19 peer dep issues with shadcn) |
| React | 18.3.1 | |
| TypeScript | 5 | |
| shadcn/ui | (via Radix UI) | 17 UI components in `src/components/ui/` |
| Tailwind CSS | 3 | With tailwindcss-animate plugin |
| NextAuth | 5.0.0-beta.19 | JWT strategy, OAuth providers |
| TanStack React Query | 5 | Server state (papers, user data, summaries) |
| Zustand | 4 | Client state (feed filters, onboarding selections) |
| Vitest | 1.6.1 | Unit + integration tests |
| Playwright | 1 | E2E tests (scaffolded, minimal coverage) |
| MSW | 2 | API mocking in tests |

## Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── (app)/                        # Authenticated routes (wrapped in app layout)
│   │   ├── feed/page.tsx             # Metro-style paper grid with infinite scroll
│   │   ├── onboarding/page.tsx       # Select 3-7 fields of interest
│   │   ├── paper/[id]/page.tsx       # Paper detail + 4 summary tabs/accordion
│   │   ├── settings/page.tsx         # Profile, interests editor, delete account
│   │   └── layout.tsx                # App shell: navbar, theme toggle, user menu
│   ├── (public)/
│   │   └── login/page.tsx            # OAuth login buttons
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth API route
│   ├── layout.tsx                    # Root layout (providers, fonts)
│   ├── page.tsx                      # Landing page (redirects to /feed if logged in)
│   ├── not-found.tsx                 # 404 page
│   └── globals.css                   # Tailwind base + custom CSS variables
├── components/
│   ├── auth/
│   │   ├── login-card.tsx            # Login form with OAuth buttons
│   │   └── oauth-button.tsx          # Individual OAuth provider button
│   ├── feed/
│   │   ├── metro-grid.tsx            # CSS Grid (grid-auto-flow: dense), 4 cols desktop → 1 col mobile
│   │   ├── paper-tile.tsx            # 3 sizes (small/medium/large), colored left border by field
│   │   └── paper-tile-skeleton.tsx   # Loading skeleton for tiles
│   ├── layout/
│   │   ├── navbar.tsx                # Top navigation bar
│   │   └── theme-toggle.tsx          # Light/dark mode toggle
│   ├── onboarding/
│   │   ├── field-chip.tsx            # Toggleable field chip
│   │   └── field-selector.tsx        # Grid of field chips (reused in onboarding + settings)
│   ├── settings/
│   │   └── settings-field-selector.tsx  # Controlled field selector for settings page
│   ├── ui/                           # 17 shadcn/ui primitives (do not modify directly)
│   └── error-boundary.tsx            # Generic error with retry button
├── config/
│   ├── field-colors.ts               # 23 field slugs → HSL color mapping
│   ├── fields-of-interest.ts         # Static field taxonomy (fallback if API unavailable)
│   └── site.ts                       # Site name, description, links
├── hooks/
│   ├── use-media-query.ts            # Responsive breakpoint detection
│   ├── use-metro-layout.ts           # assignTileSize() logic: large (first + high citations), medium, small
│   ├── use-papers.ts                 # useFeed (useInfiniteQuery), usePaperDetail, usePaperSummaries, useBookmarks, useToggleBookmark
│   ├── use-session-guard.ts          # Redirects to /login if unauthenticated
│   └── use-user-fields.ts            # useUserFields, useUpdateFields
├── lib/
│   ├── api-client.ts                 # Fetch wrapper: adds Authorization header, handles errors
│   ├── auth.ts                       # NextAuth config (Google provider, JWT callbacks)
│   ├── utils.ts                      # cn() classname merge utility
│   └── middleware.ts                 # Protects /feed, /settings, /onboarding routes
├── providers/
│   ├── providers.tsx                 # Composes all providers (theme, query, session)
│   ├── query-provider.tsx            # React Query client setup
│   └── theme-provider.tsx            # next-themes provider
├── stores/
│   ├── feed-store.ts                 # Zustand: sortBy, selectedFieldIds, search query
│   └── onboarding-store.ts           # Zustand: selectedFields, toggleField, canSubmit (3-7 validation)
├── types/
│   ├── api.ts                        # PaginatedResponse<T>, ApiError
│   ├── auth.ts                       # Session, TokenPair
│   ├── field.ts                      # Field, FieldSlug (union of 23 slugs)
│   └── paper.ts                      # Paper, PaperDetail, Summary, Author
└── test/
    ├── setup.ts                      # IntersectionObserver mock for jsdom + jest-dom/vitest
    ├── components/                   # 6 component test files
    ├── hooks/                        # 2 hook test files
    ├── integration/                  # 4 integration test files (MSW-mocked API)
    └── stores/                       # 2 Zustand store test files
```

## Key Design Decisions & Gotchas

### 1. Next.js pinned to 14
Version 16 introduced React 19 as a peer dependency, which broke shadcn/ui components. Pinned at 14.2.35.

### 2. IntersectionObserver mock required
jsdom doesn't provide `IntersectionObserver`. The feed page uses it for infinite scroll. A mock is in `src/test/setup.ts` that provides a no-op implementation. Without it, all feed-related tests fail.

### 3. HSL colors converted to RGB by jsdom
When testing inline styles that use HSL (e.g., field border colors), jsdom converts them to RGB. Tests must account for both formats. See `paper-tile.test.tsx` line 66.

### 4. Paper tile sizes
`assignTileSize()` in `use-metro-layout.ts` determines tile size:
- **Large**: First paper in the list, OR very high citation count
- **Medium**: High citation count, OR every 7th paper (index % 7 === 3)
- **Small**: Everything else

### 5. Metro Grid layout
Uses `CSS Grid` with `grid-auto-flow: dense` for the masonry-like effect. 4 columns on desktop, 2 on tablet, 1 on mobile. Large tiles span 2 columns.

### 6. Auth flow
NextAuth handles OAuth redirect → gets tokens from backend → stores in encrypted session cookie → `api-client.ts` injects `Authorization: Bearer` header → middleware redirects unauthenticated users to `/login` and first-timers (no interests) to `/onboarding`.

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run all tests (104 tests)
npm test
# or
./node_modules/.bin/vitest run

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Type check
npm run type-check

# E2E tests (requires dev server running)
npm run test:e2e
```

## Test Structure

### Component Tests (Vitest + React Testing Library)
| Test File | Tests | What it covers |
|-----------|-------|----------------|
| `paper-tile.test.tsx` | 15 | 3 tile sizes, colored border, field badges, TLDR, CSS classes |
| `metro-grid.test.tsx` | 6 | Grid rendering, tile count, size classes |
| `oauth-button.test.tsx` | 7 | OAuth button rendering, click handling |
| `field-selector.test.tsx` | 4 | Field selection, toggle, count |
| `field-chip.test.tsx` | 6 | Chip rendering, selected state, click handler |
| `theme-toggle.test.tsx` | 3 | Render, accessible label, screen-reader only |

### Hook Tests (Vitest)
| Test File | Tests | What it covers |
|-----------|-------|----------------|
| `use-papers.test.ts` | 6 | useFeed, usePaperDetail query setup |
| `use-metro-layout.test.ts` | 4 | assignTileSize logic for all paper types |

### Store Tests (Vitest)
| Test File | Tests | What it covers |
|-----------|-------|----------------|
| `feed-store.test.ts` | 10 | Sort, filter, search state transitions |
| `onboarding-store.test.ts` | 5 | Toggle fields, 3-7 validation, canSubmit |

### Integration Tests (Vitest + MSW)
| Test File | Tests | What it covers |
|-----------|-------|----------------|
| `feed-page.test.tsx` | 6 | Fetch papers → render grid → field filter chips |
| `paper-detail.test.tsx` | 15 | Paper metadata, summary tabs, bookmark, DOI link |
| `onboarding-flow.test.tsx` | 7 | Select fields → counter → submit → redirect |
| `settings-page.test.tsx` | 10 | Load fields → modify → save → API call |

### Test Configuration
- `vitest.config.ts` — jsdom environment, setup file, path aliases
- `src/test/setup.ts` — `@testing-library/jest-dom/vitest` + IntersectionObserver mock

## Type Definitions

### Paper (src/types/paper.ts)
```typescript
interface Paper {
  id: string
  title: string
  authors: { name: string }[]
  abstract: string
  journal: string
  publicationDate: string
  doi: string
  citationCount: number
  fields: string[]           // field slugs like "computer-science"
  keywords: string[]
  teaserSummary: string      // TLDR from Semantic Scholar
  isOpenAccess: boolean
  isBookmarked: boolean
}
```

### Field colors (src/config/field-colors.ts)
Each of the 23 field slugs maps to a unique HSL color used for the left border of paper tiles and field badges.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8080   # Backend API base URL
NEXTAUTH_SECRET=<random-secret>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>
```

## Deployment (Vercel)

### Setup
1. Import the `academix-fe` repo in [Vercel Dashboard](https://vercel.com/new)
2. Framework preset: **Next.js** (auto-detected)
3. Region: **Frankfurt (fra1)** (closest to Hetzner VPS)
4. Set environment variables (see `.env.production.template`):
   - `NEXT_PUBLIC_API_URL` = `https://api.academix.dev`
   - `NEXTAUTH_URL` = `https://academix.dev`
   - `NEXTAUTH_SECRET` = (generate with `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

### Custom Domain
1. In Vercel → Settings → Domains, add `academix.dev`
2. In Cloudflare DNS, add CNAME `academix.dev` → `cname.vercel-dns.com` (proxied)
3. Vercel auto-provisions SSL

### Deploy Pipeline
Vercel auto-deploys on every push to `main`. Preview deployments on PRs.

### Files
| File | Purpose |
|------|---------|
| `vercel.json` | Region (fra1), security headers |
| `.env.production.template` | Template for Vercel env vars |

---

## TODOs

### High Priority
- [ ] **Playwright E2E tests**: Full user journey (Landing → Login → Onboarding → Feed → Paper → Settings) — scaffolded but minimal coverage
- [ ] **Responsive Playwright tests**: Test at 375px, 768px, 1280px breakpoints
- [ ] **Dark mode Playwright test**: Toggle theme → verify visual switch
- [ ] **Accessibility**: axe-playwright tests for WCAG compliance

### Medium Priority
- [ ] **Bookmark UI integration**: Wire up the bookmark toggle button on paper detail page to the backend API (hook exists: `useToggleBookmark`)
- [ ] **Search functionality**: The feed store has `searchQuery` state but no search UI or API integration yet
- [ ] **Error boundary integration**: `error-boundary.tsx` component exists but may not be wired into all routes
- [ ] **Loading states**: Paper detail page could benefit from skeleton loading states
- [ ] **Facebook + Apple OAuth buttons**: Currently only Google OAuth is implemented

### Low Priority
- [ ] **Vitest coverage**: Configure c8 coverage reporter and target 80%+
- [ ] **SEO**: Open Graph metadata for paper detail pages
- [ ] **Performance**: Core Web Vitals assertions in Playwright (LCP < 2.5s, CLS < 0.1)
- [ ] **PWA**: Service worker for offline reading of previously loaded summaries
- [ ] **Animations**: Page transition animations, tile hover effects
- [ ] **Sentry**: Frontend error tracking integration

### Code TODOs (grep for `// TODO` in codebase)
- Search codebase for any inline `// TODO` comments for additional items
