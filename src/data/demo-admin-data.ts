import type { DemoSnapshot, Exam, Member, MemberStatus } from "@/types/admin";

export const DEMO_NOW = "2026-08-05T00:00:00.000Z";

const memberNames = [
  "김민준", "이서연", "박지훈", "최하은", "정도윤", "강지아",
  "조현우", "윤서아", "장우진", "임수빈", "한예준", "오지유",
  "서준혁", "신채원", "권시우", "황다은", "안지호", "송유나",
  "류하준", "전민서", "고은우", "문서윤", "배도현", "백아린",
] as const;

function memberStatus(index: number): MemberStatus {
  if (index < 16) return "ACTIVE";
  if (index < 21) return "SUSPENDED";
  return "WITHDRAWN";
}

export const initialMembers: Member[] = memberNames.map((name, index) => {
  const attemptCount = index % 6 === 0 ? 0 : (index * 3) % 12;
  const passedCount = Math.min(attemptCount, Math.floor(attemptCount * 0.7));
  const emailName = ["minjun", "seoyeon", "jihoon", "haeun"][index % 4];
  const joinedDay = String(24 - index).padStart(2, "0");

  return {
    id: `member-demo-${String(index + 1).padStart(3, "0")}`,
    memberNo: `MBR-2026-${String(index + 1).padStart(4, "0")}`,
    name,
    email: `${emailName}${index + 1}@example.com`,
    phone: index % 5 === 0 ? null : `010-${String(2345 + index).padStart(4, "0")}-${String(6700 + index).padStart(4, "0")}`,
    status: memberStatus(index),
    joinedAt: `2026-07-${joinedDay}T${String((index % 8) + 1).padStart(2, "0")}:20:00.000Z`,
    lastLoginAt:
      index % 6 === 0
        ? null
        : `2026-08-0${(index % 4) + 1}T0${index % 9}:10:00.000Z`,
    examAttemptCount: attemptCount,
    passedExamCount: passedCount,
    recentAttempts:
      attemptCount === 0
        ? []
        : [
            {
              id: `attempt-${index + 1}-1`,
              examTitle: "2026 정보보안 기본 역량 평가",
              attemptedAt: `2026-07-${String(28 - (index % 8)).padStart(2, "0")}T03:30:00.000Z`,
              score: 55 + ((index * 7) % 46),
              result: 55 + ((index * 7) % 46) >= 60 ? "PASSED" : "FAILED",
            },
            ...(attemptCount > 2
              ? [
                  {
                    id: `attempt-${index + 1}-2`,
                    examTitle: "개인정보 보호 정기 교육",
                    attemptedAt: `2026-06-${String(18 - (index % 8)).padStart(2, "0")}T05:00:00.000Z`,
                    score: 62 + ((index * 5) % 35),
                    result: "PASSED" as const,
                  },
                ]
              : []),
          ],
  };
});

