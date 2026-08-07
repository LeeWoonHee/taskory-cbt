import Script from "next/script";

import { normalizeAdSenseClientId } from "@/lib/adsense";

export function AdSenseScript() {
  const clientId = normalizeAdSenseClientId(
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  );
  if (!clientId) return null;

  return <Script async strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`} crossOrigin="anonymous" />;
}
