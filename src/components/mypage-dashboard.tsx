"use client";

import { ArrowRightIcon, ChartBarIcon, ClipboardTextIcon, TargetIcon, UserCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Attempt = { id: string; examTitle: string; score: number; correctCount: number; totalCount: number; completedAt: string };
type MeResponse = { user: { name: string; email: string }; attempts: Attempt[] };

function MypageSkeleton() {
  return (
    <main className="flex-1 bg-white" aria-busy="true" aria-label="회원 정보를 불러오는 중입니다">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8 lg:py-20">
        <section className="flex flex-col gap-8 rounded-[28px] border border-[#dfe3e8] bg-[#f7f8fa] p-7 sm:p-10 lg:p-12">
          <div className="flex items-center gap-5">
            <div className="size-16 shrink-0 animate-pulse rounded-3xl bg-[#e5e9ef]" />
            <div className="flex w-full max-w-sm flex-col gap-3">
              <div className="h-4 w-24 animate-pulse rounded bg-[#dfe4eb]" />
              <div className="h-9 w-64 max-w-full animate-pulse rounded bg-[#dfe4eb]" />
              <div className="h-4 w-48 max-w-full animate-pulse rounded bg-[#e5e9ef]" />
            </div>
          </div>
        </section>
        <section className="mt-8 flex flex-wrap gap-4">
          {["응시한 시험", "평균 점수", "최근 응시"].map((label) => <article key={label} className="flex min-h-36 min-w-[220px] flex-1 items-start justify-between rounded-3xl border border-[#e0e3e7] bg-white p-6"><div className="flex flex-col gap-4"><div className="h-4 w-20 animate-pulse rounded bg-[#e5e9ef]" /><div className="h-7 w-24 animate-pulse rounded bg-[#dfe4eb]" /></div><div className="size-10 animate-pulse rounded-2xl bg-[#eef1f5]" /></article>)}
        </section>
        <section className="mt-8 rounded-[28px] border border-[#e0e3e7] bg-white p-7 sm:p-10">
          <div className="flex items-center justify-between"><div className="h-6 w-32 animate-pulse rounded bg-[#dfe4eb]" /><div className="h-4 w-16 animate-pulse rounded bg-[#e5e9ef]" /></div>
          <div className="mt-7 flex flex-col gap-5">{[1, 2, 3].map((item) => <div key={item} className="flex items-center justify-between border-t border-[#eceef1] py-5"><div className="flex flex-col gap-3"><div className="h-4 w-52 max-w-[60vw] animate-pulse rounded bg-[#dfe4eb]" /><div className="h-3 w-36 animate-pulse rounded bg-[#e5e9ef]" /></div><div className="h-6 w-14 animate-pulse rounded bg-[#dfe4eb]" /></div>)}</div>
        </section>
      </div>
    </main>
  );
}

export function MypageDashboard() {
  const [data, setData] = useState<MeResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/attempts/me").then(async (response) => response.ok ? response.json() as Promise<MeResponse> : null).then((result) => { setData(result); setLoaded(true); }).catch(() => setLoaded(true));
  }, []);

  const average = useMemo(() => data?.attempts.length ? Math.round(data.attempts.reduce((sum, attempt) => sum + attempt.score, 0) / data.attempts.length) : null, [data]);

  if (!loaded) return <MypageSkeleton />;

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-12 sm:px-8 lg:py-20">
        <section className="flex flex-col justify-between gap-8 rounded-[28px] border border-[#dfe3e8] bg-[#f7f8fa] p-7 sm:p-10 lg:flex-row lg:items-center lg:p-12">
          <div className="flex min-w-0 items-center gap-5"><span className="flex size-16 shrink-0 items-center justify-center rounded-3xl bg-white text-[#2563eb] shadow-sm"><UserCircleIcon size={34} weight="duotone" /></span><div className="min-w-0"><p className="text-sm font-bold text-[#2563eb]">마이페이지</p><h1 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] sm:text-3xl">{data ? `${data.user.name}님의 학습 기록` : "학습 기록"}</h1><p className="mt-2 text-sm text-[#7d848e]">{data ? data.user.email : "로그인하면 응시 결과와 오답 기록이 여기에 저장됩니다."}</p></div></div>
          {!data && loaded && <Link href="/login" className="flex h-12 items-center justify-between rounded-2xl bg-[#17191c] px-5 text-sm font-bold text-white lg:min-w-44">로그인하기<ArrowRightIcon size={18} /></Link>}
        </section>
        <section className="mt-8 flex flex-wrap gap-4">
          {[{ label: "응시한 시험", value: data ? `${data.attempts.length}회` : "0회", icon: ClipboardTextIcon }, { label: "평균 점수", value: average === null ? "—" : `${average}점`, icon: ChartBarIcon }, { label: "최근 응시", value: data?.attempts[0]?.examTitle ?? "없음", icon: TargetIcon }].map((item) => <article key={item.label} className="flex min-h-36 min-w-[220px] flex-1 items-start justify-between rounded-3xl border border-[#e0e3e7] bg-white p-6"><div><p className="text-sm font-semibold text-[#858c96]">{item.label}</p><p className="mt-4 text-xl font-extrabold text-[#24282e]">{item.value}</p></div><span className="flex size-10 items-center justify-center rounded-2xl bg-[#f2f5f9] text-[#67717e]"><item.icon size={20} /></span></article>)}
        </section>
        <section className="mt-8 rounded-[28px] border border-[#e0e3e7] bg-white p-7 sm:p-10"><div className="flex items-center justify-between"><h2 className="text-xl font-extrabold">최근 시험 결과</h2><Link href="/exams" className="text-sm font-bold text-[#2563eb]">시험 찾기</Link></div>{data?.attempts.length ? <div className="mt-6 flex flex-col">{data.attempts.map((attempt) => <article key={attempt.id} className="flex flex-col justify-between gap-4 border-t border-[#eceef1] py-5 sm:flex-row sm:items-center"><div><p className="font-extrabold text-[#30353c]">{attempt.examTitle}</p><p className="mt-1 text-xs text-[#8a9099]">{new Date(attempt.completedAt).toLocaleDateString("ko-KR")} · {attempt.totalCount}문항 중 {attempt.correctCount}문항 정답</p></div><strong className="text-xl text-[#2563eb]">{attempt.score}점</strong></article>)}</div> : <div className="mt-7 flex min-h-60 flex-col items-center justify-center rounded-3xl bg-[#f8f9fa] text-center"><ClipboardTextIcon size={32} className="text-[#a2a8b0]" /><p className="mt-4 font-bold text-[#4c535d]">{loaded ? "아직 저장된 시험 결과가 없습니다." : "학습 기록을 불러오는 중입니다."}</p><p className="mt-2 text-sm text-[#8a9099]">시험을 완료하면 결과와 정답률을 확인할 수 있습니다.</p></div>}</section>
      </div>
    </main>
  );
}
