import { UserCircleIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

export function SiteHeader() {
  return (
    <header className="border-b border-[#eceef1] bg-white">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <BrandLogo />
        <nav className="flex items-center gap-5 text-sm font-semibold text-[#4f5660] sm:gap-8" aria-label="주요 메뉴">
          <Link href="/exams" className="transition-colors hover:text-[#2563eb]">시험 목록</Link>
          <Link href="/mypage" className="hidden transition-colors hover:text-[#2563eb] sm:block">학습 기록</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[#4f5660] transition-colors hover:bg-[#f6f7f9] sm:block">로그인</Link>
          <Link href="/signup" className="hidden rounded-xl bg-[#17191c] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#30343a] md:block">회원가입</Link>
          <Link href="/mypage" className="flex size-10 items-center justify-center rounded-xl border border-[#e1e4e8] text-[#343a42] md:hidden" aria-label="마이페이지"><UserCircleIcon size={21} aria-hidden="true" /></Link>
        </div>
      </div>
    </header>
  );
}
