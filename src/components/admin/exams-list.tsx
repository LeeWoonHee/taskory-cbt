"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleHelp, Plus, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState, type FormEvent } from "react";
import { EmptyState } from "@/components/admin/empty-state";
import { useDemoData } from "@/components/admin/demo-data-provider";
import { ExamStatusBadge } from "@/components/ui/badge";
import { buttonClasses, Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createListHref, examStatusLabel, formatDateTime, formatPeriod } from "@/lib/admin-format";
import { cn } from "@/lib/cn";
import type { Exam, ExamDisplayStatus } from "@/types/admin";

const filters: Array<{ value: ExamDisplayStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "전체" }, { value: "DRAFT", label: "임시 저장" },
  { value: "SCHEDULED", label: "게시 예정" }, { value: "OPEN", label: "진행 중" },
  { value: "CLOSED", label: "종료" }, { value: "ARCHIVED", label: "보관" },
];

function ExamTable({ exams, returnTo, getStatus }: { exams: Exam[]; returnTo: string; getStatus: (exam: Exam) => ExamDisplayStatus }) {
  return (
    <Card className="hidden overflow-hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <caption className="sr-only">시험 검색 결과</caption>
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-600"><tr><th scope="col" className="px-5 py-3">시험명/코드</th><th scope="col" className="px-5 py-3">운영 상태</th><th scope="col" className="px-5 py-3">응시 기간</th><th scope="col" className="px-5 py-3 text-right">제한 시간</th><th scope="col" className="px-5 py-3 text-right">문항</th><th scope="col" className="px-5 py-3 text-right">응시자</th><th scope="col" className="px-5 py-3">수정일</th><th scope="col" className="px-5 py-3 text-right">작업</th></tr></thead>
          <tbody className="divide-y divide-zinc-200">
            {exams.map((exam) => (
              <tr key={exam.id} className="hover:bg-zinc-50">
                <td className="max-w-72 px-5 py-4"><p className="font-semibold text-zinc-950">{exam.title}</p><p className="mt-1 text-xs font-medium text-zinc-500">{exam.code}</p></td>
                <td className="px-5 py-4"><ExamStatusBadge status={getStatus(exam)} /></td>
                <td className="max-w-72 px-5 py-4 text-xs leading-5 tabular-nums text-zinc-700">{formatPeriod(exam.startsAt, exam.endsAt)}</td>
                <td className="px-5 py-4 text-right tabular-nums text-zinc-700">{exam.durationMinutes}분</td>
                <td className="px-5 py-4 text-right tabular-nums text-zinc-700">{exam.questionCount}개</td>
                <td className="px-5 py-4 text-right tabular-nums text-zinc-700">{exam.attemptCount}명</td>
                <td className="whitespace-nowrap px-5 py-4 tabular-nums text-zinc-700">{formatDateTime(exam.updatedAt)}</td>
                <td className="px-5 py-4 text-right"><Link href={`/admin/exams/${exam.id}?returnTo=${encodeURIComponent(returnTo)}`} className="inline-flex min-h-11 items-center rounded-lg px-3 font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">상세 보기</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ExamCards({ exams, returnTo, getStatus }: { exams: Exam[]; returnTo: string; getStatus: (exam: Exam) => ExamDisplayStatus }) {
  return (
    <div className="flex flex-col gap-3 md:hidden">
      {exams.map((exam) => (
        <Card key={exam.id} className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-2"><div className="min-w-0 flex-1"><h2 className="font-semibold leading-6 text-zinc-950">{exam.title}</h2><p className="mt-1 text-xs font-medium text-zinc-500">{exam.code}</p></div><ExamStatusBadge status={getStatus(exam)} /></div>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex flex-col gap-1"><dt className="text-zinc-500">응시 기간</dt><dd className="tabular-nums text-zinc-800">{formatPeriod(exam.startsAt, exam.endsAt)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-zinc-500">계획 문항</dt><dd className="text-zinc-800">{exam.questionCount}개</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-zinc-500">응시자</dt><dd className="text-zinc-800">{exam.attemptCount}명</dd></div>
          </dl>
          <Link href={`/admin/exams/${exam.id}?returnTo=${encodeURIComponent(returnTo)}`} className={buttonClasses("outline", "mt-4 w-full")}>상세 보기</Link>
        </Card>
      ))}
    </div>
  );
}

export function ExamsList({ initialQuery, initialStatus }: { initialQuery: string; initialStatus: ExamDisplayStatus | "ALL" }) {
  const router = useRouter();
  const { listExams, getDisplayStatus } = useDemoData();
  const [query, setQuery] = useState(initialQuery);
  const reducedMotion = useReducedMotion();
  const result = listExams({ query: initialQuery, displayStatus: initialStatus });
  const returnTo = createListHref("/admin/exams", initialQuery, initialStatus);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    router.push(createListHref("/admin/exams", query.trim(), initialStatus));
  }

  const summary = initialQuery && initialStatus !== "ALL"
    ? `${examStatusLabel[initialStatus]} · “${initialQuery}” 검색 결과 ${result.total}개`
    : initialQuery ? `“${initialQuery}” 검색 결과 ${result.total}개 · 수정일 최신순`
      : initialStatus !== "ALL" ? `${examStatusLabel[initialStatus]} 시험 ${result.total}개 · 수정일 최신순`
        : `전체 ${result.total}개 · 수정일 최신순`;

  return (
    <>
      <Card className="mb-4 p-4 sm:p-5">
        <form onSubmit={submitSearch} role="search" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2"><label htmlFor="exam-search" className="text-sm font-semibold text-zinc-800">시험 검색</label><div className="flex flex-col gap-2 sm:flex-row"><div className="relative flex-1"><Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" /><input id="exam-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="시험명 또는 시험 코드 검색" className="h-11 w-full rounded-lg border border-zinc-500 bg-white pl-10 pr-3 text-base outline-none placeholder:text-zinc-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-600/20 sm:text-sm" /></div><Button type="submit">검색</Button></div></div>
          <fieldset><legend className="mb-2 text-sm font-semibold text-zinc-800">운영 상태</legend><div className="flex flex-wrap gap-2">{filters.map((filter) => <button key={filter.value} type="button" aria-pressed={initialStatus === filter.value} onClick={() => router.push(createListHref("/admin/exams", initialQuery, filter.value))} className={cn("min-h-10 rounded-full border px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2", initialStatus === filter.value ? "border-blue-700 bg-blue-700 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50")}>{filter.label}</button>)}</div></fieldset>
        </form>
      </Card>

      <div className="mb-4 flex items-start gap-2 rounded-lg bg-zinc-100 px-4 py-3 text-xs leading-5 text-zinc-700"><CircleHelp size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><p>게시된 시험은 고정 데모 기준 시각(2026.08.05 09:00, 서울)에 따라 게시 예정·진행 중·종료로 계산됩니다.</p></div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p aria-live="polite" className="text-sm font-medium text-zinc-700">{summary}</p>{(initialQuery || initialStatus !== "ALL") ? <Link href="/admin/exams" className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">필터 초기화</Link> : null}</div>

      <motion.div initial={{ opacity: reducedMotion ? 1 : 0.75 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.14 }}>
        {result.items.length === 0 ? <EmptyState title="조건에 맞는 시험이 없습니다." description="검색어나 운영 상태 조건을 바꿔 보세요." action={<Link href="/admin/exams" className={buttonClasses("outline")}>필터 초기화</Link>} /> : <><ExamTable exams={result.items} returnTo={returnTo} getStatus={getDisplayStatus} /><ExamCards exams={result.items} returnTo={returnTo} getStatus={getDisplayStatus} /></>}
      </motion.div>
    </>
  );
}

export function NewExamButton() {
  return <Link href="/admin/exams/new" className={buttonClasses("primary", "w-full sm:w-auto")}><Plus size={17} aria-hidden="true" /> 시험 간편 등록</Link>;
}

