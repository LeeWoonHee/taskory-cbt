import { desc, eq } from "drizzle-orm";

import { getDb, isDatabaseConfigured } from "@/db";
import { attempts } from "@/db/schema";
import { examSeries, findExamTitle, getExamById } from "@/data/exams";

export function listPublicExams() { return examSeries; }

export function getPublicExam(id: string) {
  const exam = getExamById(id);
  if (!exam) return null;
  return { id: exam.id, title: `${exam.seriesTitle} ${exam.level} · ${exam.year}년`, passScore: exam.passScore, source: exam.source, notice: exam.notice, questions: exam.questions.map(({ id: questionId, subject, prompt, options }) => ({ id: questionId, subject, prompt, options })) };
}

export async function scoreAttempt(input: { examId: string; answers: Array<number | null>; userId?: string | null }) {
  const exam = getExamById(input.examId);
  if (!exam) return null;
  const normalizedAnswers = exam.questions.map((_, index) => input.answers[index] ?? null);
  const correctCount = exam.questions.reduce((total, question, index) => total + (normalizedAnswers[index] === question.answer ? 1 : 0), 0);
  const score = Math.round((correctCount / exam.questions.length) * 100);
  if (isDatabaseConfigured()) await getDb().insert(attempts).values({ userId: input.userId ?? null, examId: input.examId, score, correctCount, totalCount: exam.questions.length, answers: normalizedAnswers });
  return {
    score,
    correctCount,
    totalCount: exam.questions.length,
    passed: score >= exam.passScore,
    review: input.userId ? exam.questions.map((question, index) => ({ questionId: question.id, selectedAnswer: normalizedAnswers[index], correctAnswer: question.answer, explanation: question.explanation, correct: normalizedAnswers[index] === question.answer })) : null,
  };
}

export async function listUserAttempts(userId: string) {
  if (!isDatabaseConfigured()) return [];
  const rows = await getDb().select({ id: attempts.id, examId: attempts.examId, score: attempts.score, correctCount: attempts.correctCount, totalCount: attempts.totalCount, completedAt: attempts.completedAt }).from(attempts).where(eq(attempts.userId, userId)).orderBy(desc(attempts.completedAt)).limit(20);
  return rows.map((attempt) => ({ ...attempt, examTitle: findExamTitle(attempt.examId) }));
}
