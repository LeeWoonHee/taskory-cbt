import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ExamRunner } from "@/components/exam-runner";
import { getPublicExam } from "@/services/exam-service";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const exam = await getPublicExam(id);
  if (!exam) return { title: "시험을 찾을 수 없습니다 | taskory" };
  return { title: `${exam.title} | taskory`, description: `${exam.title} 문제를 CBT 방식으로 풀고 결과를 확인하세요.`, alternates: { canonical: `/exams/${id}` }, openGraph: { title: `${exam.title} | taskory`, description: `${exam.title} 문제를 CBT 방식으로 풀고 결과를 확인하세요.`, type: "article" } };
}

export default async function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = await getPublicExam(id);
  if (!exam) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taskory-cbt.vercel.app";
  const description = `${exam.title} 문제를 CBT 방식으로 풀고 점수와 정답을 확인하세요.`;
  const examJsonLd = JSON.stringify({ "@context": "https://schema.org", "@type": "Quiz", name: exam.title, description, url: `${siteUrl}/exams/${id}`, isAccessibleForFree: true, educationalUse: "시험 연습", provider: { "@type": "Organization", name: "taskory", url: siteUrl }, numberOfQuestions: exam.questions.length }).replace(/</g, "\\u003c");
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: examJsonLd }} />
    <ExamRunner exam={exam} />
  </>;
}
