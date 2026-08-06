"use client";

import { ArrowRightIcon, CheckCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";

type AuthMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";
  async function submit(formData: FormData) {
    setLoading(true); setMessage(null);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch(`/api/auth/${isSignup ? "register" : "login"}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "요청을 처리하지 못했습니다.");
      router.push("/mypage"); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "요청을 처리하지 못했습니다."); }
    finally { setLoading(false); }
  }
  return (
    <form action={submit} className="mt-8 flex flex-col gap-5">
      {isSignup && <label className="flex flex-col gap-2 text-sm font-bold text-[#363b43]">이름<input name="name" required minLength={2} autoComplete="name" placeholder="이름을 입력하세요" className="h-14 rounded-2xl border border-[#dfe3e8] px-4 font-medium outline-none transition-colors placeholder:font-normal placeholder:text-[#a4a9b0] focus:border-[#8ca6d7]" /></label>}
      <label className="flex flex-col gap-2 text-sm font-bold text-[#363b43]">이메일<input name="email" type="email" required autoComplete="email" placeholder="example@email.com" className="h-14 rounded-2xl border border-[#dfe3e8] px-4 font-medium outline-none transition-colors placeholder:font-normal placeholder:text-[#a4a9b0] focus:border-[#8ca6d7]" /></label>
      <label className="flex flex-col gap-2 text-sm font-bold text-[#363b43]">비밀번호<input name="password" type="password" required minLength={8} autoComplete={isSignup ? "new-password" : "current-password"} placeholder="8자 이상 입력하세요" className="h-14 rounded-2xl border border-[#dfe3e8] px-4 font-medium outline-none transition-colors placeholder:font-normal placeholder:text-[#a4a9b0] focus:border-[#8ca6d7]" /></label>
      {isSignup && <div className="flex items-start gap-3 text-xs leading-5 text-[#737a84]"><Checkbox id="terms-agreement" name="termsAgreement" value="agreed" required className="mt-1" /><label htmlFor="terms-agreement"><Link href="/terms" className="font-bold text-[#2563eb] underline underline-offset-2">이용약관</Link>과 <Link href="/privacy" className="font-bold text-[#2563eb] underline underline-offset-2">개인정보처리방침</Link>에 동의합니다.</label></div>}
      {message && <p role="alert" className="rounded-xl bg-[#fff3f3] px-4 py-3 text-sm font-medium text-[#c43f3f]">{message}</p>}
      <button disabled={loading} type="submit" className="mt-1 flex h-14 items-center justify-between rounded-2xl bg-[#17191c] px-5 text-sm font-bold text-white transition-colors hover:bg-[#2563eb] disabled:opacity-50"><span>{loading ? "처리 중..." : isSignup ? "회원가입" : "로그인"}</span>{isSignup ? <CheckCircleIcon size={19} /> : <ArrowRightIcon size={19} />}</button>
      <p className="text-center text-sm text-[#7f8690]">{isSignup ? "이미 계정이 있나요?" : "처음 방문하셨나요?"} <Link href={isSignup ? "/login" : "/signup"} className="ml-1 font-bold text-[#2563eb]">{isSignup ? "로그인" : "회원가입"}</Link></p>
    </form>
  );
}
