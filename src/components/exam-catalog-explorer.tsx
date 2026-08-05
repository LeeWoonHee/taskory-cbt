"use client";

import { CaretRightIcon, FileTextIcon, FolderSimpleIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import type { ExamSeries } from "@/data/exams";

export function ExamCatalogExplorer({ series }: { series: ExamSeries[] }) {
  const [expandedSeries, setExpandedSeries] = useState<string | null>(series[0]?.id ?? null);
  const [expandedLevels, setExpandedLevels] = useState<string[]>(series[0]?.levels[0] ? [`${series[0].id}-${series[0].levels[0].id}`] : []);
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: shouldReduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] as const };

  const toggleLevel = (key: string) => setExpandedLevels((previous) => previous.includes(key) ? previous.filter((item) => item !== key) : [...previous, key]);

  return (
    <div className="flex flex-col border-y border-[#dfe3e8]">
      {series.map((item) => {
        const isSeriesOpen = expandedSeries === item.id;
        return (
          <section key={item.id} className="border-b border-[#e8eaed] last:border-b-0">
            <button type="button" onClick={() => setExpandedSeries((previous) => previous === item.id ? null : item.id)} aria-expanded={isSeriesOpen} className="flex w-full items-center gap-4 py-6 text-left sm:gap-6 sm:py-7">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#f1f5fa] text-[#5271a8]"><FolderSimpleIcon size={22} weight="duotone" /></span>
              <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-x-3 gap-y-1"><strong className="text-lg font-extrabold tracking-[-0.03em] text-[#20242a] sm:text-xl">{item.title}</strong><span className="text-xs font-semibold text-[#8a919b]">{item.category}</span></span><span className="mt-1 block truncate text-sm text-[#777f89]">{item.organization} · {item.levels.length}개 급수 · 연도별 기출문제</span></span>
              <span className="flex size-9 items-center justify-center rounded-xl border border-[#e1e4e8] text-[#68717c]"><motion.span animate={{ rotate: isSeriesOpen ? 90 : 0 }} transition={transition}><CaretRightIcon size={17} /></motion.span></span>
            </button>
            <AnimatePresence initial={false}>
              {isSeriesOpen && <motion.div key="series-content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={transition} className="overflow-hidden">
                <div className="mb-6 flex flex-col border-l border-[#dfe3e8] pl-5 sm:mb-7 sm:ml-5 sm:pl-7">
                  <p className="max-w-2xl text-sm leading-6 text-[#737b85]">{item.description}</p>
                  <div className="mt-5 flex flex-col">
                    {item.levels.map((level) => {
                      const key = `${item.id}-${level.id}`;
                      const isLevelOpen = expandedLevels.includes(key);
                      const availableCount = level.papers.filter((paper) => paper.status === "available").length;
                      return <section key={level.id} className="border-t border-[#e8eaed] first:border-t-0">
                        <button type="button" onClick={() => toggleLevel(key)} aria-expanded={isLevelOpen} className="flex w-full items-center justify-between gap-4 py-4 text-left">
                          <span className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-lg bg-[#eef3fb] text-sm font-extrabold text-[#3764ae]">{level.label}</span><span className="text-sm font-bold text-[#424951]">{level.papers[0]?.year}~{level.papers.at(-1)?.year}년</span><span className="text-xs text-[#9298a0]">{availableCount ? `응시 가능 ${availableCount}개` : "문항 검수 중"}</span></span>
                          <motion.span animate={{ rotate: isLevelOpen ? 90 : 0 }} transition={transition}><CaretRightIcon size={16} className="text-[#747b85]" /></motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isLevelOpen && <motion.div key="papers" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={transition} className="overflow-hidden">
                            <div className="flex flex-wrap gap-2 pb-5">
                              {level.papers.map((paper) => paper.status === "available" ? <Link key={paper.id} href={`/exams/${paper.id}`} className="flex h-10 items-center gap-2 rounded-xl border border-[#8eabd9] bg-[#f1f6ff] px-3 text-sm font-bold text-[#2457ae] transition-colors hover:bg-[#e4efff]"><FileTextIcon size={15} />{paper.year}년</Link> : <span key={paper.id} className="flex h-10 items-center rounded-xl border border-[#e4e6ea] bg-[#fafbfc] px-3 text-sm font-medium text-[#9aa0a8]">{paper.year}년</span>)}
                            </div>
                          </motion.div>}
                        </AnimatePresence>
                      </section>;
                    })}
                  </div>
                </div>
              </motion.div>}
            </AnimatePresence>
          </section>
        );
      })}
    </div>
  );
}
