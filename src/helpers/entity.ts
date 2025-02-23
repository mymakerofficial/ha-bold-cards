export function computeDomain(entityId: string) {
  return entityId.substring(0, entityId.indexOf("."));
}
