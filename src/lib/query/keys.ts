/**
 * Central React Query key factory. Co-locating keys keeps invalidation honest:
 * mutations invalidate by the same builders the queries are registered with.
 */
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  org: {
    bySlug: (slug: string) => ["org", slug] as const,
  },
  members: {
    all: (slug: string) => ["org", slug, "members"] as const,
    seats: (slug: string) => ["org", slug, "members", "seats"] as const,
  },
  segments: {
    all: (slug: string) => ["org", slug, "segments"] as const,
    latest: (slug: string) => ["org", slug, "segments", "latest"] as const,
    detail: (slug: string, id: string) =>
      ["org", slug, "segments", id] as const,
  },
  discovery: {
    options: (slug: string) => ["org", slug, "discovery", "options"] as const,
    // The ICP object is hashed deterministically by React Query, so previews
    // cache per distinct audience.
    preview: (slug: string, icp: unknown) =>
      ["org", slug, "discovery", "preview", icp] as const,
  },
  prospects: {
    list: (slug: string, params: unknown) =>
      ["org", slug, "prospects", params] as const,
    detail: (slug: string, id: string) =>
      ["org", slug, "prospects", id] as const,
  },
} as const;
