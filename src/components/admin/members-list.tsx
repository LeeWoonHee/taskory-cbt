"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState, type FormEvent } from "react";
import { EmptyState } from "@/components/admin/empty-state";
import { useDemoData } from "@/components/admin/demo-data-provider";
import { MemberStatusBadge } from "@/components/ui/badge";
import { buttonClasses, Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createListHref, formatDateTime, memberStatusLabel } from "@/lib/admin-format";
import { cn } from "@/lib/cn";
import type { Member, MemberStatus } from "@/types/admin";

const filters: Array<{ value: MemberStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "전체" },
  { value: "ACTIVE", label: "활성" },
  { value: "SUSPENDED", label: "정지" },
  { value: "WITHDRAWN", label: "탈퇴" },
];

function MemberTable({ members, returnTo }: { members: Member[]; returnTo: string }) {
  return (
    <Card className="hidden overflow-hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left text-sm">
          <caption className="sr-only">회원 검색 결과</caption>
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-600">
            <tr>
              <th scope="col" className="px-5 py-3">회원</th>
              <th scope="col" className="px-5 py-3">이메일</th>
              <th scope="col" className="px-5 py-3">상태</th>
              <th scope="col" className="px-5 py-3">가입일</th>
              <th scope="col" className="px-5 py-3">최근 로그인</th>
              <th scope="col" className="px-5 py-3 text-right">응시</th>
              <th scope="col" className="px-5 py-3 text-right">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {members.map((member) => (
              <tr key={member.id} className="min-h-16 hover:bg-zinc-50">
                <td className="px-5 py-4">
                  <p className="font-semibold text-zinc-950">{member.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">{member.memberNo}</p>
                </td>
                <td className="max-w-64 break-all px-5 py-4 text-zinc-700">{member.email}</td>
                <td className="px-5 py-4"><MemberStatusBadge status={member.status} /></td>
                <td className="whitespace-nowrap px-5 py-4 tabular-nums text-zinc-700">{formatDateTime(member.joinedAt)}</td>
                <td className="whitespace-nowrap px-5 py-4 tabular-nums text-zinc-700">{member.lastLoginAt ? formatDateTime(member.lastLoginAt) : "로그인 기록 없음"}</td>
                <td className="px-5 py-4 text-right tabular-nums text-zinc-700">{member.examAttemptCount}회</td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/members/${member.id}?returnTo=${encodeURIComponent(returnTo)}`} className="inline-flex min-h-11 items-center rounded-lg px-3 font-semibold text-blue-700 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">상세 보기</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function MemberCards({ members, returnTo }: { members: Member[]; returnTo: string }) {
  return (
    <div className="flex flex-col gap-3 md:hidden">
      {members.map((member) => (
        <Card key={member.id} className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="font-semibold text-zinc-950">{member.name}</h2>
              <p className="mt-1 break-all text-sm text-zinc-600">{member.email}</p>
            </div>
            <MemberStatusBadge status={member.status} />
          </div>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-zinc-500">회원 번호</dt><dd className="text-right font-medium text-zinc-800">{member.memberNo}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-zinc-500">가입일</dt><dd className="text-right tabular-nums text-zinc-800">{formatDateTime(member.joinedAt)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-zinc-500">최근 로그인</dt><dd className="text-right tabular-nums text-zinc-800">{member.lastLoginAt ? formatDateTime(member.lastLoginAt) : "로그인 기록 없음"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-zinc-500">응시</dt><dd className="text-right text-zinc-800">{member.examAttemptCount}회</dd></div>
          </dl>
          <Link href={`/admin/members/${member.id}?returnTo=${encodeURIComponent(returnTo)}`} className={buttonClasses("outline", "mt-4 w-full")}>상세 보기</Link>
        </Card>
      ))}
    </div>
  );
}

export function MembersList({ initialQuery, initialStatus }: { initialQuery: string; initialStatus: MemberStatus | "ALL" }) {
  const router = useRouter();
  const { listMembers } = useDemoData();
  const [query, setQuery] = useState(initialQuery);
  const reducedMotion = useReducedMotion();
  const result = listMembers({ query: initialQuery, status: initialStatus });
  const returnTo = createListHref("/admin/members", initialQuery, initialStatus);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    router.push(createListHref("/admin/members", query.trim(), initialStatus));
  }

  function setStatus(status: MemberStatus | "ALL") {
    router.push(createListHref("/admin/members", initialQuery, status));
  }

  const summary = initialQuery && initialStatus !== "ALL"
    ? `${memberStatusLabel[initialStatus]} · “${initialQuery}” 검색 결과 ${result.total}명`
    : initialQuery
      ? `“${initialQuery}” 검색 결과 ${result.total}명 · 가입일 최신순`
      : initialStatus !== "ALL"
        ? `${memberStatusLabel[initialStatus]} 회원 ${result.total}명 · 가입일 최신순`
        : `전체 ${result.total}명 · 가입일 최신순`;

  return (
    <>
      <Card className="mb-5 p-4 sm:p-5">
        <form onSubmit={submitSearch} role="search" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="member-search" className="text-sm font-semibold text-zinc-800">회원 검색</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                <input id="member-search" name="q" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름, 이메일 또는 회원 번호 검색" className="h-11 w-full rounded-lg border border-zinc-500 bg-white pl-10 pr-3 text-base text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-blue-700 focus:ring-2 focus:ring-blue-600/20 sm:text-sm" />
              </div>
              <Button type="submit" className="sm:w-auto">검색</Button>
            </div>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-zinc-800">회원 상태</legend>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button key={filter.value} type="button" aria-pressed={initialStatus === filter.value} onClick={() => setStatus(filter.value)} className={cn("min-h-10 rounded-full border px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2", initialStatus === filter.value ? "border-blue-700 bg-blue-700 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50")}>{filter.label}</button>
              ))}
            </div>
          </fieldset>
        </form>
      </Card>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm font-medium text-zinc-700">{summary}</p>
        {(initialQuery || initialStatus !== "ALL") ? <Link href="/admin/members" className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">필터 초기화</Link> : null}
      </div>

      <motion.div initial={{ opacity: reducedMotion ? 1 : 0.75 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 0.14 }}>
        {result.items.length === 0 ? (
          <EmptyState title="조건에 맞는 회원이 없습니다." description="검색어나 상태 조건을 바꿔 보세요." action={<Link href="/admin/members" className={buttonClasses("outline")}>필터 초기화</Link>} />
        ) : (
          <>
            <MemberTable members={result.items} returnTo={returnTo} />
            <MemberCards members={result.items} returnTo={returnTo} />
          </>
        )}
      </motion.div>
    </>
  );
}

