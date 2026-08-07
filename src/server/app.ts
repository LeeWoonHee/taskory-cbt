import { Elysia, t } from "elysia";

import { getDb, isDatabaseConfigured } from "@/db";
import { createSessionCookie, createSessionToken, clearSessionCookie, getAdminUser, getCurrentUser, loginUser, registerUser } from "@/services/auth-service";
import { deleteExam, getAdminOverview, updateExamStatus, updateUserRole } from "@/services/admin-service";
import { parseExamSpreadsheet } from "@/services/exam-import-service";
import { exams, questions } from "@/db/schema";
import { listExamCatalog } from "@/services/catalog-service";
import { getPublicExam, listUserAttempts, scoreAttempt } from "@/services/exam-service";

export const api = new Elysia({ prefix: "/api" })
  .get("/health", () => ({ status: "ok", database: isDatabaseConfigured() ? "configured" : "not-configured" }))
  .get("/exams", async () => ({ exams: await listExamCatalog() }))
  .get("/exams/:id", async ({ params, status }) => {
    const exam = await getPublicExam(params.id);
    return exam ?? status(404, { message: "시험을 찾을 수 없습니다." });
  })
  .post("/attempts", async ({ body, request, status }) => {
    const user = await getCurrentUser(request);
    const result = await scoreAttempt({ examId: body.examId, answers: body.answers, userId: user?.id });
    return result ?? status(404, { message: "시험을 찾을 수 없습니다." });
  }, { body: t.Object({ examId: t.String({ minLength: 1 }), answers: t.Array(t.Union([t.Integer({ minimum: 0 }), t.String(), t.Null()])) }) })
  .get("/attempts/me", async ({ request, status }) => {
    const user = await getCurrentUser(request);
    if (!user) return status(401, { message: "로그인이 필요합니다." });
    return { user, attempts: await listUserAttempts(user.id) };
  })
  .get("/admin/overview", async ({ request, status }) => {
    if (!await getAdminUser(request)) return status(403, { message: "관리자 권한이 필요합니다." });
    return getAdminOverview();
  })
  .patch("/admin/users/:id/role", async ({ params, body, request, status }) => {
    const user = await getAdminUser(request);
    if (!user) return status(403, { message: "관리자 권한이 필요합니다." });
    const updated = await updateUserRole(params.id, body.role, user.id);
    return updated ?? status(400, { message: "자기 자신을 일반 회원으로 변경할 수 없습니다." });
  }, { params: t.Object({ id: t.String({ minLength: 1 }) }), body: t.Object({ role: t.Union([t.Literal("user"), t.Literal("admin")]) }) })
  .patch("/admin/exams/:id/status", async ({ params, body, request, status }) => {
    if (!await getAdminUser(request)) return status(403, { message: "관리자 권한이 필요합니다." });
    const updated = await updateExamStatus(params.id, body.status);
    return updated ?? status(404, { message: "시험을 찾을 수 없습니다." });
  }, { params: t.Object({ id: t.String({ minLength: 1 }) }), body: t.Object({ status: t.Union([t.Literal("draft"), t.Literal("published")]) }) })
  .delete("/admin/exams/:id", async ({ params, request, status }) => {
    if (!await getAdminUser(request)) return status(403, { message: "관리자 권한이 필요합니다." });
    const deleted = await deleteExam(params.id);
    return deleted ?? status(404, { message: "시험을 찾을 수 없습니다." });
  }, { params: t.Object({ id: t.String({ minLength: 1 }) }) })
  .post("/admin/exams/import", async ({ body, request, status }) => {
    if (!await getAdminUser(request)) return status(403, { message: "관리자 권한이 필요합니다." });
    try {
      const multipart = body as { metadata?: unknown; file?: unknown };
      if (!(multipart.file instanceof Blob)) return status(400, { message: "엑셀 파일을 확인할 수 없습니다." });
      if (multipart.file.size === 0 || multipart.file.size > 10 * 1024 * 1024) return status(400, { message: "엑셀 파일은 10MB 이하로 업로드해 주세요." });
      const metadata = typeof multipart.metadata === "string" ? JSON.parse(multipart.metadata) as Record<string, unknown> : multipart.metadata;
      if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return status(400, { message: "시험 정보(metadata)를 확인할 수 없습니다." });
      const examMetadata = metadata as { title?: string; level?: string; year?: string; month?: string; sourceName?: string; sourceUrl?: string; status?: string };
      const year = Number(examMetadata.year);
      const month = examMetadata.month ? Number(examMetadata.month) : null;
      if (!examMetadata.title?.trim() || examMetadata.title.trim().length > 200 || !Number.isInteger(year) || year < 1900 || year > 2200) return status(400, { message: "시험명(200자 이하)과 올바른 출제 연도를 입력해 주세요." });
      if (examMetadata.level && examMetadata.level.trim().length > 40) return status(400, { message: "급수는 40자 이하로 입력해 주세요." });
      if (examMetadata.sourceName && examMetadata.sourceName.trim().length > 240) return status(400, { message: "출처명은 240자 이하로 입력해 주세요." });
      if (examMetadata.sourceUrl && examMetadata.sourceUrl.trim()) {
        try { const sourceUrl = new URL(examMetadata.sourceUrl.trim()); if (!["http:", "https:"].includes(sourceUrl.protocol)) throw new Error(); }
        catch { return status(400, { message: "출처 URL은 http 또는 https 주소를 입력해 주세요." }); }
      }
      if (examMetadata.status && !["draft", "published"].includes(examMetadata.status)) return status(400, { message: "시험 공개 상태가 올바르지 않습니다." });
      if (examMetadata.month && (!Number.isInteger(month) || month! < 1 || month! > 12)) return status(400, { message: "출제 월은 1~12 사이로 입력해 주세요." });
      const parsed = await parseExamSpreadsheet(multipart.file as File);
      if (parsed.errors.length || !parsed.questions.length) return status(400, { message: parsed.errors.length ? "엑셀 데이터를 확인해 주세요." : "등록할 문제가 없습니다.", errors: parsed.errors, questions: parsed.questions });
      if (parsed.questions.length > 5000) return status(400, { message: "한 번에 등록할 수 있는 문제는 최대 5,000개입니다." });
      const invalidQuestion = parsed.questions.find((question) => question.prompt.length > 10000 || question.correctAnswer.length > 1000 || (question.context?.length ?? 0) > 20000 || (question.explanation?.length ?? 0) > 20000 || (question.options ?? []).some((option) => option.length > 2000));
      if (invalidQuestion) return status(400, { message: "문제, 선택지, 지문, 정답 또는 해설의 입력 길이를 확인해 주세요." });
      if (!isDatabaseConfigured()) return status(503, { message: "엑셀 검증이 완료되었습니다. 실제 저장하려면 DATABASE_URL을 설정해 주세요.", questions: parsed.questions });
      const examId = `admin-${crypto.randomUUID()}`;
      await getDb().transaction(async (tx) => {
        await tx.insert(exams).values({ id: examId, seriesId: examId, title: examMetadata.title!.trim(), level: examMetadata.level?.trim() || null, examYear: year, examMonth: month, examRound: null, category: null, organization: null, passScore: null, sourceName: examMetadata.sourceName?.trim() || null, sourceUrl: examMetadata.sourceUrl?.trim() || null, status: examMetadata.status === "published" ? "published" : "draft", publishedAt: examMetadata.status === "published" ? new Date() : null });
        await tx.insert(questions).values(parsed.questions.map((question, index) => ({ examId, order: index + 1, questionType: question.questionType, prompt: question.prompt, context: question.context, options: question.options, correctAnswer: question.correctAnswer, explanation: question.explanation })));
      });
      return { exam: { id: examId, title: examMetadata.title, questionCount: parsed.questions.length }, questions: parsed.questions };
    } catch (error) {
      console.error("[admin/exams/import] failed", error);
      if (error instanceof SyntaxError) return status(400, { message: "시험 정보(metadata) 형식이 올바르지 않습니다." });
      return status(500, { message: "엑셀 등록 중 서버 오류가 발생했습니다." });
    }
  }, { body: t.Any() })
  .post("/auth/register", async ({ body, set, status }) => {
    if (!isDatabaseConfigured() || !process.env.SESSION_SECRET) return status(503, { message: "회원 기능을 사용하려면 DATABASE_URL과 SESSION_SECRET을 설정해 주세요." });
    try { const user = await registerUser(body); set.headers["set-cookie"] = createSessionCookie(await createSessionToken(user)); return { user }; }
    catch (error) {
      if (error instanceof Error && error.message === "이미 가입된 이메일입니다.") return status(400, { message: error.message });
      console.error("[auth/register] failed", error);
      return status(500, { message: "회원가입 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    }
  }, { body: t.Object({ name: t.String({ minLength: 2, maxLength: 120 }), email: t.String({ format: "email", maxLength: 320 }), password: t.String({ minLength: 8, maxLength: 72 }) }) })
  .post("/auth/login", async ({ body, set, status }) => {
    if (!isDatabaseConfigured() || !process.env.SESSION_SECRET) return status(503, { message: "회원 기능을 사용하려면 DATABASE_URL과 SESSION_SECRET을 설정해 주세요." });
    try { const user = await loginUser(body); set.headers["set-cookie"] = createSessionCookie(await createSessionToken(user)); return { user }; }
    catch (error) {
      if (error instanceof Error && error.message === "이메일 또는 비밀번호를 확인해 주세요.") return status(401, { message: error.message });
      console.error("[auth/login] failed", error);
      return status(500, { message: "로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    }
  }, { body: t.Object({ email: t.String({ format: "email", maxLength: 320 }), password: t.String({ minLength: 8, maxLength: 72 }) }) })
  .get("/auth/me", async ({ request }) => ({ user: await getCurrentUser(request) }))
  .post("/auth/logout", ({ set }) => { set.headers["set-cookie"] = clearSessionCookie(); return { success: true }; });

export type Api = typeof api;
