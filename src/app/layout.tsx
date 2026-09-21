import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/noto-sans-kr";
import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AdSenseScript } from "@/components/adsense-script";
import { GoogleAnalytics } from "@/components/google-analytics";
import { OfferwallRouteControl } from "@/components/offerwall-route-control";

import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "taskory CBT | 무료 자격증 기출문제 시험 연습",
    template: "%s",
  },
  description:
    "지게차운전기능사, 컴퓨터활용능력 등 다양한 국가기술자격 및 전문자격 기출문제를 실제 CBT 환경에서 무료로 풀고 채점해 보세요.",
  keywords: [
    "CBT",
    "CBT 시험",
    "기출문제",
    "자격증 기출문제",
    "지게차운전기능사",
    "지게차 운전기능사",
    "지게차 기출문제",
    "지게차운전기능사 기출문제",
    "자격증 CBT",
    "무료 기출문제",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      "naver-site-verification": "87d00bd2d9575a9d65abee3c87fd3f11d0b7213d",
    },
  },
  openGraph: {
    title: "taskory CBT | 무료 자격증 기출문제 시험 연습",
    description:
      "지게차운전기능사, 컴퓨터활용능력 등 다양한 국가기술자격 기출문제를 실제 CBT 환경에서 무료로 풀고 채점해 보세요.",
    url: SITE_URL,
    siteName: "taskory CBT",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "taskory CBT | 무료 자격증 기출문제 시험 연습",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "taskory CBT | 무료 자격증 기출문제 시험 연습",
    description:
      "지게차운전기능사, 컴퓨터활용능력 등 다양한 국가기술자격 기출문제를 실제 CBT 환경에서 무료로 풀고 채점해 보세요.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <OfferwallRouteControl />
      </head>
      <body className="flex min-h-full flex-col bg-white">
        <AdSenseScript />
        <GoogleAnalytics />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
