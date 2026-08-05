import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";

export default function LoginPage() { return <AuthShell title="다시 만나서 반가워요" description="로그인하고 이전 시험 결과와 오답 기록을 이어서 확인하세요."><AuthForm mode="login" /></AuthShell>; }
