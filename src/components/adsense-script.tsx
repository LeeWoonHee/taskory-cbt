import { normalizeAdSenseClientId } from "@/lib/adsense";

export function AdSenseScript() {
  const clientId = normalizeAdSenseClientId(
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  );
  if (!clientId) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`}
      crossOrigin="anonymous"
    />
  );
}
