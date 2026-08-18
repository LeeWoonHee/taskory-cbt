"use client";

import { ClipboardTextIcon, ShieldCheckIcon, UsersThreeIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

type AdminData = Awaited<ReturnType<typeof import("@/services/admin-service").getAdminOverview>>;
type AdminTab = "members" | "exams";

export function AdminDashboard({ initialData, adminName }: { initialData: AdminData; adminName: string }) {
  const data = initialData;
  const [busyExamId, setBusyExamId] = useState<string | null>(null);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("members");
  const cards = [
    { label: "전체 회원", value: `${data.stats.userCount}명`, icon: UsersThreeIcon },
    { label: "전체 응시", value: `${data.stats.attemptCount}회`, icon: ClipboardTextIcon },
    { label: "등록 시험", value: `${data.stats.examCount}개`, icon: ShieldCheckIcon },
  ];

  async function publishExam(examId: string) {
    setBusyExamId(examId);
    try {
      const response = await fetch(`/api/admin/exams/${examId}/status`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: "published" }) });
      if (!response.ok) throw new Error("시험 공개에 실패했습니다.");
      window.location.reload();
    } finally { setBusyExamId(null); }
  }

  async function removeExam(examId: string, title: string) {
    if (!window.confirm(`“${title}” 시험을 삭제할까요? 등록된 문제도 함께 삭제됩니다.`)) return;
    setBusyExamId(examId);
    try {
      const response = await fetch(`/api/admin/exams/${examId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("시험 삭제에 실패했습니다.");
      window.location.reload();
    } finally { setBusyExamId(null); }
  }

  function startEditingExam(examId: string, title: string) {
    setEditingExamId(examId);
    setEditingTitle(title);
  }

  function cancelEditingExam() {
    setEditingExamId(null);
    setEditingTitle("");
  }

  async function saveExamTitle(examId: string) {
    const title = editingTitle.trim();
    if (!title) {
      window.alert("시험명을 입력해 주세요.");
      return;
    }
    setBusyExamId(examId);
    try {
      const response = await fetch(`/api/admin/exams/${examId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ title }) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "시험명 변경에 실패했습니다.");
      window.location.reload();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "시험명 변경에 실패했습니다.");
      setBusyExamId(null);
    }
  }

  async function removeUser(userId: string, name: string) {
    if (!window.confirm(`${name} 회원을 삭제할까요? 계정은 삭제되지만 응시 기록은 보존됩니다.`)) return;
    setBusyUserId(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("회원 삭제에 실패했습니다.");
      window.location.reload();
    } finally { setBusyUserId(null); }
  }

  return (
    <main className="flex-1 bg-[#f7f8fa]"><div className="mx-auto w-full max-w-[1280px] px-5 py-10 sm:px-8 lg:py-16">
      <section className="flex flex-col justify-between gap-5 rounded-[28px] bg-[#17191c] p-7 text-white sm:p-10 lg:flex-row lg:items-end"><div><p className="text-sm font-bold text-[#8eb2ff]">관리자 콘솔</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">안녕하세요, {adminName}님</h1><p className="mt-3 text-sm text-[#aeb5bf]">회원 정보를 확인하고 서비스 콘텐츠를 관리할 수 있습니다.</p></div><Link href="/admin/exams/new" className="flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-[#17191c] transition-colors hover:bg-[#dfe9ff]">시험 등록</Link></section>

      <div className="mt-6 flex rounded-2xl border border-[#e0e3e7] bg-white p-1" role="tablist" aria-label="관리자 관리 메뉴"><button type="button" role="tab" aria-selected={activeTab === "members"} onClick={() => setActiveTab("members")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${activeTab === "members" ? "bg-[#17191c] text-white" : "text-[#727983] hover:bg-[#f7f8fa]"}`}>회원 관리</button><button type="button" role="tab" aria-selected={activeTab === "exams"} onClick={() => setActiveTab("exams")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${activeTab === "exams" ? "bg-[#17191c] text-white" : "text-[#727983] hover:bg-[#f7f8fa]"}`}>시험 관리</button></div>

      {activeTab === "members" && <section className="mt-6 rounded-[28px] border border-[#e0e3e7] bg-white p-7 sm:p-9"><div><p className="text-sm font-bold text-[#2563eb]">회원 현황</p><h2 className="mt-1 text-xl font-extrabold">회원 관리</h2><p className="mt-1 text-sm text-[#858c96]">회원 정보와 회원별 시험 응시 결과를 확인합니다.</p></div><div className="mt-6 flex flex-col gap-4">{data.users.length ? data.users.map((user) => { const average = user.attempts.length ? Math.round(user.attempts.reduce((sum, attempt) => sum + attempt.score, 0) / user.attempts.length) : null; return <article key={user.id} className="rounded-3xl border border-[#eceef1] bg-[#fafbfc] p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-extrabold text-[#30353c]">{user.name}</p><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${user.role === "admin" ? "bg-[#17191c] text-white" : "bg-[#eef3ff] text-[#2563eb]"}`}>{user.role === "admin" ? "관리자" : "회원"}</span></div><p className="mt-1 truncate text-sm text-[#6f7680]">{user.email}</p><div className="mt-1 flex flex-wrap gap-3 text-xs text-[#9aa0a8]"><span>가입일 {new Date(user.createdAt).toLocaleDateString("ko-KR")}</span><span>시험 평균 {average === null ? "—" : `${average}점`}</span></div></div><button type="button" disabled={busyUserId !== null || user.role === "admin"} onClick={() => removeUser(user.id, user.name)} className="shrink-0 rounded-xl border border-[#ffd2d2] px-3 py-2 text-xs font-bold text-[#c64545] transition-colors hover:bg-[#fff5f5] disabled:cursor-not-allowed disabled:opacity-45" title={user.role === "admin" ? "관리자 계정은 삭제할 수 없습니다." : undefined}>{busyUserId === user.id ? "삭제 중..." : user.role === "admin" ? "관리자 보호" : "회원 삭제"}</button></div><div className="mt-5 rounded-2xl border border-[#e7eaee] bg-white p-4"><div className="flex items-center justify-between"><p className="text-sm font-extrabold text-[#454c55]">응시 시험</p><span className="text-xs font-semibold text-[#9299a2]">{user.attempts.length}회</span></div>{user.attempts.length ? <div className="mt-3 flex flex-col">{user.attempts.map((attempt) => <div key={attempt.id} className="flex flex-col gap-2 border-t border-[#eceef1] py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-[#30353c]">{attempt.examTitle}</p><p className="mt-1 text-xs text-[#8a9099]">{new Date(attempt.completedAt).toLocaleDateString("ko-KR")} · {attempt.correctCount}/{attempt.totalCount}문항 정답</p></div><strong className="text-lg text-[#2563eb]">{attempt.score}점</strong></div>)}</div> : <p className="mt-3 border-t border-[#eceef1] pt-3 text-sm text-[#9299a2]">아직 응시한 시험이 없습니다.</p>}</div></article>; }) : <p className="rounded-2xl border border-[#eceef1] py-8 text-center text-sm text-[#858c96]">회원이 없습니다.</p>}</div></section>}

      {activeTab === "exams" && <section className="mt-6 rounded-[28px] border border-[#e0e3e7] bg-white p-7 sm:p-9"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-[#2563eb]">시험 관리</p><h2 className="mt-1 text-xl font-extrabold">등록 시험 <span className="ml-1 text-sm font-semibold text-[#9299a2]">{data.exams.length}개</span></h2><p className="mt-1 text-sm text-[#858c96]">시험별로 공개 상태와 문항을 확인하고 관리합니다.</p></div><Link href="/admin/exams/new" className="shrink-0 text-sm font-bold text-[#2563eb]">시험 등록</Link></div><div className="mt-6 flex flex-wrap gap-4">{data.exams.length ? data.exams.map((exam) => <article key={exam.id} className="flex min-w-[280px] flex-1 flex-col justify-between gap-5 rounded-3xl border border-[#e0e3e7] bg-[#fafbfc] p-5 transition-shadow hover:shadow-[0_8px_24px_rgba(23,25,28,0.08)] sm:p-6"><div className="min-w-0">{editingExamId === exam.id ? <div className="flex flex-col gap-2"><input autoFocus value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} maxLength={200} aria-label="시험명" className="h-10 min-w-0 rounded-xl border border-[#8ca6d7] bg-white px-3 text-sm font-bold outline-none" onKeyDown={(event) => { if (event.key === "Enter") void saveExamTitle(exam.id); if (event.key === "Escape") cancelEditingExam(); }} /><div className="flex items-center gap-2"><button type="button" disabled={busyExamId !== null} onClick={() => void saveExamTitle(exam.id)} className="rounded-xl bg-[#17191c] px-3 py-2 text-xs font-bold text-white disabled:opacity-60">{busyExamId === exam.id ? "저장 중..." : "저장"}</button><button type="button" disabled={busyExamId !== null} onClick={cancelEditingExam} className="rounded-xl border border-[#dfe3e8] px-3 py-2 text-xs font-bold text-[#626a74] disabled:opacity-60">취소</button></div></div> : <div className="flex items-start justify-between gap-3"><p className="min-w-0 flex-1 break-words font-extrabold leading-6 text-[#30353c]">{exam.title}</p><button type="button" disabled={busyExamId !== null} onClick={() => startEditingExam(exam.id, exam.title)} className="shrink-0 rounded-lg border border-[#dfe3e8] px-2 py-1 text-[11px] font-bold text-[#626a74] hover:bg-white disabled:opacity-60">이름 변경</button></div>}<p className="mt-3 text-xs leading-5 text-[#858c96]">{exam.level ? `${exam.level} · ` : ""}{exam.examYear}년{exam.examMonth ? ` ${exam.examMonth}월` : ""}{exam.examRound ? ` · ${exam.examRound}회` : ""} · {exam.questionCount}문항</p></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7eaee] pt-4"><span className={exam.status === "published" ? "rounded-full bg-[#eef8f1] px-2.5 py-1 text-[11px] font-bold text-[#24824b]" : "rounded-full bg-[#fff7e6] px-2.5 py-1 text-[11px] font-bold text-[#b87800]"}>{exam.status === "published" ? "공개" : "임시 저장"}</span><div className="flex flex-wrap items-center gap-2">{exam.status !== "published" && <button type="button" disabled={busyExamId !== null} onClick={() => publishExam(exam.id)} className="rounded-xl bg-[#17191c] px-3 py-2 text-xs font-bold text-white disabled:cursor-wait disabled:opacity-60">{busyExamId === exam.id ? "공개 중..." : "공개하기"}</button>}<button type="button" disabled={busyExamId !== null} onClick={() => removeExam(exam.id, exam.title)} className="rounded-xl border border-[#ffd2d2] px-3 py-2 text-xs font-bold text-[#c64545] disabled:cursor-wait disabled:opacity-60">{busyExamId === exam.id ? "처리 중..." : "삭제"}</button></div></div></article>) : <p className="w-full rounded-2xl border border-[#eceef1] py-8 text-center text-sm text-[#858c96]">등록된 시험이 없습니다.</p>}</div></section>}

      <section className="mt-6 flex flex-wrap gap-4">{cards.map((card) => <article key={card.label} className="flex min-h-32 min-w-[220px] flex-1 items-start justify-between rounded-3xl border border-[#e0e3e7] bg-white p-6"><div><p className="text-sm font-semibold text-[#858c96]">{card.label}</p><p className="mt-4 text-2xl font-extrabold text-[#24282e]">{card.value}</p></div><span className="flex size-11 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#2563eb]"><card.icon size={22} weight="duotone" /></span></article>)}</section>
    </div></main>
  );
}
