"use client";

import { ClipboardTextIcon, ShieldCheckIcon, UsersThreeIcon } from "@phosphor-icons/react";
import Link from "next/link";

type AdminData = Awaited<ReturnType<typeof import("@/services/admin-service").getAdminOverview>>;

export function AdminDashboard({ initialData, adminName }: { initialData: AdminData; adminName: string }) {
  const data = initialData;
  const cards = [
    { label: "전체 회원", value: `${data.stats.userCount}명`, icon: UsersThreeIcon },
    { label: "전체 응시", value: `${data.stats.attemptCount}회`, icon: ClipboardTextIcon },
    { label: "등록 시험", value: `${data.stats.examCount}개`, icon: ShieldCheckIcon },
  ];

  async function publishExam(examId: string) {
    await fetch(`/api/admin/exams/${examId}/status`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: "published" }) });
    window.location.reload();
  }

  return (
    <main className="flex-1 bg-[#f7f8fa]"><div className="mx-auto w-full max-w-[1280px] px-5 py-10 sm:px-8 lg:py-16">
      <section className="flex flex-col justify-between gap-5 rounded-[28px] bg-[#17191c] p-7 text-white sm:p-10 lg:flex-row lg:items-end"><div><p className="text-sm font-bold text-[#8eb2ff]">관리자 콘솔</p><h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">안녕하세요, {adminName}님</h1><p className="mt-3 text-sm text-[#aeb5bf]">회원 정보를 확인하고 서비스 콘텐츠를 관리할 수 있습니다.</p></div><Link href="/admin/exams/new" className="flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-bold text-[#17191c] transition-colors hover:bg-[#dfe9ff]">시험 등록</Link></section>

      <section className="mt-6 rounded-[28px] border border-[#e0e3e7] bg-white p-7 sm:p-9"><div><p className="text-sm font-bold text-[#2563eb]">회원 현황</p><h2 className="mt-1 text-xl font-extrabold">회원 관리</h2><p className="mt-1 text-sm text-[#858c96]">회원 정보와 회원별 시험 응시 결과를 확인합니다.</p></div><div className="mt-6 flex flex-col gap-4">{data.users.length ? data.users.map((user) => { const average = user.attempts.length ? Math.round(user.attempts.reduce((sum, attempt) => sum + attempt.score, 0) / user.attempts.length) : null; return <article key={user.id} className="rounded-3xl border border-[#eceef1] bg-[#fafbfc] p-5 sm:p-6"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-extrabold text-[#30353c]">{user.name}</p><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${user.role === "admin" ? "bg-[#17191c] text-white" : "bg-[#eef3ff] text-[#2563eb]"}`}>{user.role === "admin" ? "관리자" : "회원"}</span></div><p className="mt-1 truncate text-sm text-[#6f7680]">{user.email}</p><div className="mt-1 flex flex-wrap gap-3 text-xs text-[#9aa0a8]"><span>가입일 {new Date(user.createdAt).toLocaleDateString("ko-KR")}</span><span>시험 평균 {average === null ? "—" : `${average}점`}</span></div></div><div className="mt-5 rounded-2xl border border-[#e7eaee] bg-white p-4"><div className="flex items-center justify-between"><p className="text-sm font-extrabold text-[#454c55]">응시 시험</p><span className="text-xs font-semibold text-[#9299a2]">{user.attempts.length}회</span></div>{user.attempts.length ? <div className="mt-3 flex flex-col">{user.attempts.map((attempt) => <div key={attempt.id} className="flex flex-col gap-2 border-t border-[#eceef1] py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-[#30353c]">{attempt.examTitle}</p><p className="mt-1 text-xs text-[#8a9099]">{new Date(attempt.completedAt).toLocaleDateString("ko-KR")} · {attempt.correctCount}/{attempt.totalCount}문항 정답</p></div><strong className="text-lg text-[#2563eb]">{attempt.score}점</strong></div>)}</div> : <p className="mt-3 border-t border-[#eceef1] pt-3 text-sm text-[#9299a2]">아직 응시한 시험이 없습니다.</p>}</div></article>; }) : <p className="rounded-2xl border border-[#eceef1] py-8 text-center text-sm text-[#858c96]">회원이 없습니다.</p>}</div></section>

      <section className="mt-6 rounded-[28px] border border-[#e0e3e7] bg-white p-7 sm:p-9"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-[#2563eb]">시험 관리</p><h2 className="mt-1 text-xl font-extrabold">등록 시험</h2><p className="mt-1 text-sm text-[#858c96]">등록된 시험의 공개 상태와 문항 수를 확인합니다.</p></div><Link href="/admin/exams/new" className="shrink-0 text-sm font-bold text-[#2563eb]">시험 등록</Link></div><div className="mt-6 flex flex-col gap-3">{data.exams.length ? data.exams.map((exam) => <article key={exam.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#eceef1] bg-[#fafbfc] p-4 sm:flex-row sm:items-center"><div><p className="font-bold text-[#30353c]">{exam.title}</p><p className="mt-1 text-xs text-[#858c96]">{exam.level ? `${exam.level} · ` : ""}{exam.examYear}년{exam.examMonth ? ` ${exam.examMonth}월` : ""}{exam.examRound ? ` · ${exam.examRound}회` : ""} · {exam.questionCount}문항</p></div><div className="flex items-center gap-3"><span className={exam.status === "published" ? "rounded-full bg-[#eef8f1] px-2.5 py-1 text-[11px] font-bold text-[#24824b]" : "rounded-full bg-[#fff7e6] px-2.5 py-1 text-[11px] font-bold text-[#b87800]"}>{exam.status === "published" ? "공개" : "임시 저장"}</span>{exam.status !== "published" && <button type="button" onClick={() => publishExam(exam.id)} className="rounded-xl bg-[#17191c] px-3 py-2 text-xs font-bold text-white">공개하기</button>}</div></article>) : <p className="rounded-2xl border border-[#eceef1] py-8 text-center text-sm text-[#858c96]">등록된 시험이 없습니다.</p>}</div></section>

      <section className="mt-6 flex flex-wrap gap-4">{cards.map((card) => <article key={card.label} className="flex min-h-32 min-w-[220px] flex-1 items-start justify-between rounded-3xl border border-[#e0e3e7] bg-white p-6"><div><p className="text-sm font-semibold text-[#858c96]">{card.label}</p><p className="mt-4 text-2xl font-extrabold text-[#24282e]">{card.value}</p></div><span className="flex size-11 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#2563eb]"><card.icon size={22} weight="duotone" /></span></article>)}</section>
    </div></main>
  );
}
