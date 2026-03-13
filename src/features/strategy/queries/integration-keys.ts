export const integrationKeys = {
  all: (tenantId: string) => ["integrations", tenantId] as const,
  lists: (tenantId: string) =>
    [...integrationKeys.all(tenantId), "list"] as const,
  detail: (tenantId: string, id: string) =>
    [...integrationKeys.all(tenantId), "detail", id] as const,
};
