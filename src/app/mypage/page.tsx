import type { Metadata } from "next";

import { MypageDashboard } from "@/components/mypage-dashboard";

export const metadata: Metadata = {
  title: "마이페이지 | taskory CBT",
  description: "나의 자격증 시험 응시 이력과 학습 기록을 확인하세요.",
  robots: { index: false, follow: false },
};

export default function MyPage() {
  return <MypageDashboard />;
}
