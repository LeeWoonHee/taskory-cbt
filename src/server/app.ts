import { Elysia, t } from "elysia";

import { getDb, isDatabaseConfigured } from "@/db";
import { createSessionCookie, createSessionToken, clearSessionCookie, getAdminUser, getCurrentUser, loginUser, registerUser } from "@/services/auth-service";
import { getAdminOverview, updateUserRole } from "@/services/admin-service";
import { parseExamSpreadsheet } from "@/services/exam-import-service";
import { exams, questions } from "@/db/schema";
import { getPublicExam, listPublicExams, listUserAttempts, scoreAttempt } from "@/services/exam-service";

export const api = new Elysia({ prefix: "/api" })
  .get("/health", () => ({ status: "ok", database: isDatabaseConfigured() ? "configured" : "not-configured" }))
  .get("/exams", () => ({ exams: listPublicExams() }))
  .get("/exams/:id", ({ params, status }) => {
    const exam = getPublicExam(params.id);
    return exam ?? status(404, { message: "시험을 찾을 수 없습니다." });
  })
  .post("/attempts", async ({ body, request, status }) => {
    const user = await getCurrentUser(request);
    const result = await scoreAttempt({ examId: body.examId, answers: body.answers, userId: user?.id });
    return result ?? status(404, { message: "시험을 찾을 수 없습니다." });
  }, { body: t.Object({ examId: t.String({ minLength: 1 }), answers: t.Array(t.Union([t.Integer({ minimum: 0 }), t.Null()])) }) })
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
  .post("/admin/exams/import", async ({ body, request, status }) => {
    if (!await getAdminUser(request)) return status(403, { message: "관리자 권한이 필요합니다." });
    try {
      const metadata = JSON.parse(body.metadata) as { title?: string; level?: string; year?: string; category?: string; organization?: string; passScore?: string; sourceName?: string; sourceUrl?: string; status?: string };
      if (!metadata.title?.trim() || !metadata.level?.trim() || !metadata.year || !metadata.passScore) return status(400, { message: "시험명, 급수, 출제 연도, 합격 기준 점수는 필수입니다." });
      const parsed = await parseExamSpreadsheet(body.file);
      if (parsed.errors.length || !parsed.questions.length) return status(400, { message: parsed.errors.length ? "엑셀 데이터를 확인해 주세요." : "등록할 문제가 없습니다.", errors: parsed.errors, questions: parsed.questions });
      if (!isDatabaseConfigured()) return status(503, { message: "엑셀 검증이 완료되었습니다. 실제 저장하려면 DATABASE_URL을 설정해 주세요.", questions: parsed.questions });
      const examId = `admin-${crypto.randomUUID()}`;
      await getDb().transaction(async (tx) => {
        await tx.insert(exams).values({ id: examId, seriesId: examId, title: metadata.title!.trim(), level: metadata.level!.trim(), examYear: Number(metadata.year), category: metadata.category?.trim() || null, organization: metadata.organization?.trim() || null, passScore: Number(metadata.passScore), sourceName: metadata.sourceName?.trim() || null, sourceUrl: metadata.sourceUrl?.trim() || null, status: metadata.status === "published" ? "published" : "draft", publishedAt: metadata.status === "published" ? new Date() : null });
        await tx.insert(questions).values(parsed.questions.map((question, index) => ({ examId, order: index + 1, questionType: question.questionType, prompt: question.prompt, options: question.options, correctAnswer: question.correctAnswer, explanation: question.explanation })));
      });
      return { exam: { id: examId, title: metadata.title, questionCount: parsed.questions.length }, questions: parsed.questions };
    } catch (error) { return status(400, { message: error instanceof Error ? error.message : "엑셀 등록에 실패했습니다." }); }
  }, { body: t.Object({ metadata: t.String({ minLength: 2 }), file: t.File({ maxSize: "10m" }) }) })
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
