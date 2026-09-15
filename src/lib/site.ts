/**
 * 사이트 기본 도메인 및 절대 URL 생성 헬퍼
 * 프로덕션 기본 도메인은 www.taskory.work 입니다. (apex 도메인은 www로 리다이렉트)
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.taskory.work";

export function absoluteUrl(path = ""): string {
  if (!path || path === "/") return SITE_URL;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}
