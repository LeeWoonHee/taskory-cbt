"use client";

import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { useState } from "react";
import { useDemoData } from "@/components/admin/demo-data-provider";
import { ExamStatusBadge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { formatDateTime, formatPeriod, visibilityLabel } from "@/lib/admin-format";
import type { Exam } from "@/types/admin";

function DefinitionCard({ title, items }: { title: string; items: Array<[string, string]> }) {
  return (
    <Card className="min-w-[min(100%,20rem)] flex-1 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-zinc-950">{title}</h2>
      <dl className="mt-5 flex flex-col gap-4">
        {items.map(([label, value]) => <div key={label} className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-5"><dt className="text-sm text-zinc-500">{label}</dt><dd className="break-all text-sm font-medium text-zinc-900 sm:text-right">{value}</dd></div>)}
      </dl>
    </Card>
  );
}

export function ExamDetail({ examId, initialExam, returnTo, created }: { examId: string; initialExam: Exam | null; returnTo: string; created: boolean }) {
  const { getExam, getDisplayStatus, hydrated } = useDemoData();
  const exam = getExam(examId) ?? initialExam;
  const [message, setMessage] = useState(created ? "임시 시험이 저장되었습니다. 변경 내용은 이 브라우저의 localStorage에 저장됩니다." : "");

  if (!exam && !hydrated) {
    return <Card className="p-8" aria-busy="true"><p className="text-sm text-zinc-600">시험 정보를 불러오는 중입니다.</p></Card>;
  }
  if (!exam) {
    return <Card className="mx-auto max-w-xl p-8 text-center"><h1 className="text-2xl font-bold text-zinc-950">시험 정보를 찾을 수 없습니다.</h1><p className="mt-3 text-sm text-zinc-600">삭제되었거나 잘못된 주소일 수 있습니다.</p><Link href="/admin/exams" className={buttonClasses("primary", "mt-6")}>시험 목록으로</Link></Card>;
  }

  return (
    <>
      <Link href={returnTo} className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><ArrowLeft size={17} aria-hidden="true" /> 시험 목록으로</Link>
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3"><h1 className="max-w-4xl text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">{exam.title}</h1><ExamStatusBadge status={getDisplayStatus(exam)} /></div>
        <p className="mt-2 text-sm font-medium text-zinc-600">{exam.code} · {exam.category}</p>
        <p className="mt-3 max-w-4xl whitespace-pre-wrap text-sm leading-6 text-zinc-700">{exam.description || "등록된 설명 없음"}</p>
        <p className="mt-2 break-all text-xs text-zinc-500">시험 ID {exam.id}</p>
      </header>

      <div className="flex flex-wrap gap-5">
        <DefinitionCard title="기본 정보" items={[["시험 코드", exam.code], ["분류", exam.category], ["공개 범위", visibilityLabel[exam.visibility]]]} />
        <DefinitionCard title="시험 설정" items={[["제한 시간", `${exam.durationMinutes}분`], ["계획 문항 수", `${exam.questionCount}개`], ["합격 점수", `${exam.passScore}점`], ["응시 기간", formatPeriod(exam.startsAt, exam.endsAt)]]} />
        <DefinitionCard title="운영 정보" items={[["응시자 수", `${exam.attemptCount}명`], ["생성일", formatDateTime(exam.createdAt)], ["수정일", formatDateTime(exam.updatedAt)]]} />
      </div>

      <Card className="mt-5 p-5 sm:p-6">
        <div className="flex items-start gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700" aria-hidden="true"><FileQuestion size={21} /></span><div><h2 className="text-lg font-bold text-zinc-950">문항</h2><p className="mt-2 text-sm leading-6 text-zinc-600">문항 편집은 다음 단계에서 제공됩니다.</p><p className="mt-1 text-sm font-medium text-zinc-800">현재 계획 문항 수는 {exam.questionCount}개입니다.</p></div></div>
      </Card>
      {message ? <Toast message={message} onClose={() => setMessage("")} /> : null}
    </>
  );
}

