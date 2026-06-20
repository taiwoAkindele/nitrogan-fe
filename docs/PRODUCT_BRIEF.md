# Product Brief — Nitrogan (working name)

> Status: Draft for review · Prepared as a PM review of the current front-end (`Doro-FE`)
> Last updated: 2026-06-20

This brief captures what the product is today, the strategic risks worth addressing
before launch, and a recommended sequence of work. It is based on a review of the
current codebase, which is a front-end shell running on mock data
(`src/features/**/utils/mock-data.ts`), with no backend wired in yet (the only
stateful interaction — prospect status changes in the Sales Inbox — has a
`// TODO: server call`).

---

## 1. What the product is

A **B2B sales-intelligence / lead-discovery platform**. The core product loop is
coherent and already reflected in the navigation (`src/components/layout/sidebar.tsx`):

**Discover → Review → Act**

| Stage | Surface | What it does |
| --- | --- | --- |
| **Discover** | Discovery / Lead Builder (`/strategy`) | Define an ICP (industries, geographies, company size, tech stack, intent triggers); see a real-time prediction of reachable high-intent leads and a sample preview. |
| **Review** | Sales Inbox (`/leads`) | Triage prospects across tabs (new / saved / active / archive); open a per-prospect intelligence panel with intent score, signals, personas, and firmographics. |
| **Act** | Campaigns (`/`, dashboard) | Deploy and monitor AI outreach "bots" with sent/reply/meeting metrics. |

The app is **multi-tenant** (`/org/[tenantId]`) and the design language is strong and
consistent.

---

## 2. Top issues (priority order)

### 2.1 Identity crisis — pick one name and a sharper category
**Resolved (2026-06-20):** canonical brand is **Nitrogan**; legal entity is
**Nitrogan Inc.** The UI already used "Nitrogan" consistently, so the fix was to align
the supporting files: README title, standardized all footers to "© 2026 Nitrogan Inc.",
and removed a stray product self-reference from mock prospect data. One manual step
remains: the working folder is still `Doro-FE` and `package.json` is `nitrogan-fe` —
rename the directory/package if you want the filesystem to match the brand (left alone
to avoid breaking the active workspace path).

Original finding: three names were in play — `Doro` (folder), `nitrogan-fe`
(`package.json`), and `Nitrogan` (UI copy). Deciding early is cheap; after launch it is
expensive (URLs, email domains, CRM integration naming, SEO).

Strategically, "B2B discovery engine" is a crowded category (ZoomInfo, Apollo, Clay,
Clearbit). The differentiated wedge already present in the product copy is **market
signals → pre-written outreach context** ("decode signals before competitors know they
exist"). **Lead with timing/intent, not data.** Data is a commodity; signal-driven
timing is a wedge.

### 2.2 The "Act" step is a black box — and the riskiest claim
Campaigns are framed as autonomous "AI bots" sending outreach at "high velocity / at
scale." This is the part buyers are most nervous about (deliverability, sending-domain
reputation, anti-spam law, brand risk).

**Recommendation:** for v1, reposition bots as *assisted* (human-in-the-loop), not
*autonomous*. Safer and easier to sell to sales leaders who fear a bot harming their
domain reputation.

**v1 assisted slice — shipped (2026-06-20, mock data):** the black box is now a
human-in-the-loop tool. Implemented:
- `Campaign` model gained a `draft` status, an `approvalMode` (`manual` default /
  `auto`), and a `pendingApproval` count; new `SequenceStep` / `PendingMessage` /
  `CampaignDetail` types.
- A campaign **detail view** (`/org/[tenantId]/campaigns/[campaignId]`) wiring up the
  previously-dead card click. Organized by cadence into two tabs (design review found a
  single stacked page buried the daily work under set-once config):
  - **Review** (default) — the **Pending review** queue (per-message approve/skip plus
    Approve-all), with an **undo** affordance instead of a blocking confirm. In
    auto-send mode it shows an explainer rather than an empty list.
  - **Setup** — **Sending mode** (approval toggle, manual = recommended/default) paired
    with the **Safety & compliance** guardrails (opt-out, suppression, send caps), then
    the read-only **Sequence** template.
