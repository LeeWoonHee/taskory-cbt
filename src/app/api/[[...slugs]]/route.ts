import { api } from "@/server/app";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = api.fetch;
export const POST = api.fetch;
export const OPTIONS = api.fetch;
