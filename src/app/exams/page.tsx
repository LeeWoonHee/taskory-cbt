import { ExamCatalogExplorer } from "@/components/exam-catalog-explorer";
import { ExamSearch } from "@/components/exam-search";
import { filterExamSeries } from "@/data/exams";

export default async function ExamsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const series = filterExamSeries(q);
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8 lg:py-20">
        <section className="flex flex-col justify-between gap-8 rounded-[28px] border border-[#dfe3e8] bg-[#f7f8fa] p-7 sm:p-10 lg:flex-row lg:items-end lg:p-12">
          <div><p className="text-sm font-bold text-[#2563eb]">시험 아카이브</p><h1 className="mt-3 text-3xl font-extrabold tracking-[-0.05em] text-[#17191c] sm:text-5xl">급수와 연도로 찾아보세요</h1><p className="mt-4 text-sm leading-6 text-[#737a84]">시험을 열고, 급수를 선택한 뒤 원하는 연도의 문제를 시작할 수 있습니다.</p></div>
          <ExamSearch initialQuery={q} />
        </section>
        <div className="mt-12 flex items-center justify-between"><h2 className="text-xl font-extrabold text-[#20242a]">{q ? `“${q}” 검색 결과` : "전체 시험"}</h2><p className="text-sm text-[#8a9099]">{series.length}개 자격증</p></div>
        {series.length ? <div className="mt-5"><ExamCatalogExplorer series={series} /></div> : <div className="mt-6 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-[#e1e4e8] bg-[#fafbfc] text-center"><p className="font-bold text-[#343a42]">검색 결과가 없습니다.</p><p className="mt-2 text-sm text-[#8a9099]">다른 시험명, 급수 또는 연도로 검색해 보세요.</p></div>}
      </div>
    </main>
  );
}