- Dashboard now has a **Draft** tab; cards show a "Review (N)" affordance when messages
  await approval.

Still open (needs a backend, out of scope for the mock slice): sequence/step *editor*
(currently read-only), real sending-domain/mailbox configuration and throttling, and
wiring approve/skip + mode changes to a server.

### 2.3 The loop has a missing seam: Discover → Act is disconnected
"Launch Campaign" in the Lead Builder (`lead-builder.tsx`) and "Create New Bot" in
Campaigns (`campaign-dashboard.tsx`) were separate dead-end entry points. A user who
carefully built an audience could not flow **directly** into a campaign seeded with that
audience.

**Resolved (2026-06-20, mock data):** the seam is now wired in both directions.
- **Discover → Act:** the Lead Builder CTA (renamed "Create Campaign →") collapses the
  ICP builder state into a summary (`strategy/utils/icp-summary.ts`) and routes to
  `/org/[tenantId]/campaigns/new?icp=…`, which seeds a **draft** campaign
  (`buildDraftCampaign`) pre-filled with that audience + the default sequence, landing on
  the **Setup** tab to finish and launch.
- **Act → Discover:** "Create New Bot" and the "New Automation" card now route to
  Discovery — enforcing audience-first (you can't make a bot without defining who it
  targets).
- Drafts open on the **Setup** tab; live campaigns open on **Review**.

Still open (needs a backend): the seeded ICP is passed as a display string only — the
real audience/segment isn't persisted or attached to the campaign as queryable
targeting, and "new" is a placeholder id rather than a created record.

### 2.4 Predictions and trust signals are hard-coded
"~45 high-intent leads/week," "Peak Performance," "Confidence 94%,"
"Trusted by 500+ teams," and "Updated 2m ago" were all static.
- **Credibility:** sophisticated buyers will test these; a confidence score that never
  moves erodes trust quickly.
- **Factual-claim risk:** "Trusted by 500+ sales teams globally"
  (`HeroSection.tsx`) is a concrete claim. If untrue at launch, replace with neutral /
  aspirational copy until it is real.

**Resolved (2026-06-20, mock data):**
- **Predictor is now reactive.** `strategy/utils/prediction.ts` derives reach,
  confidence, velocity, leads/week, and the optimization label from the ICP builder
  state (`computePrediction`, recomputed via `useMemo`). The model encodes the real
  trade-off — broader targeting raises reach; each tech/intent requirement narrows reach
  but raises confidence. The hard-coded "~45/week" literal and frozen `MOCK_PREDICTION`
  are gone, so the "Real-time Prediction" label is now earned.
- **Public claim de-risked.** "Trusted by 500+ sales teams globally" → "Built for modern
  B2B sales teams"; the builder footer's fake "Updated 2m ago" → "Live estimate".

Left as mock (clearly account data a backend will populate, not public claims): the
dashboard network stats and the intent-score trend bars.

### 2.5 No measurement of the thing being sold: outcomes
The product sells **meetings booked / pipeline**. The dashboard shows sent/replies/
meetings per bot, but there was no **lead-quality feedback** (did discovered leads
convert?) and no way for a rep to mark a lead good/bad. That feedback loop is what makes
"predictive scoring" real over time — and it is the **moat**.

**Resolved (2026-06-20, mock data):** the rating mechanism now exists. A
**LeadQualityCard** sits directly under the Intent Score in the prospect intelligence
panel ("We scored it 94/100 — was this a good lead?"), with thumbs-up / thumbs-down
("Good fit" / "Not a fit"). Rating sets `feedback` on the prospect (optimistic update in
`SalesInbox`, clicking the active rating clears it), and confirms the signal tunes the
intent model. A new `LeadFeedback` type carries the verdict.

Still open (needs a backend): persisting the rating (`// TODO` at the handler) and
actually feeding it into the scoring model; optionally surfacing a rated indicator in the
prospect list and an account-level conversion view.

