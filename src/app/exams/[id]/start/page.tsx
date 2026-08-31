import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExamRunner } from "@/components/exam-runner";
import { getPublicExam } from "@/services/exam-service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const exam = await getPublicExam(id);
  if (!exam) return { title: "시험을 찾을 수 없습니다 | taskory" };

  return {
    title: `${exam.title} 응시 | taskory`,
    description: `${exam.title} CBT 시험 응시 화면입니다.`,
    alternates: { canonical: `/exams/${id}` },
    robots: { index: false, follow: false },
  };
}

export default async function ExamStartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = await getPublicExam(id);
  if (!exam) notFound();

  return <ExamRunner exam={exam} />;
}
