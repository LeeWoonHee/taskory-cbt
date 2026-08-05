import { DEMO_NOW, initialDemoSnapshot } from "@/data/demo-admin-data";
import type {
  DemoSnapshot,
  Exam,
  ExamDisplayStatus,
  ExamDraftField,
  ExamDraftInput,
  ListResult,
  Member,
  MemberStatus,
  MutationResult,
} from "@/types/admin";

export interface AdminDataService {
  listMembers(input: { query?: string; status?: MemberStatus | "ALL" }): ListResult<Member>;
  getMember(id: string): Member | null;
  changeMemberStatus(input: {
    id: string;
    fromStatus: MemberStatus;
    toStatus: MemberStatus;
    reason?: string;
  }): MutationResult<Member>;
  listExams(input: { query?: string; displayStatus?: ExamDisplayStatus | "ALL"; now?: string }): ListResult<Exam>;
  getExam(id: string): Exam | null;
  createExamDraft(input: ExamDraftInput): MutationResult<Exam>;
  snapshot(): DemoSnapshot;
}

export function getExamDisplayStatus(exam: Exam, now = DEMO_NOW): ExamDisplayStatus {
  if (exam.lifecycleStatus === "DRAFT") return "DRAFT";
  if (exam.lifecycleStatus === "ARCHIVED") return "ARCHIVED";
  const timestamp = new Date(now).getTime();
  if (exam.startsAt && timestamp < new Date(exam.startsAt).getTime()) return "SCHEDULED";
  if (exam.endsAt && timestamp > new Date(exam.endsAt).getTime()) return "CLOSED";
  return "OPEN";
}

export function validateExamDraft(
  input: ExamDraftInput,
  exams: Exam[],
): Partial<Record<ExamDraftField, string>> {
  const errors: Partial<Record<ExamDraftField, string>> = {};
  const title = input.title.trim();
  const code = input.code.trim();
  if (!title) errors.title = "시험명을 입력해 주세요.";
  else if (title.length > 100) errors.title = "시험명은 100자 이하로 입력해 주세요.";
  if (!code) errors.code = "시험 코드를 입력해 주세요.";
  else if (!/^[A-Z0-9-]{3,20}$/.test(code)) {
    errors.code = "영문 대문자, 숫자, 하이픈을 사용해 3~20자로 입력해 주세요.";
  } else if (exams.some((exam) => exam.code.toUpperCase() === code.toUpperCase())) {
    errors.code = "이미 사용 중인 시험 코드입니다.";
  }
  if (!input.category) errors.category = "분류를 선택해 주세요.";
  if (input.description.length > 500) errors.description = "설명은 500자 이하로 입력해 주세요.";
  if (!Number.isInteger(input.durationMinutes) || input.durationMinutes < 5 || input.durationMinutes > 300) {
    errors.durationMinutes = "제한 시간은 5~300분으로 입력해 주세요.";
  }
  if (!Number.isInteger(input.questionCount) || input.questionCount < 1 || input.questionCount > 200) {
    errors.questionCount = "계획 문항 수는 1~200개로 입력해 주세요.";
  }
  if (!Number.isInteger(input.passScore) || input.passScore < 0 || input.passScore > 100) {
    errors.passScore = "합격 점수는 0~100점으로 입력해 주세요.";
  }
  if (Boolean(input.startsAt) !== Boolean(input.endsAt)) {
    errors.startsAt = "응시 시작과 종료를 모두 입력해 주세요.";
    errors.endsAt = "응시 시작과 종료를 모두 입력해 주세요.";
  } else if (input.startsAt && input.endsAt && new Date(input.endsAt) <= new Date(input.startsAt)) {
    errors.endsAt = "응시 종료는 시작보다 늦어야 합니다.";
  }
  return errors;
}

export function createDemoAdminService(snapshot: DemoSnapshot): AdminDataService {
  const state = structuredClone(snapshot);

  return {
    listMembers({ query = "", status = "ALL" }) {
      const normalized = query.trim().toLocaleLowerCase("ko-KR");
      const items = state.members
        .filter((member) => status === "ALL" || member.status === status)
        .filter((member) =>
          !normalized || [member.name, member.email, member.memberNo]
            .some((value) => value.toLocaleLowerCase("ko-KR").includes(normalized)),
        )
        .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt));
      return { items, total: items.length, nextCursor: null };
    },
    getMember(id) {
      return state.members.find((member) => member.id === id) ?? null;
    },
    changeMemberStatus({ id, fromStatus, toStatus }) {
      const member = state.members.find((item) => item.id === id);
      if (!member) return { ok: false, formError: "회원 정보를 찾을 수 없습니다." };
      if (member.status !== fromStatus) {
        return { ok: false, formError: "회원 상태가 변경되었습니다. 화면을 새로고침해 주세요." };
      }
      const allowed =
        (fromStatus === "ACTIVE" && ["SUSPENDED", "WITHDRAWN"].includes(toStatus)) ||
        (fromStatus === "SUSPENDED" && ["ACTIVE", "WITHDRAWN"].includes(toStatus));
      if (!allowed) return { ok: false, formError: "허용되지 않은 상태 변경입니다." };
      member.status = toStatus;
      return { ok: true, data: structuredClone(member) };
    },
    listExams({ query = "", displayStatus = "ALL", now = DEMO_NOW }) {
      const normalized = query.trim().toLocaleLowerCase("ko-KR");
      const items = state.exams
        .filter((exam) => displayStatus === "ALL" || getExamDisplayStatus(exam, now) === displayStatus)
        .filter((exam) => !normalized || [exam.title, exam.code]
          .some((value) => value.toLocaleLowerCase("ko-KR").includes(normalized)))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      return { items, total: items.length, nextCursor: null };
    },
    getExam(id) {
      return state.exams.find((exam) => exam.id === id) ?? null;
    },
    createExamDraft(input) {
      const fieldErrors = validateExamDraft(input, state.exams);
      if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };
      const serial = state.exams.filter((exam) => exam.id.startsWith("exam-local-")).length + 1;
      const now = new Date().toISOString();
      const exam: Exam = {
        id: `exam-local-${String(serial).padStart(3, "0")}-${Date.now().toString(36)}`,
        code: input.code.trim().toUpperCase(), title: input.title.trim(),
        description: input.description.trim(), category: input.category || "기타",
        lifecycleStatus: "DRAFT", visibility: input.visibility,
        durationMinutes: input.durationMinutes, questionCount: input.questionCount,
        passScore: input.passScore,
        startsAt: input.startsAt ? new Date(input.startsAt).toISOString() : null,
        endsAt: input.endsAt ? new Date(input.endsAt).toISOString() : null,
        attemptCount: 0, createdAt: now, updatedAt: now,
      };
      state.exams.unshift(exam);
      return { ok: true, data: structuredClone(exam) };
    },
    snapshot() {
      return structuredClone(state);
    },
  };
}

export const serverDemoService = createDemoAdminService(initialDemoSnapshot);
