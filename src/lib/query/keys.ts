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
} as const;
