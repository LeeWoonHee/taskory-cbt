import { notFound } from "next/navigation";

import { ExamRunner } from "@/components/exam-runner";
import { getPublicExam } from "@/services/exam-service";

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = await getPublicExam(id);
  if (!exam) notFound();
  return <ExamRunner exam={exam} />;
}
