import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { listPublishedExamsForSitemap } from "@/services/catalog-service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let publishedExams: Array<{ id: string; publishedAt: Date | null; createdAt: Date }> = [];
  try {
    publishedExams = await listPublishedExamsForSitemap();
  } catch {
    /* DB가 준비되지 않은 환경에서도 기본 sitemap은 제공 */
  }

  const staticPaths = [
    { path: "/", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/exams", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/feedback", changeFrequency: "monthly" as const, priority: 0.4 },
    { path: "/terms", changeFrequency: "monthly" as const, priority: 0.3 },
    { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.3 },
    { path: "/copyright", changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  return [
    ...staticPaths.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency,
      priority,
    })),
    ...publishedExams.map((exam) => ({
      url: `${SITE_URL}/exams/${exam.id}`,
      lastModified: exam.publishedAt ?? exam.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
