import type { ExamDisplayStatus, MemberStatus } from "@/types/admin";
import { examStatusLabel, memberStatusLabel } from "@/lib/admin-format";
import { cn } from "@/lib/cn";

const memberStyles: Record<MemberStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-800 ring-emerald-700/20",
  SUSPENDED: "bg-amber-50 text-amber-900 ring-amber-700/20",
  WITHDRAWN: "bg-zinc-100 text-zinc-700 ring-zinc-500/20",
};

const examStyles: Record<ExamDisplayStatus, string> = {
  DRAFT: "bg-blue-50 text-blue-800 ring-blue-700/20",
  SCHEDULED: "bg-amber-50 text-amber-900 ring-amber-700/20",
  OPEN: "bg-emerald-50 text-emerald-800 ring-emerald-700/20",
  CLOSED: "bg-slate-100 text-slate-800 ring-slate-600/20",
  ARCHIVED: "bg-zinc-100 text-zinc-700 ring-zinc-500/20",
};

function BadgeBase({ label, className }: { label: string; className: string }) {
  return (
    <span className={cn("inline-flex min-h-6 shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", className)}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}

export function MemberStatusBadge({ status }: { status: MemberStatus }) {
  return <BadgeBase label={memberStatusLabel[status]} className={memberStyles[status]} />;
}

export function ExamStatusBadge({ status }: { status: ExamDisplayStatus }) {
  return <BadgeBase label={examStatusLabel[status]} className={examStyles[status]} />;
}

