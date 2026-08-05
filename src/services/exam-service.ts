import { desc, eq } from "drizzle-orm";

import { getDb } from "@/db";
import { attempts, exams, questions } from "@/db/schema";

function displayTitle(exam: { title: string; level: string | null; examYear: number; examMonth: number | null; examRound: number | null }) {
  return [exam.title, exam.level, `${exam.examYear}년${exam.examMonth ? ` ${exam.examMonth}월` : ""}${exam.examRound ? ` ${exam.examRound}회` : ""}`].filter(Boolean).join(" · ");
}

export async function getPublicExam(id: string) {
  const [exam] = await getDb().select().from(exams).where(eq(exams.id, id)).limit(1);
  if (!exam || exam.status !== "published") return null;
  const rows = await getDb().select().from(questions).where(eq(questions.examId, id)).orderBy(questions.order);
  return { id: exam.id, title: displayTitle(exam), passScore: exam.passScore, source: exam.sourceName ?? "", notice: exam.sourceUrl ?? "", questions: rows.map((question) => {
    const legacyParts = !question.context && question.prompt.includes("\n\n") ? question.prompt.split(/\n\n+/) : null;
    return { id: question.id, questionType: question.questionType, subject: question.subject ?? "", prompt: legacyParts?.[0] ?? question.prompt, context: question.context ?? (legacyParts ? legacyParts.slice(1).join("\n\n") : null), options: Array.isArray(question.options) ? question.options : [] };
  }) };
}

export async function scoreAttempt(input: { examId: string; answers: Array<number | string | null>; userId?: string | null }) {
  const [exam] = await getDb().select().from(exams).where(eq(exams.id, input.examId)).limit(1);
  if (!exam || exam.status !== "published") return null;
  const rows = await getDb().select().from(questions).where(eq(questions.examId, input.examId)).orderBy(questions.order);
  const normalizedAnswers = rows.map((_, index) => input.answers[index] ?? null);
  const correct = (answer: number | string | null, question: typeof rows[number]) => {
    if (answer === null) return false;
    if (question.questionType === "subjective") return String(answer).trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    return String(answer) === question.correctAnswer;
  };
  const correctCount = rows.reduce((total, question, index) => total + (correct(normalizedAnswers[index], question) ? 1 : 0), 0);
  const score = rows.length ? Math.round((correctCount / rows.length) * 100) : 0;
  if (input.userId) await getDb().insert(attempts).values({ userId: input.userId, examId: input.examId, score, correctCount, totalCount: rows.length, answers: normalizedAnswers });
  return { score, correctCount, totalCount: rows.length, passed: exam.passScore === null ? null : score >= exam.passScore, passScore: exam.passScore, review: input.userId ? rows.map((question, index) => ({ questionId: question.id, selectedAnswer: normalizedAnswers[index], correctAnswer: question.questionType === "objective" ? Number(question.correctAnswer) : question.correctAnswer, explanation: question.explanation ?? "", correct: correct(normalizedAnswers[index], question) })) : null };
}

export async function listUserAttempts(userId: string) {
  const rows = await getDb().select({ id: attempts.id, examId: attempts.examId, examTitle: exams.title, score: attempts.score, correctCount: attempts.correctCount, totalCount: attempts.totalCount, completedAt: attempts.completedAt }).from(attempts).leftJoin(exams, eq(attempts.examId, exams.id)).where(eq(attempts.userId, userId)).orderBy(desc(attempts.completedAt)).limit(20);
  return rows.map((attempt) => ({ ...attempt, examTitle: attempt.examTitle ?? attempt.examId }));
}
