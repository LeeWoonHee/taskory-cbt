export function normalizeAdSenseClientId(value?: string) {
  const clientId = value?.trim();
  if (!clientId) return undefined;

  return clientId.startsWith("pub-") ? `ca-${clientId}` : clientId;
}

export function normalizeAdSensePublisherId(value?: string) {
  const publisherId = value?.trim();
  if (!publisherId) return undefined;

  const normalized = publisherId.startsWith("ca-")
    ? publisherId.slice(3)
    : publisherId;

  return /^pub-\d+$/.test(normalized) ? normalized : undefined;
}
