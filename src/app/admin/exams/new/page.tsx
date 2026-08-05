import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ExamRegistrationForm } from "@/components/exam-registration-form";
import { getAdminUser } from "@/services/auth-service";

export default async function NewAdminExamPage() {
  const requestHeaders = await headers();
  const user = await getAdminUser(new Request("http://taskory.local/admin/exams/new", { headers: { cookie: requestHeaders.get("cookie") ?? "" } }));
  if (!user) redirect("/login");

  return <main className="flex-1 bg-[#f7f8fa]"><div className="mx-auto w-full max-w-[1280px] px-5 py-10 sm:px-8 lg:py-16"><Link href="/admin" className="flex w-fit items-center gap-2 text-sm font-bold text-[#6f7680] transition-colors hover:text-[#2563eb]"><ArrowLeftIcon size={17} />관리자 메인으로</Link><ExamRegistrationForm /></div></main>;
}
