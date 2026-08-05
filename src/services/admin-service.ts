import { count, desc, eq } from "drizzle-orm";

import { getDb } from "@/db";
import { attempts, exams, questions, users } from "@/db/schema";

export async function getAdminOverview() {
  const db = getDb();
  const [[userCount], [attemptCount], [examCount], userRows, attemptRows, examRows] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(attempts),
    db.select({ value: count() }).from(exams),
    db.select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)).limit(50),
    db.select({ id: attempts.id, userId: attempts.userId, examId: attempts.examId, examTitle: exams.title, score: attempts.score, correctCount: attempts.correctCount, totalCount: attempts.totalCount, completedAt: attempts.completedAt }).from(attempts).leftJoin(exams, eq(attempts.examId, exams.id)).orderBy(desc(attempts.completedAt)).limit(500),
    db.select({ id: exams.id, title: exams.title, level: exams.level, examYear: exams.examYear, examMonth: exams.examMonth, examRound: exams.examRound, status: exams.status, questionCount: count(questions.id), createdAt: exams.createdAt }).from(exams).leftJoin(questions, eq(questions.examId, exams.id)).groupBy(exams.id, exams.title, exams.level, exams.examYear, exams.examMonth, exams.examRound, exams.status, exams.createdAt).orderBy(desc(exams.createdAt)),
  ]);
  const attemptsByUser = new Map<string, Array<{ id: string; examTitle: string; score: number; correctCount: number; totalCount: number; completedAt: string }>>();
  for (const attempt of attemptRows) {
    if (!attempt.userId) continue;
    const userAttempts = attemptsByUser.get(attempt.userId) ?? [];
    userAttempts.push({ id: attempt.id, examTitle: attempt.examTitle ?? attempt.examId, score: attempt.score, correctCount: attempt.correctCount, totalCount: attempt.totalCount, completedAt: attempt.completedAt.toISOString() });
    attemptsByUser.set(attempt.userId, userAttempts);
  }
  return { stats: { userCount: userCount.value, attemptCount: attemptCount.value, examCount: examCount.value }, users: userRows.map((user) => ({ ...user, createdAt: user.createdAt.toISOString(), attempts: attemptsByUser.get(user.id) ?? [] })), exams: examRows.map((exam) => ({ ...exam, createdAt: exam.createdAt.toISOString(), questionCount: Number(exam.questionCount) })) };
}

export async function updateExamStatus(examId: string, status: "draft" | "published") {
  const [exam] = await getDb().update(exams).set({ status, publishedAt: status === "published" ? new Date() : null }).where(eq(exams.id, examId)).returning({ id: exams.id, status: exams.status });
  return exam ?? null;
}

export async function updateUserRole(userId: string, role: "user" | "admin", currentUserId: string) {
  if (userId === currentUserId && role !== "admin") return null;
  const [user] = await getDb().update(users).set({ role }).where(eq(users.id, userId)).returning({ id: users.id, name: users.name, email: users.email, role: users.role });
  return user ?? null;
}
