import type { Metadata } from "next";

import { AuthShell } from "@/components/auth-shell";
import { FeedbackForm } from "@/components/feedback-form";

export const metadata: Metadata = {
  title: "문의 및 의견 보내기 | taskory",
  description: "taskory 이용 중 불편한 점이나 개선 의견을 보내 주세요.",
};

export default function FeedbackPage() {
  return (
    <AuthShell
      title="의견을 보내주세요"
      description="불편한 점이나 개선 아이디어를 남겨 주시면 확인 후 반영하겠습니다."
    >
      <FeedbackForm />
    </AuthShell>
  );
}
