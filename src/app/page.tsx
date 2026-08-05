import Link from "next/link";

import { ExamCatalogExplorer } from "@/components/exam-catalog-explorer";
import { SearchHero } from "@/components/search-hero";
import { listExamCatalog } from "@/services/catalog-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const examSeries = await listExamCatalog();
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-5 pb-16 pt-8 sm:px-8 lg:pt-12">
        <SearchHero keywords={examSeries.map((series) => series.title).slice(0, 3)} />
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
            <ExamCatalogExplorer series={examSeries.slice(0, 3)} />
          </div>
        </section>
      </div>
    </main>
  );
}
