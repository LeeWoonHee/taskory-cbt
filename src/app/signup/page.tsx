import type { Metadata } from "next";

import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "회원가입 | taskory CBT",
  description: "회원가입하고 시험 결과와 오답노트를 안전하게 보관하세요.",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return (
    <AuthShell
      title="학습 기록을 시작하세요"
      description="회원이 되면 시험 결과와 문항별 정답, 해설을 계속 보관할 수 있습니다."
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}
