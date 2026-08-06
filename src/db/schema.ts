import { integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const exams = pgTable("exams", {
  id: varchar("id", { length: 160 }).primaryKey(),
  seriesId: varchar("series_id", { length: 160 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  level: varchar("level", { length: 40 }),
  examYear: integer("exam_year").notNull(),
  examMonth: integer("exam_month"),
  examRound: integer("exam_round"),
  category: varchar("category", { length: 120 }),
  organization: varchar("organization", { length: 200 }),
  status: varchar("status", { length: 32 }).default("draft").notNull(),
  passScore: integer("pass_score"),
  sourceName: varchar("source_name", { length: 240 }),
  sourceUrl: text("source_url"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  examId: varchar("exam_id", { length: 160 }).notNull().references(() => exams.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  questionType: varchar("question_type", { length: 20 }).default("objective").notNull(),
  subject: varchar("subject", { length: 160 }),
  prompt: text("prompt").notNull(),
  context: text("context"),
  options: jsonb("options").$type<string[] | null>(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const attempts = pgTable("attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  examId: varchar("exam_id", { length: 160 }).notNull(),
  examTitle: varchar("exam_title", { length: 200 }).notNull(),
  score: integer("score").notNull(),
  correctCount: integer("correct_count").notNull(),
  totalCount: integer("total_count").notNull(),
  answers: jsonb("answers").$type<Array<number | string | null>>().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;
export type UserRole = "user" | "admin";
