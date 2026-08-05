export type Question = {
  id: number;
  subject: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type ExamPaper = {
  id: string;
  year: number;
  status: "available" | "preparing";
};

export type CertificationLevel = {
  id: string;
  label: string;
  papers: ExamPaper[];
};

export type ExamSeries = {
  id: string;
  title: string;
  category: string;
  organization: string;
  description: string;
  levels: CertificationLevel[];
  papers?: ExamPaper[];
};

export const demoExam = {
  id: "information-processing-demo",
  title: "정보처리기사 필기 핵심점검",
  shortTitle: "정보처리기사",
  seriesTitle: "정보처리기능",
  level: "1급",
  year: 2026,
  passScore: 60,
  source: "자체 제작 데모 문항",
  notice:
    "서비스 기능 확인을 위해 제작한 예시 문항입니다. 실제 기출문항이 아닙니다.",
  questions: [
    {
      id: 1,
      subject: "소프트웨어 설계",
      prompt:
        "객체지향 설계 원칙 중 하나의 클래스는 하나의 책임만 가져야 한다는 원칙은 무엇인가?",
      options: [
        "개방-폐쇄 원칙",
        "단일 책임 원칙",
        "리스코프 치환 원칙",
        "인터페이스 분리 원칙",
      ],
      answer: 1,
      explanation:
        "단일 책임 원칙(SRP)은 클래스가 변경되어야 하는 이유를 하나만 갖도록 설계하는 원칙이다.",
    },
    {
      id: 2,
      subject: "소프트웨어 개발",
      prompt:
        "소프트웨어 테스트에서 프로그램 내부 구조를 보지 않고 입력과 출력의 관계를 확인하는 방식은?",
      options: ["화이트박스 테스트", "회귀 테스트", "블랙박스 테스트", "정적 테스트"],
      answer: 2,
      explanation:
        "블랙박스 테스트는 내부 구현과 무관하게 명세에 따른 입력과 출력 결과를 검증한다.",
    },
    {
      id: 3,
      subject: "데이터베이스 구축",
      prompt:
        "관계형 데이터베이스에서 한 테이블의 각 행을 유일하게 식별하는 속성은?",
      options: ["외래 키", "후보 키", "대체 키", "기본 키"],
      answer: 3,
      explanation:
        "기본 키는 후보 키 가운데 선택되며 각 행을 유일하게 식별하고 NULL 값을 허용하지 않는다.",
    },
    {
      id: 4,
      subject: "프로그래밍 언어 활용",
      prompt:
        "운영체제에서 여러 프로세스가 서로 상대방이 가진 자원을 기다리며 무한히 대기하는 상태는?",
      options: ["스래싱", "교착 상태", "기아 상태", "인터럽트"],
      answer: 1,
      explanation:
        "교착 상태는 둘 이상의 프로세스가 각자 보유한 자원을 놓지 않은 채 상대의 자원을 기다리는 상태다.",
    },
    {
      id: 5,
      subject: "정보시스템 구축관리",
      prompt:
        "사용자의 신원을 확인한 뒤 시스템 접근을 허용할지 판단하기 위한 첫 단계는?",
      options: ["인가", "인증", "감사", "암호화"],
      answer: 1,
      explanation:
        "인증은 사용자가 누구인지 확인하는 과정이며, 인가는 인증된 사용자에게 권한을 부여하는 과정이다.",
    },
  ] satisfies Question[],
};

const years = (seriesId: string, levelId: string, availableId?: string): ExamPaper[] =>
  Array.from({ length: 18 }, (_, index) => {
    const year = 2026 - index;
    const id = availableId && year === 2026 ? availableId : `${seriesId}-${levelId}-${year}`;
    return { id, year, status: id === availableId ? "available" : "preparing" };
  });

export const examSeries: ExamSeries[] = [
  {
    id: "information-processing",
    title: "정보처리기능",
    category: "IT·정보통신",
    organization: "한국산업인력공단",
    description: "급수와 연도를 선택해 필요한 기출문제를 바로 찾아보세요.",
    levels: [
      { id: "level-1", label: "1급", papers: years("information-processing", "level-1", demoExam.id) },
      { id: "level-2", label: "2급", papers: years("information-processing", "level-2") },
      { id: "level-3", label: "3급", papers: years("information-processing", "level-3") },
    ],
  },
  {
    id: "computer-application",
    title: "컴퓨터활용능력",
    category: "사무·OA",
    organization: "대한상공회의소",
    description: "급수별 필기 문제와 연도별 회차를 순차적으로 제공합니다.",
    levels: [
      { id: "level-1", label: "1급", papers: years("computer-application", "level-1") },
      { id: "level-2", label: "2급", papers: years("computer-application", "level-2") },
    ],
  },
  {
    id: "korean-history",
    title: "한국사능력검정시험",
    category: "역사·교양",
    organization: "국사편찬위원회",
    description: "급수별 시험지와 회차별 문제를 한곳에서 확인할 수 있습니다.",
    levels: [
      { id: "advanced", label: "심화", papers: years("korean-history", "advanced") },
      { id: "basic", label: "기본", papers: years("korean-history", "basic") },
    ],
  },
  {
    id: "computerized-accounting",
    title: "전산회계",
    category: "회계·세무",
    organization: "한국세무사회",
    description: "급수별 학습 범위에 맞춰 연도별 문제를 정리합니다.",
    levels: [
      { id: "level-1", label: "1급", papers: years("computerized-accounting", "level-1") },
      { id: "level-2", label: "2급", papers: years("computerized-accounting", "level-2") },
    ],
  },
];

export function getExamById(id: string) {
  return id === demoExam.id ? demoExam : null;
}

export function findExamTitle(id: string) {
  if (id === demoExam.id) return `${demoExam.seriesTitle} ${demoExam.level} · ${demoExam.year}년`;
  return id;
}

export function filterExamSeries(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return examSeries;
  return examSeries.filter((series) => [series.title, series.category, series.organization, ...series.levels.map((level) => level.label), ...series.levels.flatMap((level) => level.papers.map((paper) => String(paper.year))), ...(series.papers ?? []).map((paper) => String(paper.year))].some((value) => value.toLowerCase().includes(normalized)));
}
