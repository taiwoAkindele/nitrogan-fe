export const analyticsKeys = {
  all: (tenantId: string) => ["analytics", tenantId] as const,
  overview: (tenantId: string) =>
    [...analyticsKeys.all(tenantId), "overview"] as const,
  trends: (tenantId: string, filters: Record<string, unknown>) =>
    [...analyticsKeys.all(tenantId), "trends", filters] as const,
};
