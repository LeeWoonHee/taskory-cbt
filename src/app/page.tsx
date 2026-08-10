import Link from "next/link";
import type { Metadata } from "next";

import { ExamCatalogExplorer } from "@/components/exam-catalog-explorer";
import { SearchHero } from "@/components/search-hero";
import { AdSenseUnit } from "@/components/adsense-unit";
import { listExamCatalog } from "@/services/catalog-service";

export const dynamic = "force-dynamic";

const KEYWORDS = [
  "CBT",
  "기출문제",
  "자격증 시험",
  "자격증 기출문제",
  "자격증 CBT",
  "CBT 문제풀이",
  "온라인 CBT 시험",
  "자격증 시험 문제",
  "자격증 시험 연습",
  "기출문제 온라인 풀이",
  "시험 문제 정답",
  "자격증 모의고사",
  "자격증 공부",
  "컴퓨터활용능력",
  "컴퓨터활용능력 1급",
  "컴퓨터활용능력 2급",
  "정보처리기사",
  "한국사능력검정시험",
  "한국사능력검정",
  "워드프로세서",
  "전기기사",
  "산업기사",
  "산업안전기사",
  "건설안전기사",
  "소방설비기사",
  "소방설비기사 전기분야",
  "소방설비기사 기계분야",
  "위험물산업기사",
  "건축기사",
  "정보처리산업기사",
  "정보처리기능사",
  "전산회계",
  "전산회계 1급",
  "전산회계 2급",
  "전산세무",
  "전산세무 1급",
  "전산세무 2급",
  "재경관리사",
  "국가직 공문원",
  "공문원",
];

export async function generateMetadata(): Promise<Metadata> {
  try {
    const series = await listExamCatalog();
    const titles = [...new Set(series.map((item) => item.title))];
    const titleText = titles.slice(0, 6).join(", ");
    const description = titleText
      ? `${titleText} 기출문제를 CBT 방식으로 풀고 점수와 학습 기록을 확인하세요.`
      : "자격증 시험 문제를 CBT 방식으로 풀고 결과를 확인하는 시험 연습 서비스입니다.";
    return {
      title: titleText
        ? `${titleText} CBT 시험 연습 | taskory`
        : "taskory | CBT 시험",
      description,
      keywords: [
        ...titles,
        ...titles.map((title) => `${title} 기출문제`),
        ...titles.map((title) => `${title} CBT`),
        ...KEYWORDS,
      ],
      alternates: { canonical: "/" },
      openGraph: {
        title: titleText
          ? `${titleText} CBT 시험 연습 | taskory`
          : "taskory | CBT 시험",
        description,
        type: "website",
      },
    };
  } catch {
    return {
      title: "taskory | CBT 시험",
      description:
        "자격증 시험 문제를 CBT 방식으로 풀고 결과를 확인하는 시험 연습 서비스입니다.",
    };
  }
}

export default async function Home() {
  const examSeries = await listExamCatalog();
  const examItems = examSeries
    .flatMap((series) => [
      ...(series.papers ?? []).map((paper) => ({
        id: paper.id,
        name: `${series.title} ${paper.year}년 시험`,
      })),
      ...series.levels.flatMap((level) =>
        level.papers.map((paper) => ({
          id: paper.id,
          name: `${series.title} ${level.label} ${paper.year}년 시험`,
        })),
      ),
    ])
    .slice(0, 20);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://taskory-cbt.vercel.app";
  const websiteJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "taskory",
    description:
      "자격증 시험 문제를 CBT 방식으로 풀고 결과를 확인하는 시험 연습 서비스입니다.",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/exams?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }).replace(/</g, "\\u003c");
  const itemListJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "등록된 자격증 CBT 시험",
    itemListElement: examItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${siteUrl}/exams/${item.id}`,
    })),
  }).replace(/</g, "\\u003c");
  return (
    <main className="flex-1 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteJsonLd }}
      />
      {examItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: itemListJsonLd }}
        />
      )}
      <div className="mx-auto w-full max-w-[1200px] px-5 pb-16 pt-8 sm:px-8 lg:pt-12">
        <SearchHero
          keywords={examSeries.map((series) => series.title).slice(0, 3)}
        />
        <div className="mt-8">
          <AdSenseUnit
            slotId={process.env.NEXT_PUBLIC_ADSENSE_HOME_SLOT_ID}
            label="홈페이지 광고"
          />
        </div>
        <section className="mt-16">
          <div className="flex items-end justify-between gap-5 border-b border-[#dfe3e8] pb-5">
            <div>
              <p className="text-sm font-bold text-[#2563eb]">시험 탐색</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#20242a]">
                자격증, 급수, 연도로 찾기
              </h2>
            </div>
            <Link
              href="/exams"
              className="shrink-0 text-sm font-bold text-[#59616d] hover:text-[#2563eb]"
            >
              전체 목록
            </Link>
          </div>
          <div className="mt-2">
            {examSeries.length ? (
              <ExamCatalogExplorer series={examSeries.slice(0, 3)} />
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-3xl border border-[#e1e4e8] bg-[#fafbfc] px-5 text-center">
                <p className="font-bold text-[#343a42]">
                  현재 등록된 시험이 없습니다.
                </p>
                <p className="mt-2 text-sm text-[#8a9099]">
                  관리자가 시험을 등록하면 이곳에서 확인할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
