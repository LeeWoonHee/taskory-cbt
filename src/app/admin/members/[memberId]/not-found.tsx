import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MemberNotFound() {
  return (
    <Card className="mx-auto max-w-xl p-8 text-center">
      <h1 className="text-2xl font-bold text-zinc-950">회원 정보를 찾을 수 없습니다.</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">삭제되었거나 잘못된 주소일 수 있습니다.</p>
      <Link href="/admin/members" className={buttonClasses("primary", "mt-6")}>회원 목록으로</Link>
    </Card>
  );
}

