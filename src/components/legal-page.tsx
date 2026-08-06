import Link from "next/link";

type LegalSection = { title: string; paragraphs: string[] };

export function LegalPage({ eyebrow, title, description, sections }: { eyebrow: string; title: string; description: string; sections: LegalSection[] }) {
  return (
    <main className="flex-1 bg-[#f7f8fa]">
      <div className="mx-auto w-full max-w-[900px] px-5 py-12 sm:px-8 lg:py-20">
        <Link href="/" className="text-sm font-bold text-[#2563eb]">taskory 홈으로</Link>
        <header className="mt-8 rounded-[28px] border border-[#e0e3e7] bg-white p-7 sm:p-10">
          <p className="text-sm font-bold text-[#2563eb]">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#20242a]">{title}</h1>
          <p className="mt-4 text-sm leading-7 text-[#737a84]">{description}</p>
          <p className="mt-5 text-xs text-[#9aa0a8]">최종 수정일: 2026년 8월 6일</p>
        </header>
        <article className="mt-5 flex flex-col gap-5 rounded-[28px] border border-[#e0e3e7] bg-white p-7 sm:p-10">
          {sections.map((section) => <section key={section.title}><h2 className="text-lg font-extrabold text-[#30353c]">{section.title}</h2><div className="mt-3 flex flex-col gap-2 text-sm leading-7 text-[#626a74]">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>)}
        </article>
      </div>
    </main>
  );
}
