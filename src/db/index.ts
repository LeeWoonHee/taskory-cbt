import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as schema from "@/db/schema";

function createDatabase(url: string) {
  return drizzle({ client: new Pool({ connectionString: url, max: 1 }), schema });
}

let database: ReturnType<typeof createDatabase> | null = null;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL 환경 변수가 설정되지 않았습니다.");
  database ??= createDatabase(url);
  return database;
}
