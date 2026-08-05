import type { Metadata } from "next";
import { ExamDetail } from "@/components/admin/exam-detail";
import { serverDemoService } from "@/services/admin-service";

export async function generateMetadata({ params }: { params: Promise<{ examId: string }> }): Promise<Metadata> {
  const { examId } = await params;
  const exam = serverDemoService.getExam(examId);
  return { title: exam ? `${exam.title} · 시험 상세` : "시험 상세" };
}

export default async function ExamDetailPage({ params, searchParams }: { params: Promise<{ examId: string }>; searchParams: Promise<{ returnTo?: string; created?: string }> }) {
  const { examId } = await params;
  const query = await searchParams;
  const initialExam = serverDemoService.getExam(examId);
  const returnTo = query.returnTo?.startsWith("/admin/exams") ? query.returnTo : "/admin/exams";
  return <ExamDetail examId={examId} initialExam={initialExam} returnTo={returnTo} created={query.created === "1"} />;
}

