import type { Metadata } from "next";
import { MembersList } from "@/components/admin/members-list";
import { PageHeader } from "@/components/admin/page-header";
import type { MemberStatus } from "@/types/admin";

export const metadata: Metadata = { title: "회원 관리" };

function normalizeStatus(value?: string): MemberStatus | "ALL" {
  return value === "ACTIVE" || value === "SUSPENDED" || value === "WITHDRAWN" ? value : "ALL";
}

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <PageHeader title="회원 관리" description="전체 회원을 검색하고 이용 상태와 최근 활동을 확인합니다." />
      <MembersList initialQuery={params.q?.trim() ?? ""} initialStatus={normalizeStatus(params.status)} />
    </>
  );
}

