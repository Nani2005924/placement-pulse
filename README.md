# SVCE Placement Intelligence Hub

**College:** Sri Venkateswara College of Engineering (SVCE)
**Phase:** 1 — UI only

## What this is

A mobile-first portal for SVCE students to research recruiting companies
(22 intelligence sections per company) and the skills required to crack each
(12 skills, each with a 10-level roadmap).

## Phase 1 constraints

- **No backend.** No database, no Lovable Cloud / Supabase, no auth.
- All data comes from `src/data/seedCompanies.ts` (one full record for Accenture).
- The portal is **fully public** — every route is reachable without login.
- There is **no college logo asset** anywhere in `public/` or in code.
- **CTC, stipend, and selection ratio are never shown.**

## Routes

- `/` — searchable company grid with category filter pills.
- `/company` → redirects to `/company/intelligence`.
- `/company/intelligence` — sticky info bar + 22 tabbed sections with scroll-spy.
- `/company/skills` — Bloom + criticality legend and 12 expandable skill cards.

Selected company persists in `localStorage` (`selected-company`) so refresh
keeps you on the same company.

## Stack notes

The original prompt asked for React Router 6 + Tailwind v3. This project is
scaffolded on **TanStack Start + Tailwind v4** (the Lovable modern stack), so
the routing and CSS layer were mapped onto those primitives. All other
requirements (seed data shape, sections, skill ladder, no-auth, etc.) are
implemented verbatim.

## Phase 2 (later)

The data layer in `src/lib/companyData.ts` exposes pure normalizers
(`normalizeCompanySummary`, `normalizeCompanyProfile`, `normalizeDashboardSkills`)
that accept the same JSON shapes as the future Supabase `short_json` and
`full_json` JSONB columns. Swapping seed → DB is a one-file change.

## Optional env

- `VITE_LOGO_DEV_PUBLISHABLE_KEY` — if set, `CompanyLogo` will try
  `img.logo.dev` first, then fall back to the seed `logo_url`, then to an
  initial-letter circle.