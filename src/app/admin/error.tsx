"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonClasses, Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Card className="mx-auto max-w-xl p-6 text-center sm:p-10">
      <h1 className="text-2xl font-bold text-zinc-950">문제가 발생했습니다.</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">요청을 처리하지 못했습니다. 다시 시도해 주세요.</p>
      {error.digest ? <p className="mt-2 text-xs text-zinc-500">오류 번호 {error.digest}</p> : null}
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={reset}>다시 시도</Button>
        <Link href="/admin/members" className={buttonClasses("outline")}>회원 관리로 이동</Link>
      </div>
    </Card>
  );
}

