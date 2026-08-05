import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MemberDetail } from "@/components/admin/member-detail";
import { serverDemoService } from "@/services/admin-service";

export async function generateMetadata({ params }: { params: Promise<{ memberId: string }> }): Promise<Metadata> {
  const { memberId } = await params;
  const member = serverDemoService.getMember(memberId);
  return { title: member ? `${member.name} · 회원 상세` : "회원 정보 없음" };
}

export default async function MemberDetailPage({ params, searchParams }: { params: Promise<{ memberId: string }>; searchParams: Promise<{ returnTo?: string }> }) {
  const { memberId } = await params;
  const query = await searchParams;
  const member = serverDemoService.getMember(memberId);
  if (!member) notFound();
  const returnTo = query.returnTo?.startsWith("/admin/members") ? query.returnTo : "/admin/members";
  return <MemberDetail memberId={memberId} initialMember={member} returnTo={returnTo} />;
}

