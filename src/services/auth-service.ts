import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";

import { getDb, isDatabaseConfigured } from "@/db";
import { users } from "@/db/schema";

const COOKIE_NAME = "cbt_session";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET 환경 변수가 설정되지 않았습니다.");
  return new TextEncoder().encode(secret);
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  const db = getDb();
  const email = input.email.trim().toLowerCase();
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length) throw new Error("이미 가입된 이메일입니다.");
  const passwordHash = await hash(input.password, 12);
  const [user] = await db.insert(users).values({ name: input.name.trim(), email, passwordHash }).returning({ id: users.id, name: users.name, email: users.email });
  return user;
}

export async function loginUser(input: { email: string; password: string }) {
  const db = getDb();
  const email = input.email.trim().toLowerCase();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !(await compare(input.password, user.passwordHash))) throw new Error("이메일 또는 비밀번호를 확인해 주세요.");
  const configuredAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (configuredAdminEmail && configuredAdminEmail === email && user.role !== "admin") {
    await db.update(users).set({ role: "admin" }).where(eq(users.id, user.id));
    user.role = "admin";
  }
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function createSessionToken(user: { id: string; name: string; email: string }) {
  return new SignJWT({ name: user.name, email: user.email }).setProtectedHeader({ alg: "HS256" }).setSubject(user.id).setIssuedAt().setExpirationTime("7d").sign(getSecret());
}

export function createSessionCookie(token: string) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function isAdminBypassEnabled() {
  return process.env.NODE_ENV !== "production" && process.env.ADMIN_BYPASS === "true";
}

export async function getCurrentUser(request: Request) {
  if (!isDatabaseConfigured() || !process.env.SESSION_SECRET) return null;
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub) return null;
    const [user] = await getDb().select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users).where(eq(users.id, payload.sub)).limit(1);
    return user ?? null;
  } catch { return null; }
}

export async function getAdminUser(request: Request) {
  if (isAdminBypassEnabled()) {
    return { id: "test-admin", name: "테스트 관리자", email: process.env.ADMIN_EMAIL ?? "test-admin@localhost", role: "admin" as const };
  }
  const user = await getCurrentUser(request);
  return user?.role === "admin" ? user : null;
}
