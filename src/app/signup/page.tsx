import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export default function SignupPage() { return <AuthShell title="학습 기록을 시작하세요" description="회원이 되면 시험 결과와 문항별 정답, 해설을 계속 보관할 수 있습니다."><AuthForm mode="signup" /></AuthShell>; }
