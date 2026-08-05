import { notFound } from "next/navigation";

import { ExamRunner } from "@/components/exam-runner";
import { getExamById } from "@/data/exams";

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = getExamById(id);
  if (!exam) notFound();
  return <ExamRunner exam={{ id: exam.id, title: `${exam.seriesTitle} ${exam.level} · ${exam.year}년`, passScore: exam.passScore, questions: exam.questions.map(({ id: questionId, subject, prompt, options }) => ({ id: questionId, subject, prompt, options })) }} />;
}
