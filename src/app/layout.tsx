import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/noto-sans-kr";
import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AdSenseScript } from "@/components/adsense-script";

export const metadata: Metadata = {
  title: "taskory | CBT 시험",
  description:
    "자격시험 문제를 CBT 환경에서 풀고 결과를 확인하는 시험 연습 서비스입니다.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  other: {
    "naver-site-verification": "87d00bd2d9575a9d65abee3c87fd3f11d0b7213d",
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: "taskory | CBT 시험",
    description:
      "자격시험 문제를 CBT 환경에서 풀고 결과를 확인하는 시험 연습 서비스입니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "taskory",
  },
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white">
        <AdSenseScript />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