---

## 3. Smaller, high-leverage gaps

- **Empty / loading / error states.** With real data these become ~80% of perceived
  quality. An `empty-state` component exists (`src/components/ui/empty-state.tsx`).
  **Empty states done (2026-06-20):** inbox tabs and the approval queue already had
  them; added empty states to the **Sample Preview** (and wired it to the live
  prediction — no industries/regions selected → empty sample, not a headerless table)
  and the **campaign dashboard** grid (empty filter tab now shows a message instead of
  only the create card). **Loading / error states still open** — they need a real data
  layer to be meaningful (everything is currently synchronous mock data); add them when
  the React Query fetch hooks land.
- **Sales Inbox lacks search / sort / bulk actions.** Reps live in this view; it would
  not scale past ~50 prospects. **Done (2026-06-20):** added a toolbar to the prospect
  list — search (company/industry), sort (highest intent / most signals / company A–Z),
  and an intent filter (All/High/Medium/Low), all via a themed `DropdownMenu` (native
  `<select>` popups were unstyleable). Added **bulk actions**: per-row checkboxes +
  select-all, with a selection bar to bulk-move (Save / Active / Archive) wired through
  `SalesInbox` (`handleBulkStatusChange`, optimistic, `// TODO` server). Selection clears
  on tab change. *Recency sort / signal-type filter deferred — the prospect model has no
  sortable timestamp or first-class signal-type facet yet.*
- **No "why this lead" explainability.** Signals and an intent score were shown, but not
  which signals drove the score. **Done (2026-06-20):** each `Signal` now carries a
  `scoreContribution` and an `outreachAngle`. A new **WhyThisLeadCard** (under the intent
  score) attributes the score to its ranked drivers (with contribution bars) and surfaces
  the top driver as a ready-to-use **suggested outreach angle** — the bridge to
  pre-written context. The `SignalList` also shows a "+N intent" badge per signal.
  *Still open: the angle is display-only — wiring "use this" into the email composer
  needs the outreach/compose surface.*
