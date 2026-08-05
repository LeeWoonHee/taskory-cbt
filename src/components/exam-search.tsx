"use client";

import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ExamSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  return (
    <form onSubmit={(event) => { event.preventDefault(); router.push(query.trim() ? `/exams?q=${encodeURIComponent(query.trim())}` : "/exams"); }} className="flex h-14 w-full items-center rounded-2xl border border-[#dfe3e8] bg-white px-5 focus-within:border-[#91a9d7] sm:max-w-xl">
      <MagnifyingGlassIcon size={20} className="text-[#68707b]" aria-hidden="true" />
      <label htmlFor="list-search" className="sr-only">시험 목록 검색</label>
      <input id="list-search" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" placeholder="시험명을 검색하세요" />
      <button type="submit" className="text-sm font-bold text-[#2c3138]">검색</button>
    </form>
  );
}