export const initialExams: Exam[] = [
  {
    id: "exam-demo-001", code: "SECURITY-2026", title: "2026 정보보안 기본 역량 평가",
    description: "전 임직원의 정보보안 기본 원칙 이해도를 확인합니다.", category: "교육",
    lifecycleStatus: "DRAFT", visibility: "PRIVATE", durationMinutes: 60, questionCount: 20,
    passScore: 60, startsAt: null, endsAt: null, attemptCount: 0,
    createdAt: "2026-08-01T01:00:00.000Z", updatedAt: "2026-08-04T08:20:00.000Z",
  },
  {
    id: "exam-demo-002", code: "HR-ONBOARD-01", title: "신입 구성원 온보딩 확인 평가",
    description: "온보딩 과정의 핵심 내용을 확인하는 초안입니다.", category: "교육",
    lifecycleStatus: "DRAFT", visibility: "PRIVATE", durationMinutes: 30, questionCount: 15,
    passScore: 70, startsAt: null, endsAt: null, attemptCount: 0,
    createdAt: "2026-07-30T02:00:00.000Z", updatedAt: "2026-08-03T04:10:00.000Z",
  },
  {
    id: "exam-demo-003", code: "DATA-LITERACY", title: "데이터 리터러시 기초",
    description: "업무 데이터 해석 역량을 점검합니다.", category: "직무",
    lifecycleStatus: "DRAFT", visibility: "LINK", durationMinutes: 45, questionCount: 25,
    passScore: 60, startsAt: null, endsAt: null, attemptCount: 0,
    createdAt: "2026-07-28T05:00:00.000Z", updatedAt: "2026-08-02T05:30:00.000Z",
  },
  {
    id: "exam-demo-004", code: "SAFETY-DRAFT", title: "산업 안전 필수 수칙 사전 평가",
    description: "교육 전 사전 지식 확인용 시험입니다.", category: "자격",
    lifecycleStatus: "DRAFT", visibility: "PRIVATE", durationMinutes: 20, questionCount: 10,
    passScore: 80, startsAt: null, endsAt: null, attemptCount: 0,
    createdAt: "2026-07-20T01:00:00.000Z", updatedAt: "2026-07-29T06:00:00.000Z",
  },
  ...[
    ["exam-demo-005", "CLOUD-AUG", "클라우드 운영 역량 인증", "2026-08-10T00:00:00.000Z", "2026-08-20T09:00:00.000Z"],
    ["exam-demo-006", "LEGAL-Q3", "3분기 컴플라이언스 정기 평가", "2026-08-15T00:00:00.000Z", "2026-08-25T09:00:00.000Z"],
    ["exam-demo-007", "LEADER-2026", "리더십 기본 과정 수료 평가", "2026-09-01T00:00:00.000Z", "2026-09-12T09:00:00.000Z"],
    ["exam-demo-008", "PRIVACY-AUG", "개인정보 보호 정기 교육 평가", "2026-08-01T00:00:00.000Z", "2026-08-08T09:00:00.000Z"],
    ["exam-demo-009", "FRONTEND-L2", "프론트엔드 개발 역량 레벨 2", "2026-08-03T00:00:00.000Z", "2026-08-12T09:00:00.000Z"],
    ["exam-demo-010", "CS-BASIC", "고객 상담 품질 기본 평가", "2026-07-29T00:00:00.000Z", "2026-08-06T09:00:00.000Z"],
    ["exam-demo-011", "NETWORK-JUL", "네트워크 기초 자격 평가", "2026-07-01T00:00:00.000Z", "2026-07-10T09:00:00.000Z"],
    ["exam-demo-012", "FINANCE-Q2", "2분기 재무 실무 이해도 평가", "2026-06-10T00:00:00.000Z", "2026-06-20T09:00:00.000Z"],
    ["exam-demo-013", "DESIGN-SYS", "디자인 시스템 운영 원칙과 접근성 심화 평가", "2026-05-05T00:00:00.000Z", "2026-05-15T09:00:00.000Z"],
  ].map(([id, code, title, startsAt, endsAt], index): Exam => ({
    id, code, title, startsAt, endsAt,
    description: `${title}의 핵심 개념과 실무 적용 능력을 평가합니다.`,
    category: index % 2 ? "교육" : "직무",
    lifecycleStatus: "PUBLISHED", visibility: index % 3 === 0 ? "PUBLIC" : "LINK",
    durationMinutes: 40 + index * 5, questionCount: 20 + index,
    passScore: index === 2 ? 100 : 60 + (index % 3) * 10, attemptCount: 18 + index * 13,
    createdAt: `2026-0${Math.max(1, 7 - Math.floor(index / 3))}-10T01:00:00.000Z`,
    updatedAt: `2026-07-${String(28 - index).padStart(2, "0")}T04:00:00.000Z`,
  })),
  {
    id: "exam-demo-014", code: "ARCHIVE-SEC", title: "2025 정보보안 정기 평가",
    description: "운영이 종료되어 보관된 시험입니다.", category: "교육", lifecycleStatus: "ARCHIVED",
    visibility: "PRIVATE", durationMinutes: 60, questionCount: 30, passScore: 70,
    startsAt: "2025-08-01T00:00:00.000Z", endsAt: "2025-08-20T09:00:00.000Z", attemptCount: 304,
    createdAt: "2025-07-01T01:00:00.000Z", updatedAt: "2026-04-01T04:00:00.000Z",
  },
  {
    id: "exam-demo-015", code: "ARCHIVE-HR", title: "2025 인사 제도 이해도 평가",
    description: "이전 인사 제도를 기준으로 운영된 보관 시험입니다.", category: "직무", lifecycleStatus: "ARCHIVED",
    visibility: "PRIVATE", durationMinutes: 35, questionCount: 18, passScore: 60,
    startsAt: "2025-04-01T00:00:00.000Z", endsAt: "2025-04-10T09:00:00.000Z", attemptCount: 188,
    createdAt: "2025-03-10T01:00:00.000Z", updatedAt: "2026-03-01T04:00:00.000Z",
  },
];

export const initialDemoSnapshot: DemoSnapshot = {
  members: initialMembers,
  exams: initialExams,
};

