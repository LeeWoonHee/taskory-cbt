import type { Metadata } from "next";
import { ExamForm } from "@/components/admin/exam-form";

export const metadata: Metadata = { title: "시험 간편 등록" };

export default function NewExamPage() {
  return <ExamForm />;
}

