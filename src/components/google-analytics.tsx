import Script from "next/script";

function normalizeMeasurementId(value?: string) {
  const measurementId = value?.trim().toUpperCase();
  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return undefined;

  return measurementId;
}

export function GoogleAnalytics() {
  const measurementId = normalizeMeasurementId(
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  );
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
