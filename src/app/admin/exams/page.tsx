import type { Metadata } from "next";
import { ExamsList, NewExamButton } from "@/components/admin/exams-list";
import { PageHeader } from "@/components/admin/page-header";
import type { ExamDisplayStatus } from "@/types/admin";

export const metadata: Metadata = { title: "시험 관리" };

function normalizeStatus(value?: string): ExamDisplayStatus | "ALL" {
  return value === "DRAFT" || value === "SCHEDULED" || value === "OPEN" || value === "CLOSED" || value === "ARCHIVED" ? value : "ALL";
}

export default async function ExamsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <PageHeader title="시험 관리" description="시험 일정과 운영 상태를 확인하고 새 시험을 임시 저장합니다." action={<NewExamButton />} />
      <ExamsList initialQuery={params.q?.trim() ?? ""} initialStatus={normalizeStatus(params.status)} />
    </>
  );
}

