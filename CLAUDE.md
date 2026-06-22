# Nitrogan Frontend — Working Rules

Next.js 16 (App Router, React 19) + TypeScript for a B2B sales-intelligence SaaS.
Path-based multi-tenancy (`/org/:slug`), TanStack Query for server state, axios
for the API layer, React Hook Form + Yup for forms, Tailwind v4 for styling.
**`ARCHITECTURE.md` is the source of truth for structure and design** — read it
before non-trivial work and keep it updated when the implementation changes.

Follow the established patterns in the codebase over generic habits; when in
doubt, match the nearest existing feature module.

---

## Commands

```bash
npm run dev            # next dev
npm run build          # next build
npm run lint           # eslint
npx tsc --noEmit       # typecheck (no dedicated script) — run before done
```

Run `npx tsc --noEmit` and `npm run lint` after changes.

---

## Hard stops — never do these without explicit approval

- **Secrets / env files.** Never read, display, search, summarize, or modify:
  `.env`, `.env.*` (including `.env.local`), `*.pem`, `*.key`, `secrets/*`,
  `credentials/*`. If a config value is needed, ask the user to add it.
  Note: `NEXT_PUBLIC_*` vars are public-by-design (shipped to the browser) — never
  put real secrets behind that prefix.
- **Dependencies.** Do not install new packages. The dependency list is kept lean
  (a package is added only when code imports it). Prefer existing libraries; if a
  new one seems necessary, propose it and wait for approval.
- **Sensitive files.** Ask before modifying `package.json`, `package-lock.json`,
  `tsconfig*.json`, `next.config.ts`, `middleware.ts`, `components.json`,
  `.github/*`.
- **Git.** Never push to `main`. Never create commits unless explicitly asked
  (branching is fine — see Workflow). Do **not** add `Co-Authored-By` or any
  AI/assistant attribution trailer to commit messages.

---

## Code organization & conventions

- **Routes are thin shells.** `app/` holds route files only; all domain logic
  lives in `features/<domain>/` (`components/`, `types/`, `utils/`, `hooks/`),
  exposed through each feature's barrel `index.ts`. Compose features in pages.
- **Server state via TanStack Query.** Data fetching goes through hooks in
  `features/*/hooks.ts` calling `features/*/api.ts`; never fetch ad hoc in
  components. Register queries with the key factory in `src/lib/query/keys.ts`
  and invalidate by the same builders.
- **API layer via the shared axios client** (`src/lib/api/client.ts`): attaches
  the bearer token, runs the single-flight 401 refresh-and-retry, normalizes
  errors to `ApiError`, and unwraps the `{ success, data }` envelope so callers
  get the raw payload. Use this `api` instance — do not create new axios
  instances or call `fetch` directly.
- **Shared UI primitives** live in `src/components/ui` (CVA-variant components);
  status/colour mappings belong in those variants, not in data/fixtures. Reuse
  them before writing new markup.
- **Forms** use React Hook Form + Yup (`@hookform/resolvers`); schemas in
  `src/lib/validations/`.
- Respect the **server/client component** boundary — add `"use client"` only when
  a component needs hooks/state/effects; keep route shells server components.
- Use the `@/` path alias for `src/` imports.

---

## API response contract

The backend wraps every success as `{ success, data, message, meta? }` and every
error as `{ success: false, statusCode, message, errors?, path, timestamp }`.
The axios client (`src/lib/api/client.ts`) unwraps success centrally, so feature
code works with the plain payload. This unwrap is the **single** client-side place
the envelope is known — if the backend envelope changes, edit only that file.

## Toasts — actions only, never reads

Every response carries a human-readable `message`. It is toasted (sonner)
**only when the user performs an action** — i.e. on **mutations** (create / update /
delete / login / etc.), never on queries or page/list loads.

- This is wired **centrally** in the axios client (`src/lib/api/client.ts`), not
  per-component: the response interceptor toasts the envelope `message` on success
  and the `ApiError` message on failure, but **only for non-GET requests** (GET =
  read → never toasted). It is the single choke point — do not add per-component
  success/error toasts (they would double up).
- Opt a single call out with `{ skipToast: true }` in its axios request config
  (e.g. when a custom inline message is better).
- Query/read failures are **not** toasted — they render inline error states (below).
  The session-expiry redirect also does not toast.
- `<Toaster />` is already mounted in `app/layout.tsx`.

## UI states — loading, error, empty

Every async surface must handle all of its states; never render only the happy path.

- **Buttons / actions:** disable + show a pending indicator while a mutation runs
  (`isPending`); re-enable on settle. Never allow double-submit.
- **Tables / lists:** show a skeleton or loading row while fetching, an inline
  error row with a retry affordance on failure, and the shared `empty-state`
  component when there are no rows.
- **Screens / panels:** handle `isLoading` (skeleton/spinner), `isError`
  (inline message, not a toast), and empty results distinctly.
- Prefer the shared primitives in `src/components/ui` (`empty-state`, etc.) and
  React Query's `isPending` / `isError` / `isLoading` flags over ad-hoc booleans.

---

## TypeScript

- Strict typing. Avoid `any` and unnecessary type assertions. Prefer interfaces
  and explicit types. Mirror backend response contracts in
  `features/*/types.ts`.

---

## Workflow — feature-based, never lumped together

Keep every change scoped to a single concern. **Do not bundle unrelated
features, fixes, or refactors into one change set, branch, or commit.**

**Before implementing:**
1. Explain the proposed approach.
2. Identify affected files/features.
3. Highlight potential breaking changes.
4. Work on a dedicated feature branch — one branch per feature/fix, never mixed.

**After implementing:**
1. Summarize the changes.
2. List modified files.
3. Mention any follow-up work.

---

## Developer experience & onboarding

Optimize for a developer becoming productive quickly:
- A fresh clone should run from documented steps in `README.md` — keep setup, env
  (`NEXT_PUBLIC_API_URL`), and run commands accurate.
- Build with refactoring in mind: centralize cross-cutting behavior (API client,
  query keys, UI primitives, validation) so a change is one edit, not a sweep
  across files. The axios envelope-unwrap is the reference example.
- Keep features predictable and consistent so patterns transfer between domains;
  a new feature should look like the existing ones (`leads`, `campaigns`,
  `strategy`, `settings`).
- Favor clear names, small components, and reuse of `components/ui` over
  bespoke markup. Update `ARCHITECTURE.md` when structure changes.

---

## Standards

- Follow Single Responsibility Principle; create reusable components where it
  removes duplication. Treat ~300 lines as a smell prompting a split, not a hard
  cap. Comment non-obvious logic with the *why*.
