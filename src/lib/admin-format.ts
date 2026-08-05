import type {
  ExamDisplayStatus,
  ExamVisibility,
  MemberStatus,
} from "@/types/admin";

const dateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatDateTime(value: string | null): string {
  if (!value) return "미설정";
  const parts = dateTimeFormatter.formatToParts(new Date(value));
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${pick("year")}.${pick("month")}.${pick("day")} ${pick("hour")}:${pick("minute")}`;
}

export function formatPeriod(startsAt: string | null, endsAt: string | null) {
  if (!startsAt || !endsAt) return "일정 미설정";
  return `${formatDateTime(startsAt)} ~ ${formatDateTime(endsAt)}`;
}

export const memberStatusLabel: Record<MemberStatus, string> = {
  ACTIVE: "활성",
  SUSPENDED: "정지",
  WITHDRAWN: "탈퇴",
};

export const examStatusLabel: Record<ExamDisplayStatus, string> = {
  DRAFT: "임시 저장",
  SCHEDULED: "게시 예정",
  OPEN: "진행 중",
  CLOSED: "종료",
  ARCHIVED: "보관",
};

export const visibilityLabel: Record<ExamVisibility, string> = {
  PRIVATE: "비공개",
  LINK: "링크 공개",
  PUBLIC: "전체 공개",
};

export function createListHref(
  path: string,
  query: string,
  status: string,
) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (status && status !== "ALL") params.set("status", status);
  const suffix = params.toString();
  return suffix ? `${path}?${suffix}` : path;
}

