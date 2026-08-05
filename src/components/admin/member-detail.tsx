"use client";

import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useDemoData } from "@/components/admin/demo-data-provider";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { MemberStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";
import { formatDateTime, memberStatusLabel } from "@/lib/admin-format";
import type { Member, MemberStatus } from "@/types/admin";

type PendingAction = "suspend" | "restore" | "withdraw" | null;

const actionCopy: Record<Exclude<PendingAction, null>, {
  title: (name: string) => string;
  description: string;
  to: MemberStatus;
  action: (name: string) => string;
}> = {
  suspend: {
    title: (name) => `${name} 회원을 정지할까요?`,
    description: "정지하면 로그인과 새로운 시험 응시를 할 수 없습니다. 데모에서는 다시 활성 상태로 복구할 수 있습니다.",
    to: "SUSPENDED",
    action: (name) => `${name} 회원 정지`,
  },
  restore: {
    title: (name) => `${name} 회원을 활성 상태로 복구할까요?`,
    description: "복구하면 다시 로그인하고 시험에 응시할 수 있습니다.",
    to: "ACTIVE",
    action: () => "활성으로 복구",
  },
  withdraw: {
    title: (name) => `${name} 회원을 탈퇴 처리할까요?`,
    description: "탈퇴 처리 후 P0에서는 복구할 수 없으며 회원 정보는 읽기 전용으로 보존됩니다. 실제 개인정보 처리 정책은 아직 확정되지 않았습니다.",
    to: "WITHDRAWN",
    action: () => "탈퇴 처리",
  },
};

function DefinitionCard({ title, items }: { title: string; items: Array<[string, string]> }) {
  return (
    <Card className="min-w-[min(100%,20rem)] flex-1 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-zinc-950">{title}</h2>
      <dl className="mt-5 flex flex-col gap-4">
        {items.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-sm text-zinc-500">{label}</dt>
            <dd className="break-all text-sm font-medium text-zinc-900 sm:text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export function MemberDetail({ memberId, initialMember, returnTo }: { memberId: string; initialMember: Member; returnTo: string }) {
  const { getMember, changeMemberStatus } = useDemoData();
  const member = getMember(memberId) ?? initialMember;
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [dialogError, setDialogError] = useState("");

  function runAction() {
    if (!pendingAction) return;
    setBusy(true);
    setDialogError("");
    const copy = actionCopy[pendingAction];
    window.setTimeout(() => {
      const result = changeMemberStatus({ id: member.id, fromStatus: member.status, toStatus: copy.to, reason });
      setBusy(false);
      if (!result.ok) {
        setDialogError(result.formError ?? `상태를 변경하지 못했습니다. 현재 상태는 ${memberStatusLabel[member.status]}으로 유지됩니다.`);
        return;
      }
      setPendingAction(null);
      setReason("");
      setMessage(copy.to === "SUSPENDED"
        ? `${member.name} 회원을 정지했습니다. 변경 내용은 이 브라우저에 저장됩니다.`
        : copy.to === "ACTIVE"
          ? `${member.name} 회원을 활성 상태로 복구했습니다.`
          : `${member.name} 회원을 탈퇴 처리했습니다.`);
    }, 280);
  }

  const dialog = pendingAction ? actionCopy[pendingAction] : null;

  return (
    <>
      <Link href={returnTo} className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
        <ArrowLeft size={17} aria-hidden="true" /> 회원 목록으로
      </Link>

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">{member.name}</h1>
          <MemberStatusBadge status={member.status} />
        </div>
        <p className="mt-2 break-all text-sm text-zinc-600">{member.email} · {member.memberNo}</p>
        <p className="mt-2 break-all text-xs text-zinc-500">회원 ID {member.id}</p>
      </header>

      <div className="flex flex-wrap gap-5">
        <DefinitionCard title="기본 정보" items={[
          ["이메일", member.email],
          ["연락처", member.phone ?? "등록된 연락처 없음"],
          ["회원 번호", member.memberNo],
          ["가입일", formatDateTime(member.joinedAt)],
        ]} />
        <DefinitionCard title="이용 현황" items={[
          ["최근 로그인", member.lastLoginAt ? formatDateTime(member.lastLoginAt) : "로그인 기록 없음"],
          ["응시 횟수", `${member.examAttemptCount}회`],
          ["합격 횟수", `${member.passedExamCount}회`],
        ]} />
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="border-b border-zinc-200 px-5 py-4 sm:px-6"><h2 className="text-lg font-bold text-zinc-950">최근 응시 내역</h2></div>
        {member.recentAttempts.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-zinc-600">응시 이력이 없습니다.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">{member.name} 회원의 최근 응시 내역</caption>
              <thead className="bg-zinc-50 text-xs text-zinc-600"><tr><th scope="col" className="px-5 py-3">시험명</th><th scope="col" className="px-5 py-3">응시일</th><th scope="col" className="px-5 py-3">점수</th><th scope="col" className="px-5 py-3">결과</th></tr></thead>
              <tbody className="divide-y divide-zinc-200">
                {member.recentAttempts.map((attempt) => (
                  <tr key={attempt.id}><td className="px-5 py-4 font-medium text-zinc-900">{attempt.examTitle}</td><td className="whitespace-nowrap px-5 py-4 tabular-nums text-zinc-700">{formatDateTime(attempt.attemptedAt)}</td><td className="px-5 py-4 tabular-nums text-zinc-700">{attempt.score}점</td><td className="px-5 py-4"><span className={attempt.result === "PASSED" ? "font-semibold text-emerald-800" : "font-semibold text-red-800"}>{attempt.result === "PASSED" ? "합격" : "불합격"}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="mt-5 border-zinc-300 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-zinc-950">관리 작업</h2>
        {member.status === "WITHDRAWN" ? (
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-zinc-100 p-4 text-sm text-zinc-700"><ShieldAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" /><p>탈퇴 처리된 회원은 읽기 전용입니다.</p></div>
        ) : (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {member.status === "ACTIVE" ? <Button variant="outline" onClick={() => setPendingAction("suspend")}>회원 정지</Button> : <Button onClick={() => setPendingAction("restore")}>활성으로 복구</Button>}
            <Button variant="destructive" onClick={() => setPendingAction("withdraw")}>탈퇴 처리</Button>
          </div>
        )}
        <p className="mt-4 text-xs leading-5 text-zinc-500">데모 변경은 localStorage에 저장됩니다. 실서비스 적용 전 탈퇴 개인정보 처리 정책과 감사 로그가 필요합니다.</p>
      </Card>

      {dialog ? (
        <AlertDialog open={Boolean(pendingAction)} title={dialog.title(member.name)} description={dialog.description} cancelLabel="취소" actionLabel={dialog.action(member.name)} actionVariant={pendingAction === "restore" ? "primary" : "destructive"} busy={busy} onClose={() => { setPendingAction(null); setDialogError(""); }} onAction={runAction}>
          <div className="rounded-lg bg-zinc-50 p-3 text-sm font-medium text-zinc-800">{memberStatusLabel[member.status]} → {memberStatusLabel[dialog.to]}</div>
          {pendingAction === "suspend" ? <div className="mt-4"><label htmlFor="suspension-reason" className="text-sm font-semibold text-zinc-800">정지 사유 (선택)</label><textarea id="suspension-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="운영 참고용 사유를 입력하세요." className="mt-2 min-h-24 w-full rounded-lg border border-zinc-500 p-3 text-base outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-600/20 sm:text-sm" /></div> : null}
          {pendingAction === "withdraw" ? <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-800"><ShieldAlert size={17} aria-hidden="true" /> 데모 P0에서는 되돌릴 수 없음</p> : null}
          {dialogError ? <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800">{dialogError}</p> : null}
        </AlertDialog>
      ) : null}
      {message ? <Toast message={message} onClose={() => setMessage("")} /> : null}
    </>
  );
}
