export function tenantPath(tenantId: string, path: string = "") {
  return `/org/${tenantId}${path}`;
}
