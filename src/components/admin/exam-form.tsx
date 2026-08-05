"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Info } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useDemoData } from "@/components/admin/demo-data-provider";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ExamDraftField, ExamDraftInput } from "@/types/admin";

const initialValues: ExamDraftInput = {
  title: "", code: "", category: "기타", description: "",
  durationMinutes: 60, questionCount: 20, passScore: 60,
  visibility: "PRIVATE", startsAt: "", endsAt: "",
};

const fieldLabels: Record<ExamDraftField, string> = {
  title: "시험명", code: "시험 코드", category: "분류", description: "설명",
  durationMinutes: "제한 시간", questionCount: "계획 문항 수", passScore: "합격 점수",
  visibility: "공개 범위", startsAt: "응시 시작", endsAt: "응시 종료",
};

const inputClasses = "h-11 w-full rounded-lg border border-zinc-500 bg-white px-3 text-base text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-600/20 aria-[invalid=true]:border-red-700 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-600/15 sm:text-sm";

function Field({ name, label, required, help, error, children }: { name: ExamDraftField; label: string; required?: boolean; help?: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex min-w-[min(100%,14rem)] flex-1 flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-zinc-800">{label} ({required ? "필수" : "선택"})</label>
      {help ? <p id={`${name}-help`} className="text-xs leading-5 text-zinc-500">{help}</p> : null}
      {children}
      {error ? <p id={`${name}-error`} className="flex items-start gap-1.5 text-sm font-medium text-red-800"><AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />{error}</p> : null}
    </div>
  );
}

