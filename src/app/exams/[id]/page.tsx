import {
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  PlayIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonClasses } from "@/components/ui/button";
import { getPublicExam } from "@/services/exam-service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const exam = await getPublicExam(id);
  if (!exam) return { title: "시험을 찾을 수 없습니다 | taskory" };

  const description = `${exam.title} ${exam.questions.length}문항을 미리 확인하고 CBT 방식으로 무료 응시하세요.`;
  return {
    title: `${exam.title} 기출문제 | taskory`,
    description,
    keywords: [
      exam.title,
      `${exam.title} 기출문제`,
      `${exam.title} CBT`,
      "CBT",
      "기출문제",
    ],
    alternates: { canonical: `/exams/${id}` },
    openGraph: {
      title: `${exam.title} 기출문제 | taskory`,
      description,
      type: "article",
    },
  };
}

export default async function ExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exam = await getPublicExam(id);
  if (!exam) notFound();

  const firstQuestion = exam.questions[0];
  const estimatedMinutes = Math.max(
    10,
    Math.ceil(exam.questions.length / 10) * 10,
  );
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taskory.work";
  const description = `${exam.title} ${exam.questions.length}문항을 CBT 방식으로 풀고 점수와 정답을 확인하세요.`;
  const examJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: exam.title,
    description,
    url: `${siteUrl}/exams/${id}`,
    isAccessibleForFree: true,
    educationalUse: "시험 연습",
    provider: {
      "@type": "Organization",
      name: "taskory",
      url: siteUrl,
    },
    numberOfQuestions: exam.questions.length,
  }).replace(/</g, "\\u003c");

  return (
    <main className="flex-1 bg-[#f7f8fa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: examJsonLd }}
      />
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 px-5 py-10 sm:px-8 lg:flex-row lg:items-start lg:gap-8 lg:py-16">
        <div className="flex min-w-0 flex-1 flex-col gap-7">
          <section className="rounded-[28px] border border-[#dfe3e8] bg-white p-7 sm:p-10">
            <p className="text-sm font-bold text-[#2563eb]">무료 CBT 기출문제</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#20242a] sm:text-4xl">
              {exam.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6f7782] sm:text-base">
              실제 시험처럼 모든 문항을 한 번에 풀고, 제출 즉시 점수를 확인할
              수 있습니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="flex items-center gap-2 rounded-2xl bg-[#f1f5fb] px-4 py-3 text-sm font-bold text-[#3f587e]">
                <FileTextIcon size={18} aria-hidden="true" />
                총 {exam.questions.length}문항
              </span>
              <span className="flex items-center gap-2 rounded-2xl bg-[#f1f5fb] px-4 py-3 text-sm font-bold text-[#3f587e]">
                <ClockIcon size={18} aria-hidden="true" />
                예상 {estimatedMinutes}분
              </span>
              <span className="flex items-center gap-2 rounded-2xl bg-[#eef8f1] px-4 py-3 text-sm font-bold text-[#28734a]">
                <CheckCircleIcon size={18} aria-hidden="true" />
                제출 즉시 채점
              </span>
            </div>
          </section>

          {firstQuestion && (
            <section
              aria-labelledby="question-preview-title"
              className="rounded-[28px] border border-[#dfe3e8] bg-white p-7 sm:p-10"
            >
              <div className="flex items-center justify-between gap-4 border-b border-[#e4e7eb] pb-5">
                <div>
                  <p className="text-sm font-bold text-[#2563eb]">문제 미리보기</p>
                  <h2
                    id="question-preview-title"
                    className="mt-1 text-xl font-extrabold text-[#20242a]"
                  >
                    첫 번째 문제를 확인해 보세요
                  </h2>
                </div>
                <span className="shrink-0 rounded-full bg-[#f1f3f6] px-3 py-1.5 text-xs font-bold text-[#6e7580]">
                  1 / {exam.questions.length}
                </span>
              </div>

              <article className="pt-7">
                {firstQuestion.subject && (
                  <p className="text-sm font-bold text-[#2563eb]">
                    {firstQuestion.subject}
                  </p>
                )}
                <h3 className="mt-2 text-lg font-extrabold leading-8 tracking-[-0.025em] text-[#20242a] sm:text-xl">
                  {firstQuestion.prompt}
                </h3>
                {firstQuestion.context && (
                  <div className="mt-5 whitespace-pre-wrap rounded-2xl border border-[#dfe5ef] bg-[#f7f9fc] px-5 py-4 text-sm leading-7 text-[#596574]">
                    {firstQuestion.context}
                  </div>
                )}
                {firstQuestion.questionType === "objective" && (
                  <div className="mt-6 flex flex-col gap-3" aria-label="보기">
                    {firstQuestion.options.map((option, index) => (
                      <div
                        key={`${index}-${option}`}
                        className="flex items-center gap-4 rounded-2xl border border-[#e0e3e7] bg-white p-4 text-[#4d545e]"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#f0f2f5] text-sm font-bold text-[#6c737e]">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold sm:text-base">
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {firstQuestion.questionType === "subjective" && (
                  <div className="mt-6 flex h-14 items-center rounded-2xl border border-[#e0e3e7] px-4 text-sm text-[#9aa0a8]">
                    실제 시험에서 답안을 입력할 수 있습니다.
                  </div>
                )}
                <p className="mt-5 text-xs leading-5 text-[#8a919b]">
                  미리보기에서는 답안을 선택할 수 없습니다. 시험을 시작하면 모든
                  문제를 풀 수 있습니다.
                </p>
              </article>
            </section>
          )}
        </div>

        <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-[360px]">
          <section className="rounded-[28px] bg-[#17191c] p-7 text-white shadow-[0_18px_50px_rgba(23,25,28,0.16)] sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-[#a8c2ff]">
              <PlayIcon size={23} weight="fill" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-2xl font-extrabold tracking-[-0.035em]">
              무료로 시험 시작하기
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#c8cdd5]">
              짧은 광고 1편을 시청하면 전체 {exam.questions.length}문항을 풀 수
              있습니다.
            </p>
            <Link
              href={`/exams/${id}/start`}
              prefetch={false}
              className={buttonClasses(
                "primary",
                "mt-7 h-14 w-full rounded-2xl border-[#2563eb] bg-[#2563eb] text-base hover:bg-[#1f55cf]",
              )}
            >
              광고 보고 무료 응시
            </Link>
            <div className="mt-5 flex items-start gap-3 border-t border-white/10 pt-5">
              <ShieldCheckIcon
                size={19}
                className="mt-0.5 shrink-0 text-[#91b1ff]"
                aria-hidden="true"
              />
              <p className="text-xs leading-5 text-[#aeb5bf]">
                광고 시청 후 12시간 동안 시험을 이용할 수 있습니다. 시험 도중에는
                추가 광고가 표시되지 않습니다.
              </p>
            </div>
          </section>
          <p className="mt-4 px-2 text-center text-xs leading-5 text-[#8a919b]">
            로그인하면 응시 결과가 저장되고 문항별 정답과 해설을 확인할 수
            있습니다.
          </p>
        </aside>
      </div>
    </main>
  );
}
