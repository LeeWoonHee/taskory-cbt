"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return <button type="button" onClick={logout} disabled={loading} className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4f5660] transition-colors hover:bg-[#f6f7f9] disabled:opacity-50 sm:block">{loading ? "처리 중..." : "로그아웃"}</button>;
}
