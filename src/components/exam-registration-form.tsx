"use client";

import { FileArrowUpIcon, FileCsvIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { FormEvent, useState } from "react";

type ExamDraft = { title: string; level: string; year: string; month: string; round: string; category: string; organization: string; sourceName: string; sourceUrl: string; status: "draft" | "published" };
type ImportedQuestion = { questionType: "objective" | "subjective"; prompt: string; context: string | null; options: string[] | null; correctAnswer: string; explanation: string | null };
const inputClass = "h-12 rounded-xl border border-[#dfe3e8] bg-white px-4 text-sm font-medium outline-none transition-colors placeholder:text-[#a4a9b0] focus:border-[#8ca6d7]";
const labelClass = "flex flex-col gap-2 text-sm font-bold text-[#363b43]";

function toErrorMessages(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(toErrorMessages);
  if (typeof value === "string") return [value];
  if (value && typeof value === "object") {
    const error = value as { message?: unknown; summary?: unknown };
    if (error.message) return toErrorMessages(error.message);
    if (error.summary) return toErrorMessages(error.summary);
    try { return [JSON.stringify(value)]; } catch { return ["알 수 없는 오류가 발생했습니다."]; }
  }
  return ["알 수 없는 오류가 발생했습니다."];
}

export function ExamRegistrationForm() {
  const [exam, setExam] = useState<ExamDraft>({ title: "", level: "", year: "2026", month: "", round: "", category: "", organization: "", sourceName: "", sourceUrl: "", status: "published" });
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<ImportedQuestion[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateExam(field: keyof ExamDraft, value: string) {
    setExam((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]); setMessage(null);
    if (!file) { setErrors(["엑셀 파일을 선택해 주세요."]); return; }
    setLoading(true);
    const formData = new FormData();
    formData.append("metadata", JSON.stringify(exam));
    formData.append("file", file);
    try {
      const response = await fetch("/api/admin/exams/import", { method: "POST", body: formData });
      const result = await response.json() as { message?: unknown; errors?: unknown; questions?: ImportedQuestion[]; exam?: { title: string; questionCount: number } };
      if (!response.ok) { setErrors(toErrorMessages(result.errors ?? result.message ?? `엑셀 등록에 실패했습니다. (${response.status})`)); setQuestions(result.questions ?? []); return; }
      setQuestions(result.questions ?? []);
      setMessage(`${result.exam?.title ?? "시험"}이(가) ${result.exam?.questionCount ?? 0}문항으로 등록되었습니다.`);
    } catch { setErrors(["서버와 통신하지 못했습니다. 잠시 후 다시 시도해 주세요."]); }
    finally { setLoading(false); }
  }

  return <section className="mt-6 rounded-[28px] border border-[#e0e3e7] bg-white p-7 sm:p-9"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-sm font-bold text-[#2563eb]">시험 콘텐츠</p><h2 className="mt-1 text-xl font-extrabold">엑셀로 시험 등록</h2><p className="mt-1 text-sm text-[#858c96]">문제 목록을 엑셀로 작성한 뒤 업로드하면 시험과 문제가 함께 등록됩니다.</p></div><a href="/exam-question-template.csv" download className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dfe3e8] px-4 text-xs font-bold text-[#4f5660] transition-colors hover:bg-[#f7f8fa]"><FileCsvIcon size={17} />엑셀 양식 다운로드</a></div>
    <form onSubmit={submit} className="mt-7 flex flex-col gap-7"><section className="rounded-3xl border border-[#eceef1] bg-[#fafbfc] p-5 sm:p-6"><h3 className="font-extrabold text-[#30353c]">시험 기본 정보</h3><div className="mt-5 flex flex-wrap gap-4"><label className={`${labelClass} min-w-[240px] flex-1`}>자격증 시험명<input required value={exam.title} onChange={(event) => updateExam("title", event.target.value)} placeholder="예: 시험명" className={inputClass} /></label><label className={`${labelClass} min-w-[150px] flex-1`}>급수<input value={exam.level} onChange={(event) => updateExam("level", event.target.value)} placeholder="선택 입력" className={inputClass} /></label><label className={`${labelClass} min-w-[150px] flex-1`}>출제 연도<input required type="number" min="1900" max="2100" value={exam.year} onChange={(event) => updateExam("year", event.target.value)} className={inputClass} /></label><label className={`${labelClass} min-w-[150px] flex-1`}>출제 월<input type="number" min="1" max="12" value={exam.month} onChange={(event) => updateExam("month", event.target.value)} placeholder="선택 입력" className={inputClass} /></label><label className={`${labelClass} min-w-[150px] flex-1`}>회차<input type="number" min="1" value={exam.round} onChange={(event) => updateExam("round", event.target.value)} placeholder="선택 입력" className={inputClass} /></label></div><div className="mt-4 flex flex-wrap gap-4"><label className={`${labelClass} min-w-[240px] flex-1`}>분류<input value={exam.category} onChange={(event) => updateExam("category", event.target.value)} placeholder="선택 입력" className={inputClass} /></label><label className={`${labelClass} min-w-[240px] flex-1`}>출제 기관<input value={exam.organization} onChange={(event) => updateExam("organization", event.target.value)} placeholder="선택 입력" className={inputClass} /></label></div><div className="mt-4 flex flex-wrap gap-4"><label className={`${labelClass} min-w-[240px] flex-1`}>출처명<input value={exam.sourceName} onChange={(event) => updateExam("sourceName", event.target.value)} placeholder="선택 입력" className={inputClass} /></label><label className={`${labelClass} min-w-[240px] flex-[2]`}>출처 URL<input type="url" value={exam.sourceUrl} onChange={(event) => updateExam("sourceUrl", event.target.value)} placeholder="선택 입력" className={inputClass} /></label><label className={`${labelClass} min-w-[180px] flex-1`}>공개 상태<select value={exam.status} onChange={(event) => updateExam("status", event.target.value)} className={inputClass}><option value="draft">임시 저장</option><option value="published">공개</option></select></label></div></section>
      <section className="rounded-3xl border border-[#eceef1] p-5 sm:p-6"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eef3ff] text-[#2563eb]"><FileArrowUpIcon size={21} /></span><div><h3 className="font-extrabold text-[#30353c]">문제 엑셀 업로드</h3><p className="mt-1 text-sm leading-6 text-[#858c96]">지원 형식: .xlsx, .xls, .csv · 첫 번째 행은 컬럼명이어야 합니다.</p></div></div><label className="mt-5 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d7dce3] bg-[#fafbfc] px-5 text-center transition-colors hover:border-[#8ca6d7] hover:bg-[#f5f8ff]"><input type="file" accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setErrors([]); setMessage(null); }} className="sr-only" /><FileArrowUpIcon size={28} className="text-[#7e9ee0]" /><span className="mt-2 text-sm font-bold text-[#4f5660]">{file ? file.name : "파일을 선택하거나 이곳에 놓으세요"}</span><span className="mt-1 text-xs text-[#9aa0a8]">문제마다 한 행씩 작성</span></label><div className="mt-4 rounded-2xl bg-[#f7f8fa] p-4 text-xs leading-6 text-[#737b86]"><p className="font-bold text-[#4f5660]">필수 컬럼</p><p>타입 · 문제내용 · 정답</p><p className="mt-1">객관식은 선택지1~4가 필요하며 선택지5는 선택입니다. 주관식은 선택지를 비워두고 정답을 직접 입력합니다. 해설은 선택 입력입니다.</p></div></section>
      {errors.length > 0 && <div role="alert" className="rounded-2xl border border-[#ffd1d1] bg-[#fff5f5] p-4 text-sm text-[#b63f3f]"><div className="flex items-center gap-2 font-bold"><WarningCircleIcon size={18} />엑셀을 확인해 주세요.</div><ul className="mt-2 flex list-disc flex-col gap-1 pl-5">{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
      {message && <p role="status" className="rounded-2xl bg-[#eef8f1] px-4 py-3 text-sm font-bold text-[#24824b]">{message}</p>}
      <button type="submit" disabled={loading} className="flex h-13 items-center justify-center rounded-2xl bg-[#17191c] px-6 text-sm font-bold text-white transition-colors hover:bg-[#2563eb] disabled:opacity-50">{loading ? "엑셀 확인 및 등록 중..." : "엑셀 확인 후 등록"}</button>
    </form>
    {questions.length > 0 && <section className="mt-7 rounded-3xl border border-[#b9ccef] bg-[#f5f8ff] p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold text-[#2563eb]">등록 미리보기</p><h3 className="mt-1 text-lg font-extrabold text-[#24282e]">총 {questions.length}문항</h3></div><span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#5f718e]">과목 없음</span></div><div className="mt-4 flex max-h-[520px] flex-col overflow-auto rounded-2xl border border-[#dfe6f5] bg-white">{questions.map((question, index) => <article key={`${question.prompt}-${index}`} className="border-b border-[#edf0f5] p-4 last:border-0"><div className="flex items-start justify-between gap-4"><p className="text-sm font-bold leading-6 text-[#30353c]">{index + 1}. {question.prompt}</p><span className="shrink-0 rounded-full bg-[#eef3ff] px-2 py-1 text-[11px] font-bold text-[#2563eb]">{question.questionType === "objective" ? "객관식" : "주관식"}</span></div>{question.options && <p className="mt-2 text-xs leading-5 text-[#7d8794]">{question.options.map((option, optionIndex) => `${optionIndex + 1}. ${option}`).join(" · ")}</p>}<p className="mt-2 text-xs font-semibold text-[#6f7680]">정답: {question.questionType === "objective" ? `${Number(question.correctAnswer) + 1}번` : question.correctAnswer}{question.explanation ? ` · ${question.explanation}` : ""}</p></article>)}</div></section>}
  </section>;
}
