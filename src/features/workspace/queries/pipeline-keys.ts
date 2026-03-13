export const pipelineKeys = {
  all: (tenantId: string) => ["pipeline", tenantId] as const,
  lists: (tenantId: string) => [...pipelineKeys.all(tenantId), "list"] as const,
  list: (tenantId: string, filters: Record<string, unknown>) =>
    [...pipelineKeys.lists(tenantId), filters] as const,
  details: (tenantId: string) =>
    [...pipelineKeys.all(tenantId), "detail"] as const,
  detail: (tenantId: string, id: string) =>
    [...pipelineKeys.details(tenantId), id] as const,
  stages: (tenantId: string) =>
    [...pipelineKeys.all(tenantId), "stages"] as const,
};
