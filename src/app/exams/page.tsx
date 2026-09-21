import type { Metadata } from "next";

import { ExamCatalogExplorer } from "@/components/exam-catalog-explorer";
import { ExamSearch } from "@/components/exam-search";
import { AdSenseUnit } from "@/components/adsense-unit";
import { SITE_URL } from "@/lib/site";
import { listExamCatalog } from "@/services/catalog-service";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q = "" } = await searchParams;
  const title = q
    ? `“${q}” 기출문제 검색 결과 | taskory CBT`
    : "자격증 CBT 기출문제 전체 목록 | taskory CBT";
  const description = q
    ? `“${q}” 관련 자격증 시험 기출문제를 무료 CBT 모의고사로 풀고 채점해 보세요.`
    : "지게차운전기능사, 컴퓨터활용능력, 산업안전기사 등 전체 자격시험 기출문제를 연도별·회차별로 확인하고 무료로 응시하세요.";

  return {
    title,
    description,
    keywords: [
      "자격증 기출문제",
      "CBT 시험",
      "지게차운전기능사 기출문제",
      "지게차 기출문제",
      "무료 CBT",
      "자격증 모의고사",
    ],
    alternates: {
      canonical: "/exams",
    },
    robots: q ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/exams`,
      type: "website",
    },
  };
}

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const series = await listExamCatalog(q);
  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "기출문제 목록",
        item: `${SITE_URL}/exams`,
      },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <main className="flex-1 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <div className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8 lg:py-20">
        <section className="flex flex-col justify-between gap-8 rounded-[28px] border border-[#dfe3e8] bg-[#f7f8fa] p-7 sm:p-10 lg:flex-row lg:items-end lg:p-12">
          <div>
            <p className="text-sm font-bold text-[#2563eb]">시험 아카이브</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#20242a] sm:text-4xl">
              {q ? `“${q}” 기출문제 검색` : "자격증 CBT 기출문제 목록"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#737a84]">
              원하는 시험을 선택하고 실제 CBT 환경처럼 무료로 문제를 풀어보세요.
            </p>
          </div>

          <ExamSearch initialQuery={q} />
        </section>
        <div className="mt-8">
          <AdSenseUnit slotId={process.env.NEXT_PUBLIC_ADSENSE_EXAMS_SLOT_ID} label="시험 목록 광고" />
        </div>
        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#20242a]">
            {q ? `“${q}” 검색 결과` : "전체 시험"}
          </h2>
          <p className="text-sm text-[#8a9099]">{series.length}개 자격증</p>
        </div>
        {series.length ? (
          <div className="mt-5">
            <ExamCatalogExplorer series={series} />
          </div>
        ) : (
          <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-[#e1e4e8] bg-[#fafbfc] text-center">
            <p className="font-bold text-[#343a42]">{q ? "검색 결과가 없습니다." : "현재 등록된 시험이 없습니다."}</p>
            <p className="mt-2 text-sm text-[#8a9099]">{q ? "다른 시험명, 급수 또는 연도로 검색해 보세요." : "관리자가 시험을 등록하면 이곳에서 확인할 수 있습니다."}</p>
          </div>
        )}
      </div>
    </main>
  );
}
