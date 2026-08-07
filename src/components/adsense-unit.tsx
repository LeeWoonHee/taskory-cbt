"use client";

import { useEffect, useRef } from "react";

import { normalizeAdSenseClientId } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSenseUnit({ slotId, label = "광고" }: { slotId?: string; label?: string }) {
  const adRef = useRef<HTMLModElement>(null);
  const clientId = normalizeAdSenseClientId(
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  );
  const normalizedSlotId = slotId?.trim();

  useEffect(() => {
    if (!clientId || !normalizedSlotId || !adRef.current || adRef.current.dataset.adsbygoogleStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adRef.current.dataset.adsbygoogleStatus = "initialized";
    } catch (error) {
      console.error("[adsense] failed to initialize ad unit", error);
    }
  }, [clientId, normalizedSlotId]);

  if (!clientId || !normalizedSlotId) return null;
  return <aside aria-label={label} className="flex min-h-[100px] items-center justify-center overflow-hidden rounded-2xl bg-[#fafbfc]"><ins ref={adRef} className="adsbygoogle block min-h-[100px] w-full" style={{ display: "block" }} data-ad-client={clientId} data-ad-slot={normalizedSlotId} data-ad-format="auto" data-full-width-responsive="true" /></aside>;
}
