import type { MetadataRoute } from "next";

import { listPublishedExamIds } from "@/services/catalog-service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taskory-cbt.vercel.app";
  let examIds: string[] = [];
  try { examIds = await listPublishedExamIds(); } catch { /* DB가 준비되지 않은 환경에서도 기본 sitemap은 제공 */ }
  const staticPaths = ["/", "/exams", "/feedback", "/terms", "/privacy", "/copyright"];
  return [...staticPaths.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: path === "/" ? "daily" as const : "monthly" as const, priority: path === "/" ? 1 : 0.6 })), ...examIds.map((id) => ({ url: `${baseUrl}/exams/${id}`, changeFrequency: "monthly" as const, priority: 0.7 }))];
}
