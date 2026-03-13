export const prospectKeys = {
  all: (tenantId: string) => ["prospects", tenantId] as const,
  lists: (tenantId: string) => [...prospectKeys.all(tenantId), "list"] as const,
  list: (tenantId: string, filters: Record<string, unknown>) =>
    [...prospectKeys.lists(tenantId), filters] as const,
  infinite: (tenantId: string, filters: Record<string, unknown>) =>
    [...prospectKeys.lists(tenantId), "infinite", filters] as const,
  details: (tenantId: string) =>
    [...prospectKeys.all(tenantId), "detail"] as const,
  detail: (tenantId: string, id: string) =>
    [...prospectKeys.details(tenantId), id] as const,
  stats: (tenantId: string) =>
    [...prospectKeys.all(tenantId), "stats"] as const,
};
