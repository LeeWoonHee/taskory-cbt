import { normalizeAdSensePublisherId } from "@/lib/adsense";

export function GET() {
  const publisherId = normalizeAdSensePublisherId(
    process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
  );

  if (!publisherId) {
    return new Response("AdSense publisher ID is not configured.\n", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
    {
      headers: {
        "cache-control": "public, max-age=3600",
        "content-type": "text/plain; charset=utf-8",
      },
    },
  );
}