- **Settings is a dead icon** in the sidebar. **Done (2026-06-20):** scaffolded a
  `settings` feature + route (`/org/[tenantId]/settings`) and wired the sidebar gear to
  it. Three tabbed sections: **Team & Seats** (member list, seat usage, invite),
  **Integrations** (Salesforce / HubSpot / Outreach connect cards with status — also the
  home for the CRM gap below), and **Sending** (mailbox, domain-verification status,
  daily send cap — the home for issue 2's deferred deliverability config). Structure is
  real; the actions are stubs pending a backend.
- **CRM integration is a headline feature** (Salesforce / HubSpot / Outreach,
  `FeaturesSection.tsx`) but was absent from the app. **Done (2026-06-20):** the
  Settings → Integrations section now connects/disconnects each provider (mock state,
  connected providers show a live status dot), and the prospect header's previously-dead
  **"Sync to CRM"** button now works — clicking it flips to "Synced to CRM ✓" per
  prospect (resets when you switch leads). Sets the buyer expectation at both the config
  home and the per-lead action. *Still open (backend): real OAuth connect flow and an
  actual sync to the connected CRM (`// TODO`s mark both call sites).*

---

## 4. Responsive design plan (planned — not yet built)

The landing page handles `lg:` breakpoints; the **app shell behind login has no
responsive handling**. The app is desktop-first and multi-pane, so the work is graceful
collapse, not a mobile-first rewrite.

**Breakpoint bands & intent** (Tailwind defaults):
- **Small** (`< md`, phones) — *review-on-the-go only* (decided 2026-06-20): read inbox,
  check campaigns, approve messages, sync a lead. Not deep ICP-building.
- **Medium** (`md–lg`, tablets/small laptops) — fully usable, denser/stacked.
- **Large** (`≥ lg`, desktop) — current design, unchanged.

**Four layouts assume a wide viewport** (the real risk):
- App shell (`org/[tenantId]/layout.tsx`): fixed `w-64` sidebar, no drawer; topbar `w-96`
  search overflows.
- Sales Inbox: `w-[400px]` list + flex detail, detail internally `grid-cols-12` (8/4).
- Lead Builder: `w-[420px]` config + flex predictor, both `h-full`.
- Intelligence header: 3 action buttons + meta row cramp on narrow.
- (Campaign dashboard, campaign detail, Settings are mostly fine — responsive grids /
  `md:flex-row` already.)

**Planned behavior:**
- **Nav shell (P0) — DONE (2026-06-21):** new `AppShell` orchestrates the chrome.
  Sidebar → persistent full (lg) / 64px icon rail (md) / off-canvas drawer (sm, via
  topbar hamburger); **bottom tab bar on small** for the 3 primary destinations; topbar
  gains the hamburger, search flexes/shrinks (kept as a shrinking input rather than an
  icon toggle — avoids dead UI), and "New Discovery" → icon-only on small. Large screens
  unchanged.
- **Sales Inbox (P0):** lg side-by-side → md narrow list + detail sub-grid stacks → sm
  **one-view-at-a-time** (list, tap pushes full-screen detail with back; reuses
  `selectedProspectId`).
- **Lead Builder (P1):** md/sm single scroll column, sticky footer action bar; on sm lead
  with the prediction and put filters behind an "Edit audience" sheet.
- **Intelligence header + sub-grid (P1):** buttons wrap→stack; `grid-cols-12` → single
  column below lg.
- **P2:** Settings/campaign-detail `sm:grid-cols-2` → 1 col; Sample Preview table scrolls
  horizontally on small.
- **Touch:** 44px min targets (bulk-select checkboxes, tab hit areas); tap replaces hover.

**Rollout:** P0 nav shell → P0 Sales Inbox → P1 Lead Builder → P1 header/sub-grid →
P2 minor stacking. Verify at 375 / 768 / 1280px.

---

## 5. Decision: tenancy model

**Decided (2026-06-21).** The product is **tenant / workspace-based**: each customer is
one isolated organization. An **admin invites reps**, who work in the shared workspace
with roles. All shared resources (campaigns, prospect inbox, ICP library, CRM
connection, sending domains, seats/billing) belong to the org, not the individual.

**No org switcher / multi-org-per-user flow for now.** This is *not* Slack-style
workspace switching. A rep belongs to **one org at a time**; a job change is a re-invite
(+ deactivation), not a toggle. Building a switcher today would be dead weight.

**Flexibility as insurance, not a built flow.** The *only* case that needs one person
across multiple orgs is **agencies / outsourced SDR shops** running outbound for several
clients. That is not a current target, so the multi-org UX is **not built**. The hedge is
purely at the data layer: model the user↔org link as a **many-to-many membership** (join
table) rather than a single `user.organization_id`, so agencies can be enabled later
**without a migration**. No switcher, no multi-org screens — just a schema shape that
won't need repainting. Build the actual flow only when an agency segment demands it.

**Naming / routing notes:** user-facing term is **"Workspace" / "Organization,"** never
"tenant" (architecture word). Prefer a human **slug** over the raw `tenantId` in URLs
(current routing is `/org/[tenantId]`).

---

## 6. Recommended sequence

1. **Lock branding + positioning** (~1 day; unblocks everything downstream).
2. **Wire one vertical slice to a real backend** — Discovery → save segment → Inbox
   shows real prospects. Proves the architecture and removes the "demo-ware" risk.
3. **Connect Discover → Act** so a built audience seeds a campaign (closes the missing
   seam in §2.3).
4. **Add human-in-the-loop approval to bots** before any real sending (§2.2).
5. **Add a lead-quality feedback control** in the Sales Inbox to start collecting the
   data the scoring model needs (§2.5).

---

## 7. Open questions

- What is the canonical product name and primary domain?
- Is outreach sending in-scope for v1, or is the wedge discovery + CRM sync only?
- Which CRM is the launch integration priority?
- What is the real data source for signals, and what freshness can we honestly claim?
- Single-rep self-serve or team/enterprise as the initial GTM motion?
