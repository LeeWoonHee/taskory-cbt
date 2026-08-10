import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[#e7e9ec] bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-8 px-5 py-6 sm:flex-row sm:items-center sm:px-8 lg:px-12">
        <div><BrandLogo /><p className="mt-3 text-xs leading-5 text-[#8a9099]">자격시험을 차분하게 준비하는 CBT 학습 서비스</p></div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[#727983]">
          <Link href="/feedback">문의 및 의견</Link><Link href="/terms">이용약관</Link><Link href="/privacy">개인정보처리방침</Link><Link href="/copyright">문항 저작권 안내</Link>
        </div>
      </div>
    </footer>
  );
}
