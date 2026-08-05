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
      const metadata = typeof multipart.metadata === "string" ? JSON.parse(multipart.metadata) as Record<string, unknown> : multipart.metadata;
      if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return status(400, { message: "시험 정보(metadata)를 확인할 수 없습니다." });
      const examMetadata = metadata as { title?: string; level?: string; year?: string; month?: string; round?: string; category?: string; organization?: string; sourceName?: string; sourceUrl?: string; status?: string };
      if (!examMetadata.title?.trim() || !examMetadata.year) return status(400, { message: "시험명과 출제 연도는 필수입니다." });
      if (examMetadata.month && (!Number.isInteger(Number(examMetadata.month)) || Number(examMetadata.month) < 1 || Number(examMetadata.month) > 12)) return status(400, { message: "출제 월은 1~12 사이로 입력해 주세요." });
      if (examMetadata.round && (!Number.isInteger(Number(examMetadata.round)) || Number(examMetadata.round) < 1)) return status(400, { message: "회차는 1 이상으로 입력해 주세요." });
      const parsed = await parseExamSpreadsheet(multipart.file as File);
      if (parsed.errors.length || !parsed.questions.length) return status(400, { message: parsed.errors.length ? "엑셀 데이터를 확인해 주세요." : "등록할 문제가 없습니다.", errors: parsed.errors, questions: parsed.questions });
      if (!isDatabaseConfigured()) return status(503, { message: "엑셀 검증이 완료되었습니다. 실제 저장하려면 DATABASE_URL을 설정해 주세요.", questions: parsed.questions });
      const examId = `admin-${crypto.randomUUID()}`;
      await getDb().transaction(async (tx) => {
        await tx.insert(exams).values({ id: examId, seriesId: examId, title: examMetadata.title!.trim(), level: examMetadata.level?.trim() || null, examYear: Number(examMetadata.year), examMonth: examMetadata.month ? Number(examMetadata.month) : null, examRound: examMetadata.round ? Number(examMetadata.round) : null, category: examMetadata.category?.trim() || null, organization: examMetadata.organization?.trim() || null, passScore: null, sourceName: examMetadata.sourceName?.trim() || null, sourceUrl: examMetadata.sourceUrl?.trim() || null, status: examMetadata.status === "published" ? "published" : "draft", publishedAt: examMetadata.status === "published" ? new Date() : null });
        await tx.insert(questions).values(parsed.questions.map((question, index) => ({ examId, order: index + 1, questionType: question.questionType, prompt: question.prompt, context: question.context, options: question.options, correctAnswer: question.correctAnswer, explanation: question.explanation })));
      });
      return { exam: { id: examId, title: examMetadata.title, questionCount: parsed.questions.length }, questions: parsed.questions };
    } catch (error) { return status(400, { message: error instanceof Error ? error.message : "엑셀 등록에 실패했습니다." }); }
  }, { body: t.Any() })
  .post("/auth/register", async ({ body, set, status }) => {
    if (!isDatabaseConfigured() || !process.env.SESSION_SECRET) return status(503, { message: "회원 기능을 사용하려면 DATABASE_URL과 SESSION_SECRET을 설정해 주세요." });
    try { const user = await registerUser(body); set.headers["set-cookie"] = createSessionCookie(await createSessionToken(user)); return { user }; }
    catch (error) { return status(400, { message: error instanceof Error ? error.message : "회원가입에 실패했습니다." }); }
  }, { body: t.Object({ name: t.String({ minLength: 2, maxLength: 120 }), email: t.String({ format: "email", maxLength: 320 }), password: t.String({ minLength: 8, maxLength: 72 }) }) })
  .post("/auth/login", async ({ body, set, status }) => {
    if (!isDatabaseConfigured() || !process.env.SESSION_SECRET) return status(503, { message: "회원 기능을 사용하려면 DATABASE_URL과 SESSION_SECRET을 설정해 주세요." });
    try { const user = await loginUser(body); set.headers["set-cookie"] = createSessionCookie(await createSessionToken(user)); return { user }; }
    catch (error) { return status(401, { message: error instanceof Error ? error.message : "로그인에 실패했습니다." }); }
  }, { body: t.Object({ email: t.String({ format: "email", maxLength: 320 }), password: t.String({ minLength: 8, maxLength: 72 }) }) })
  .get("/auth/me", async ({ request }) => ({ user: await getCurrentUser(request) }))
  .post("/auth/logout", ({ set }) => { set.headers["set-cookie"] = clearSessionCookie(); return { success: true }; });

export type Api = typeof api;
