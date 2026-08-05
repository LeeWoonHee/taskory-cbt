export type MemberStatus = "ACTIVE" | "SUSPENDED" | "WITHDRAWN";

export type AttemptResult = "PASSED" | "FAILED";

export interface ExamAttemptSummary {
  id: string;
  examTitle: string;
  attemptedAt: string;
  score: number;
  result: AttemptResult;
}

export interface Member {
  id: string;
  memberNo: string;
  name: string;
  email: string;
  phone: string | null;
  status: MemberStatus;
  joinedAt: string;
  lastLoginAt: string | null;
  examAttemptCount: number;
  passedExamCount: number;
  recentAttempts: ExamAttemptSummary[];
}

export type ExamLifecycleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type ExamDisplayStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "OPEN"
  | "CLOSED"
  | "ARCHIVED";
export type ExamVisibility = "PRIVATE" | "LINK" | "PUBLIC";
export type ExamCategory = "직무" | "자격" | "교육" | "기타";

export interface Exam {
  id: string;
  code: string;
  title: string;
  description: string;
  category: ExamCategory;
  lifecycleStatus: ExamLifecycleStatus;
  visibility: ExamVisibility;
  durationMinutes: number;
  questionCount: number;
  passScore: number;
  startsAt: string | null;
  endsAt: string | null;
  attemptCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExamDraftInput {
  title: string;
  code: string;
  description: string;
  category: ExamCategory | "";
  visibility: ExamVisibility;
  durationMinutes: number;
  questionCount: number;
  passScore: number;
  startsAt: string;
  endsAt: string;
}

export type ExamDraftField = keyof ExamDraftInput;

export interface MutationResult<T> {
  ok: boolean;
  data?: T;
  fieldErrors?: Partial<Record<ExamDraftField, string>>;
  formError?: string;
}

export interface ListResult<T> {
  items: T[];
  total: number;
  nextCursor: string | null;
}

export interface DemoSnapshot {
  members: Member[];
  exams: Exam[];
}

