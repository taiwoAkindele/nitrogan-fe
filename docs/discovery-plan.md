# Discovery → Review — Frontend Plan (Doro-FE)

> Frontend half of the "Discovery vertical slice on real data" feature. The backend
> half lives in `Doro-BE/docs/discovery-plan.md`. The **API contract** section below
> is shared between the two and must stay in sync.

## Context

Nitrogan's loop is **Discover → Review → Act** (see `PRODUCT_BRIEF.md` §1). The three
surfaces currently read from `src/features/**/utils/mock-data.ts`. This feature wires
the first vertical slice — **Discover → save segment → Inbox shows real prospects**
(Brief §6.2) — onto a real backend over real company data (People Data Labs free
dataset).

What's real now: **firmographic** matching (industry, geography, company size), segment
persistence, materializing prospects into the inbox, a transparent **ICP-fit score**.
**Technographics + intent triggers stay in the builder but are best-effort** (the
predictor's tech/intent narrowing remains an estimate) until the backend enrichment
layer lands — so we keep honest copy (no "intent" claim yet; Brief §2.4).

**Outcome:** build an ICP → live real reach + sample → Save → Run Discovery → land in
the Sales Inbox with real, scored prospects you can triage and rate.

## Established stack to reuse (do not reinvent)

- **axios client** `src/lib/api/client.ts` — bearer auth, single-flight 401
  refresh-and-retry, **envelope unwrap**, and **central toasts on mutations only**
  (success message + error). Use the `api` instance; don't add per-component toasts.
- **Query keys** `src/lib/query/keys.ts` (extend with `segments`, `discovery`,
  `prospects`). React Query patterns per existing `features/auth` + `features/settings`.
- **Feature-module layout** (`features/<domain>/{api,hooks,types,components}`), `@/`
  alias, `components/ui` primitives, `useWorkspace()` for the active org slug.
- **UI states are mandatory** (CLAUDE.md): every async surface handles
  loading / error / empty (reuse `components/ui/empty-state.tsx`).

## Work — Discovery (`features/strategy`)

- `features/strategy/api.ts` + `hooks.ts`:
  - `useDiscoveryOptions()` — builder reference data (replaces `utils/mock-data.ts`
    catalogs).
  - `useDiscoveryPreview(state)` — **debounced** on builder state → real reach + sample.
  - segments CRUD hooks; `useRunDiscovery()`.
- **Predictor + sample preview** (`predictor-panel.tsx`, `sample-preview-table.tsx`)
  read from `discovery/preview`. Keep `utils/prediction.ts` only as the instant
  optimistic estimate shown while the debounced server count resolves; add
  loading/error/empty states.
- **Save / resume segments** (`lead-builder.tsx`): wire the currently-dead
  **"Save as Draft"** → create/update a segment, auto-named via the existing
  `utils/icp-summary.ts` `buildIcpSummary()`. On open, load the latest segment and
  hydrate `useLeadBuilderState` (initial state from server; show a loading state while
  it resolves). Saving an already-loaded segment updates it (PATCH) rather than
  creating duplicates.
- **New primary action "Run Discovery"** → `discovery/run`, central toast ("142
  prospects added"), then route to the Sales Inbox. **"Create Campaign"** keeps the
  Discover→Act seam (Brief §2.3) but now passes the real `segmentId`.

## Work — Sales Inbox (`features/leads`)

- `features/leads/api.ts` + `hooks.ts`: list (status/search/sort/**paginated** via
  envelope `meta`), detail, status change (optimistic), feedback.
- Replace fixtures in the inbox components; the existing toolbar (search/sort/intent
  filter) and bulk actions map onto query params + the status mutation. Add
  loading/error/empty states (Brief §3). The lead-quality thumbs (Brief §2.5) call the
  feedback endpoint.

## End-to-end flow

1. Discovery opens → `discovery/options` fills the builder; latest segment hydrates it.
2. Edit ICP → debounced `discovery/preview` → live real reach + sample.
3. **Save** → segment persisted.
4. **Run Discovery** → prospects materialized → redirect to Sales Inbox.
5. **Review** → triage (status) + rate (feedback), both persisted.

## Shared API contract (keep in sync with the BE doc)

Responses are the standard envelope; the axios client unwraps `data` and toasts
`message` on mutations. All routes `/api/v1`.

| Method | Path | Body / query | Returns |
|---|---|---|---|
| GET | `/org/:slug/discovery/options` | — | `{ industries[], geographies[], techCatalog[], intentTriggers[] }` |
| POST | `/org/:slug/discovery/preview` | ICP or `{ segmentId }` | `{ reach, leadsPerWeek, confidence, sample[], distribution }` |
| POST | `/org/:slug/discovery/run` | `{ segmentId }` | `{ matched, added }` |
| GET/POST | `/org/:slug/segments` (+ `/:id` GET/PATCH/DELETE) | `SegmentInput` | `Segment` |
| GET | `/org/:slug/prospects` | `?status&search&sort&page&pageSize` | `Prospect[]` + `meta` |
| GET | `/org/:slug/prospects/:id` | — | `ProspectDetail` |
| PATCH | `/org/:slug/prospects/:id/status` | `{ status }` | `Prospect` |
| POST | `/org/:slug/prospects/:id/feedback` | `{ verdict }` | `{ ok: true }` |

`SegmentInput = { name, industries[], geographies[], companySizeMin, companySizeMax,
techIds[], intentTriggers: Record<string,boolean> }`. Mirror response types in
`features/*/types.ts`.

## Frontend milestones

- **M1** — Discovery on real data: `options` + debounced `preview` predictor/sample;
  save/resume segments.
- **M2** — "Run Discovery" + Sales Inbox on real prospects (list/detail/status/feedback).
- **M3/M4** — surface real signals + the "why this lead" drivers once BE enrichment +
  feedback→scoring land.

## Verification

- Build an ICP → see **real** reach/sample → Save → Run → land in the Inbox with real,
  scored prospects; triage + rate persist.
- Loading/error/empty states render on slow/failed/empty queries.
- `npx tsc --noEmit` + `npm run lint` clean.