export function ExamForm() {
  const router = useRouter();
  const { createExamDraft } = useDemoData();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<ExamDraftField, string>>>({});
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState("/admin/exams");
  const [formError, setFormError] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    const interceptLink = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.href === window.location.href) return;
      event.preventDefault();
      setPendingHref(`${url.pathname}${url.search}${url.hash}`);
      setLeaveOpen(true);
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", interceptLink, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", interceptLink, true);
    };
  }, [dirty]);

  function update<K extends keyof ExamDraftInput>(key: K, value: ExamDraftInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setFormError("");
  }

  function describedBy(name: ExamDraftField, help = false) {
    return [help ? `${name}-help` : "", errors[name] ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined;
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setFormError("");
    window.setTimeout(() => {
      const result = createExamDraft(values);
      setBusy(false);
      if (!result.ok || !result.data) {
        setErrors(result.fieldErrors ?? {});
        setFormError(result.formError ?? "");
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setErrors({});
      setDirty(false);
      router.push(`/admin/exams/${result.data.id}?created=1`);
    }, 300);
  }

  const errorEntries = Object.entries(errors) as Array<[ExamDraftField, string]>;

  return (
    <>
      <Link href="/admin/exams" className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><ArrowLeft size={17} aria-hidden="true" /> 시험 목록으로</Link>
      <header className="mb-6"><h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">시험 간편 등록</h1><p className="mt-2 text-sm leading-6 text-zinc-600 sm:text-base">필수 운영 정보만 입력해 임시 저장 상태의 시험을 만듭니다.</p></header>

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><p>간편 등록한 시험은 임시 저장 상태로 생성됩니다. 데모 변경은 이 브라우저의 localStorage에만 저장됩니다.</p></div>

      <form onSubmit={submit} noValidate className="mx-auto flex max-w-[880px] flex-col gap-5">
        {errorEntries.length > 0 ? (
          <div ref={summaryRef} tabIndex={-1} className="rounded-xl border border-red-300 bg-red-50 p-4 focus:outline-none focus:ring-2 focus:ring-red-700" aria-labelledby="form-error-title">
            <h2 id="form-error-title" className="font-bold text-red-900">입력 내용을 확인해 주세요.</h2>
            <p className="mt-1 text-sm text-red-800">{errorEntries.length}개의 항목을 수정해야 합니다.</p>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm">{errorEntries.map(([field, error]) => <li key={field}><a href={`#${field}`} className="font-medium text-red-900 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700">{fieldLabels[field]}: {error}</a></li>)}</ul>
          </div>
        ) : null}
        {formError ? <div role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900"><p className="font-semibold">시험을 저장하지 못했습니다. 입력 내용은 유지되었습니다.</p><p className="mt-1">{formError}</p></div> : null}

        <Card className="p-5 sm:p-6">
          <h2 className="text-lg font-bold text-zinc-950">기본 정보</h2>
          <div className="mt-5 flex flex-col gap-5">
            <Field name="title" label="시험명" required error={errors.title}><input id="title" value={values.title} maxLength={101} onChange={(event) => update("title", event.target.value)} aria-invalid={Boolean(errors.title)} aria-describedby={describedBy("title")} className={inputClasses} /></Field>
            <div className="flex flex-wrap gap-5">
              <Field name="code" label="시험 코드" required help="영문 대문자, 숫자, 하이픈 3~20자" error={errors.code}><input id="code" value={values.code} onChange={(event) => update("code", event.target.value.toUpperCase())} aria-invalid={Boolean(errors.code)} aria-describedby={describedBy("code", true)} autoCapitalize="characters" className={inputClasses} /></Field>
              <Field name="category" label="분류" required error={errors.category}><select id="category" value={values.category} onChange={(event) => update("category", event.target.value as ExamDraftInput["category"])} aria-invalid={Boolean(errors.category)} aria-describedby={describedBy("category")} className={inputClasses}><option value="직무">직무</option><option value="자격">자격</option><option value="교육">교육</option><option value="기타">기타</option></select></Field>
            </div>
            <Field name="description" label="설명" help="최대 500자, 일반 텍스트로 저장됩니다." error={errors.description}><textarea id="description" value={values.description} onChange={(event) => update("description", event.target.value)} aria-invalid={Boolean(errors.description)} aria-describedby={describedBy("description", true)} className="min-h-32 w-full rounded-lg border border-zinc-500 bg-white p-3 text-base outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-600/20 aria-[invalid=true]:border-red-700 sm:text-sm" /><p className="text-right text-xs tabular-nums text-zinc-500">{values.description.length}/500</p></Field>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <h2 className="text-lg font-bold text-zinc-950">운영 설정</h2>
          <div className="mt-5 flex flex-col gap-5">
            <div className="flex flex-wrap gap-5">
              <Field name="durationMinutes" label="제한 시간" required help="5~300분" error={errors.durationMinutes}><input id="durationMinutes" type="number" min={5} max={300} value={values.durationMinutes} onChange={(event) => update("durationMinutes", Number(event.target.value))} aria-invalid={Boolean(errors.durationMinutes)} aria-describedby={describedBy("durationMinutes", true)} className={inputClasses} /></Field>
              <Field name="questionCount" label="계획 문항 수" required help="1~200개, P0에서는 계획값" error={errors.questionCount}><input id="questionCount" type="number" min={1} max={200} value={values.questionCount} onChange={(event) => update("questionCount", Number(event.target.value))} aria-invalid={Boolean(errors.questionCount)} aria-describedby={describedBy("questionCount", true)} className={inputClasses} /></Field>
              <Field name="passScore" label="합격 점수" required help="0~100점" error={errors.passScore}><input id="passScore" type="number" min={0} max={100} value={values.passScore} onChange={(event) => update("passScore", Number(event.target.value))} aria-invalid={Boolean(errors.passScore)} aria-describedby={describedBy("passScore", true)} className={inputClasses} /></Field>
            </div>
            <Field name="visibility" label="공개 범위" required help="초안 저장 후에도 게시되지 않습니다." error={errors.visibility}><select id="visibility" value={values.visibility} onChange={(event) => update("visibility", event.target.value as ExamDraftInput["visibility"])} aria-invalid={Boolean(errors.visibility)} aria-describedby={describedBy("visibility", true)} className={inputClasses}><option value="PRIVATE">비공개</option><option value="LINK">링크 공개</option><option value="PUBLIC">전체 공개</option></select></Field>
            <fieldset><legend className="text-sm font-semibold text-zinc-800">응시 기간 (선택)</legend><p className="mt-2 text-xs leading-5 text-zinc-500">두 값을 모두 입력하거나 모두 비워 주세요. 대한민국 표준시(서울)로 해석합니다.</p><div className="mt-4 flex flex-wrap gap-5"><Field name="startsAt" label="응시 시작" error={errors.startsAt}><input id="startsAt" type="datetime-local" value={values.startsAt} onChange={(event) => update("startsAt", event.target.value)} aria-invalid={Boolean(errors.startsAt)} aria-describedby={describedBy("startsAt")} className={inputClasses} /></Field><Field name="endsAt" label="응시 종료" error={errors.endsAt}><input id="endsAt" type="datetime-local" value={values.endsAt} onChange={(event) => update("endsAt", event.target.value)} aria-invalid={Boolean(errors.endsAt)} aria-describedby={describedBy("endsAt")} className={inputClasses} /></Field></div></fieldset>
          </div>
        </Card>

        <div className="flex flex-col gap-3 pb-6 sm:flex-row-reverse sm:justify-start">
          <Button type="submit" disabled={busy} className="min-w-32">{busy ? "저장하는 중…" : "임시 저장"}</Button>
          <Button variant="outline" onClick={() => dirty ? setLeaveOpen(true) : router.push("/admin/exams")}>취소</Button>
        </div>
      </form>

      <AlertDialog open={leaveOpen} title="작성 중인 내용을 나갈까요?" description="저장하지 않은 입력 내용이 사라집니다." cancelLabel="계속 작성" actionLabel="저장하지 않고 나가기" busy={false} onClose={() => setLeaveOpen(false)} onAction={() => { setDirty(false); setLeaveOpen(false); router.push(pendingHref); }} />
    </>
  );
}

