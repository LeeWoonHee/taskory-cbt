import { count, desc, eq } from "drizzle-orm";

import { getDb, isDatabaseConfigured } from "@/db";
import { attempts, users } from "@/db/schema";
import { examSeries, findExamTitle } from "@/data/exams";

export async function getAdminOverview() {
  if (!isDatabaseConfigured()) {
    return {
      stats: { userCount: 1, attemptCount: 1, examCount: examSeries.length },
      users: [{
        id: "test-member",
        name: "테스트 회원",
        email: "test-member@example.com",
        role: "user",
        createdAt: "2026-08-05T09:00:00.000Z",
        attempts: [{ id: "test-attempt", examTitle: "정보처리기능 1급 · 2026년", score: 80, correctCount: 4, totalCount: 5, completedAt: "2026-08-05T09:30:00.000Z" }],
      }],
    };
  }

  const db = getDb();
  const [[userCount], [attemptCount], userRows, attemptRows] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(attempts),
    db.select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)).limit(50),
    db.select({ id: attempts.id, userId: attempts.userId, examId: attempts.examId, score: attempts.score, correctCount: attempts.correctCount, totalCount: attempts.totalCount, completedAt: attempts.completedAt }).from(attempts).orderBy(desc(attempts.completedAt)).limit(500),
  ]);

  const attemptsByUser = new Map<string, Array<{ id: string; examTitle: string; score: number; correctCount: number; totalCount: number; completedAt: string }>>();
  for (const attempt of attemptRows) {
    if (!attempt.userId) continue;
    const userAttempts = attemptsByUser.get(attempt.userId) ?? [];
    userAttempts.push({ id: attempt.id, examTitle: findExamTitle(attempt.examId), score: attempt.score, correctCount: attempt.correctCount, totalCount: attempt.totalCount, completedAt: attempt.completedAt.toISOString() });
    attemptsByUser.set(attempt.userId, userAttempts);
  }

  return {
    stats: { userCount: userCount.value, attemptCount: attemptCount.value, examCount: examSeries.length },
    users: userRows.map((user) => ({ ...user, createdAt: user.createdAt.toISOString(), attempts: attemptsByUser.get(user.id) ?? [] })),
  };
}

export async function updateUserRole(userId: string, role: "user" | "admin", currentUserId: string) {
  if (!isDatabaseConfigured() || userId === currentUserId && role !== "admin") return null;
  const [user] = await getDb().update(users).set({ role }).where(eq(users.id, userId)).returning({ id: users.id, name: users.name, email: users.email, role: users.role });
  return user ?? null;
}
