"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchHero({ keywords }: { keywords: string[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const search = (value = query) => {
    const trimmed = value.trim();
    router.push(trimmed ? `/exams?q=${encodeURIComponent(trimmed)}` : "/exams");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex min-h-[410px] flex-col items-center justify-center rounded-[28px] border border-[#dfe3e8] bg-[#f7f8fa] px-5 py-14 sm:px-10"
    >
      <div className="max-w-2xl text-center">
        <p className="text-sm font-bold text-[#2563eb]">Taskory CBT</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.05em] text-[#17191c] sm:text-5xl">
          준비하는 시험을 찾아보세요
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#737a84] sm:text-base">
          시험을 선택하고 실제 CBT 환경처럼 문제를 풀어볼 수 있습니다.
        </p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          search();
        }}
        className="mt-10 flex h-16 w-full max-w-[920px] items-center rounded-2xl border border-[#d5d9df] bg-white px-5 shadow-[0_8px_30px_rgba(24,29,37,0.05)] focus-within:border-[#8da7d8] sm:h-[72px] sm:px-7"
      >
        <MagnifyingGlassIcon
          size={24}
          className="shrink-0 text-[#272b31]"
          aria-hidden="true"
        />
        <label htmlFor="exam-search" className="sr-only">
          시험 검색
        </label>
        <input
          id="exam-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="시험명, 자격증 종류 검색..."
          className="min-w-0 flex-1 bg-transparent px-4 text-sm font-medium text-[#25292f] outline-none placeholder:text-[#9aa0a9] sm:text-base"
        />
        <button
          type="submit"
          className="rounded-xl px-3 py-2 text-sm font-bold text-[#282d34] transition-colors hover:bg-[#f3f5f7] sm:px-5"
        >
          검색
        </button>
      </form>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        {keywords.map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => search(keyword)}
            className="rounded-full border border-[#d9dde2] bg-white px-4 py-2 text-xs font-semibold text-[#626a75] transition-colors hover:border-[#9fb2d7] hover:text-[#2563eb]"
          >
            {keyword}
          </button>
        ))}
      </div>
    </motion.section>
  );
}
