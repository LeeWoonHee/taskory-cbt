"use client";

import { CheckCircleIcon, LockKeyIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

type PublicQuestion = { id: string; questionType: string; subject: string; prompt: string; context: string | null; options: string[] };
type Review = { questionId: string; selectedAnswer: number | string | null; correctAnswer: number | string; explanation: string; correct: boolean };
type Result = { score: number; passed: boolean | null; passScore?: number | null; correctCount: number; totalCount: number; review: Review[] | null };

export function ExamRunner({ exam }: { exam: { id: string; title: string; passScore: number | null; questions: PublicQuestion[] } }) {
  const [answers, setAnswers] = useState<Array<number | string | null>>(() => exam.questions.map(() => null));
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const answered = answers.filter((answer) => answer !== null).length;

  function scrollToQuestion(index: number) {
    document.getElementById(`question-${exam.questions[index].id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit() {
    if (!window.confirm(`답안을 제출할까요? 미응답 문항은 ${exam.questions.length - answered}개입니다.`)) return;
    setLoading(true);
    try {
      const response = await fetch("/api/attempts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ examId: exam.id, answers }) });
      if (!response.ok) throw new Error("시험 결과를 계산하지 못했습니다.");
      setResult(await response.json() as Result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setResult({ score: 0, passed: exam.passScore === null ? null : false, passScore: exam.passScore, correctCount: 0, totalCount: exam.questions.length, review: null });
    } finally {
      setLoading(false);
    }
  }

  if (result) return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:py-20">
        <section className="rounded-[28px] border border-[#dfe3e8] bg-[#f7f8fa] p-7 text-center sm:p-12">
          <p className="text-sm font-bold text-[#2563eb]">시험 결과</p><p className="mt-5 text-7xl font-extrabold tracking-[-0.07em] text-[#17191c] sm:text-8xl">{result.score}<span className="ml-1 text-2xl">점</span></p>
          <p className="mt-5 text-base font-bold text-[#343a42]">{result.passScore === null || result.passScore === undefined ? "채점이 완료되었습니다." : result.passed ? "합격 기준을 통과했습니다." : "조금 더 학습이 필요합니다."}</p><p className="mt-2 text-sm text-[#818892]">{result.totalCount}문항 중 {result.correctCount}문항 정답{result.passScore !== null && result.passScore !== undefined ? ` · 합격 기준 ${result.passScore}점` : ""}</p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"><button type="button" onClick={() => { setResult(null); setAnswers(exam.questions.map(() => null)); }} className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#17191c] text-sm font-bold text-white">다시 풀기</button><Link href="/exams" className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-[#d6dae0] bg-white text-sm font-bold text-[#414750]">다른 시험 보기</Link></div>
        </section>
        {result.review ? <section className="mt-8 rounded-[28px] border border-[#e0e3e7] bg-white p-6 sm:p-9"><h2 className="text-xl font-extrabold">문항별 정답과 해설</h2><div className="mt-6 flex flex-col">{result.review.map((item, index) => <article key={item.questionId} className="flex flex-col gap-3 border-t border-[#eceef1] py-6 sm:flex-row sm:gap-6"><span className={item.correct ? "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eef8f1] text-[#24824b]" : "flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff1f1] text-[#c64545]"}><CheckCircleIcon size={19} /></span><div className="min-w-0"><p className="font-bold leading-6">{index + 1}. {exam.questions[index].prompt}</p><p className="mt-2 text-sm text-[#6f7680]">정답 {typeof item.correctAnswer === "number" ? `${item.correctAnswer + 1}번` : item.correctAnswer} · {item.explanation}</p></div></article>)}</div></section> : <section className="mt-8 flex flex-col items-center rounded-[28px] border border-[#e0e3e7] bg-white p-9 text-center"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#f1f4f8] text-[#69727e]"><LockKeyIcon size={23} /></span><h2 className="mt-5 text-xl font-extrabold">정답과 해설은 회원에게 제공됩니다.</h2><p className="mt-2 text-sm text-[#808791]">로그인하면 이번 결과를 저장하고 문항별 해설을 확인할 수 있습니다.</p><Link href="/login" className="mt-6 rounded-2xl bg-[#2563eb] px-6 py-3 text-sm font-bold text-white">로그인하기</Link></section>}
      </div>
    </main>
  );

  return (
    <main className="flex-1 bg-[#f7f8fa]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-5 py-8 sm:px-8 lg:flex-row lg:items-start lg:px-12 lg:py-12">
        <aside className="order-1 w-full rounded-3xl border border-[#e0e3e7] bg-white p-5 lg:sticky lg:top-5 lg:order-1 lg:w-72 lg:shrink-0 lg:p-6">
          <div className="flex items-end justify-between border-b border-[#e9ecf0] pb-5"><div><p className="text-xs font-semibold text-[#8a9099]">답안 현황</p><p className="mt-1 text-xl font-extrabold">{answered}<span className="text-sm font-medium text-[#9ba0a8]"> / {exam.questions.length}</span></p></div><p className="text-xs font-semibold text-[#6b7280]">문항 이동</p></div>
          <div className="mt-5 flex flex-wrap gap-2">{exam.questions.map((item, index) => <button key={item.id} type="button" onClick={() => scrollToQuestion(index)} aria-label={`${index + 1}번 문항으로 이동`} className={answers[index] !== null ? "flex size-10 items-center justify-center rounded-xl bg-[#20242a] text-sm font-bold text-white" : "flex size-10 items-center justify-center rounded-xl border border-[#dde1e6] bg-white text-sm font-bold text-[#626a75]"}>{index + 1}</button>)}</div>
          <button type="button" disabled={loading} onClick={submit} className="mt-7 h-12 w-full rounded-2xl bg-[#17191c] text-sm font-bold text-white transition-colors hover:bg-[#2563eb] disabled:opacity-50">{loading ? "제출 중..." : "답안 제출"}</button>
        </aside>
        <section aria-label="시험 문제" className="order-2 min-w-0 flex-1 rounded-3xl border border-[#e0e3e7] bg-white px-6 py-8 sm:px-9 lg:order-2 lg:px-12 lg:py-11">
          <header className="border-b border-[#dfe3e8] pb-7"><p className="text-sm font-bold text-[#2563eb]">전체 문항 풀이</p><h1 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[#20242a] sm:text-2xl">{exam.title}</h1><p className="mt-3 text-sm text-[#747c86]">문항을 한 페이지에서 확인하고, 왼쪽 번호를 눌러 원하는 문제로 바로 이동할 수 있습니다.</p></header>
          <div className="flex flex-col">{exam.questions.map((question, questionIndex) => {
            return <article key={question.id} id={`question-${question.id}`} className="scroll-mt-6 border-b border-[#e7e9ed] py-9 first:pt-8 sm:py-11">
              <div className="flex items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0f2f5] text-base font-extrabold text-[#303640]">{String(questionIndex + 1).padStart(2, "0")}</span><div className="min-w-0"><p className="text-sm font-bold text-[#2563eb]">{question.subject}</p><h2 className="mt-3 text-lg font-extrabold leading-8 tracking-[-0.025em] text-[#20242a] sm:text-xl sm:leading-9">{question.prompt}</h2></div></div>
              {question.context && <div className="ml-0 mt-6 whitespace-pre-wrap rounded-2xl border border-[#dfe5ef] bg-[#f7f9fc] px-5 py-4 text-sm leading-7 text-[#596574] sm:ml-[60px]"><p className="mb-2 text-xs font-extrabold text-[#71809a]">지문/예시</p>{question.context}</div>}
              <fieldset className="ml-0 mt-7 flex flex-col gap-3 sm:ml-[60px]"><legend className="sr-only">{questionIndex + 1}번 답안을 입력하세요</legend>{question.questionType === "subjective" ? <input type="text" value={typeof answers[questionIndex] === "string" ? answers[questionIndex] : ""} onChange={(event) => setAnswers((previous) => previous.map((answer, answerIndex) => answerIndex === questionIndex ? event.target.value : answer))} placeholder="답안을 입력하세요" className="h-14 rounded-2xl border border-[#e0e3e7] px-4 text-base outline-none transition-colors focus:border-[#789ae0] focus:ring-4 focus:ring-[#f2f6ff]" /> : question.options.map((option, optionIndex) => { const selected = answers[questionIndex] === optionIndex; return <label key={option} className={selected ? "flex cursor-pointer items-center gap-4 rounded-2xl border border-[#789ae0] bg-[#f2f6ff] p-4 text-[#1f4ba5]" : "flex cursor-pointer items-center gap-4 rounded-2xl border border-[#e0e3e7] bg-white p-4 text-[#454c55] transition-colors hover:bg-[#f8f9fa]"}><input type="radio" name={`question-${question.id}`} checked={selected} onChange={() => setAnswers((previous) => previous.map((answer, answerIndex) => answerIndex === questionIndex ? optionIndex : answer))} className="sr-only" /><span className={selected ? "flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#2563eb] text-sm font-bold text-white" : "flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#f0f2f5] text-sm font-bold text-[#6c737e]"}>{optionIndex + 1}</span><span className="text-sm font-semibold sm:text-base">{option}</span></label>; })}</fieldset>
            </article>;
          })}</div>
          <div className="flex flex-col items-start justify-between gap-4 pt-8 sm:flex-row sm:items-center"><p className="text-sm font-medium text-[#727983]">답안 현황 {answered} / {exam.questions.length}</p><button type="button" disabled={loading} onClick={submit} className="h-12 rounded-2xl bg-[#17191c] px-7 text-sm font-bold text-white transition-colors hover:bg-[#2563eb] disabled:opacity-50">{loading ? "제출 중..." : "답안 제출"}</button></div>
        </section>
      </div>
    </main>
  );
}
