import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "문항 저작권 안내 | taskory", description: "taskory에 등록된 시험 문항과 출처에 대한 저작권 안내입니다." };

export default function CopyrightPage() {
  return <LegalPage eyebrow="콘텐츠 안내" title="문항 저작권 안내" description="시험 문항의 출처와 이용 범위를 존중하며, 권리 침해 신고를 신속하게 처리합니다." sections={[
    { title: "문항 이용 원칙", paragraphs: ["taskory에 등록된 시험명, 문항, 선택지, 해설 및 이미지의 권리는 원저작권자 또는 정당한 권리자에게 있습니다. 서비스는 학습과 시험 연습 목적의 범위에서 콘텐츠를 제공합니다.", "이용자는 서비스의 문항을 무단 복제, 재판매, 재배포하거나 상업적으로 이용해서는 안 됩니다."] },
    { title: "출처 표시", paragraphs: ["관리자가 등록한 시험은 가능한 경우 출처명과 출처 URL을 함께 표시합니다. 출처 정보가 누락되었거나 잘못된 경우 운영자에게 알려 주세요."] },
    { title: "권리 침해 신고", paragraphs: ["권리자 또는 권한을 위임받은 대리인은 문제가 되는 콘텐츠, 권리 보유 사실 및 연락처를 포함해 운영자에게 삭제 또는 수정 요청을 할 수 있습니다. 확인 결과에 따라 해당 콘텐츠를 비공개 처리하거나 수정합니다."] },
  ]} />;
}
