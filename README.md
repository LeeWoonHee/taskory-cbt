# taskory

Next.js App Router 안에서 Elysia API를 함께 실행하고, Neon PostgreSQL과 Drizzle ORM으로 회원 및 시험 결과를 저장하는 CBT 문제 풀이 서비스입니다.

시험 탐색은 카드 모음이 아닌 `자격증 → 급수 → 연도` 구조입니다. 예: 정보처리기능 → 1급 → 2026년.
시험 풀이 화면은 실제 시험지처럼 모든 문항과 선택지를 한 페이지에 연속으로 표시하며, 답안 번호를 누르면 해당 문항으로 이동합니다.

## 기술 구성

- Next.js 16 / React 19
- Elysia (`/api/[[...slugs]]` Route Handler)
- Neon PostgreSQL / Drizzle ORM
- Tailwind CSS 4 / shadcn/ui 기반 Button
- Motion / Phosphor Icons

## 로컬 실행

```bash
bun install
cp .env.example .env.local
bun run dev
```

회원가입, 로그인, 시험 목록, 응시 결과 저장은 Neon 연결이 필요합니다.

## 환경 변수

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
SESSION_SECRET=32자 이상의 임의 문자열
ADMIN_EMAIL=최초 관리자 계정으로 사용할 이메일
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

## 데이터베이스

```bash
bun run db:generate
bun run db:migrate
```

초기 마이그레이션은 `drizzle/0000_sparkling_menace.sql`에 생성됩니다.

## API

- `GET /api/health`
- `GET /api/exams`
- `GET /api/exams/:id`
- `POST /api/attempts`
- `GET /api/attempts/me`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/admin/overview` (관리자 전용)
- `PATCH /api/admin/users/:id/role` (관리자 전용)
- `POST /api/admin/exams/import` (관리자 전용, `.xlsx`/`.xls`/`.csv`)

## 관리자 페이지

`.env.local`에 `ADMIN_EMAIL`을 설정한 뒤 해당 이메일로 회원가입하고 로그인하면 자동으로 관리자 권한이 부여됩니다. 이후 `/admin`에서 관리자 콘솔에 접속할 수 있습니다. 기존 데이터베이스에는 역할 컬럼 마이그레이션을 적용해야 합니다.

### 시험 엑셀 등록

관리자 페이지의 `/admin/exams/new`에서 시험 정보를 입력한 뒤 엑셀 파일을 업로드합니다. 첫 번째 행에는 아래 컬럼명을 사용합니다.

```text
타입, 문제내용, 선택지1, 선택지2, 선택지3, 선택지4, 선택지5, 정답, 해설
```

`타입`은 `객관식` 또는 `주관식`이며, 객관식은 선택지 1~4가 필수이고 선택지 5는 선택입니다. 주관식은 선택지를 비우고 정답을 문자열로 입력합니다. 해설은 선택 입력입니다. 샘플 양식은 `public/exam-question-template.csv`에서 받을 수 있습니다.

## Vercel 배포

1. Neon 연결 문자열과 `SESSION_SECRET`을 Vercel 프로젝트 환경 변수에 등록합니다.
2. 배포 전 `bun run db:migrate`로 스키마를 적용합니다.
3. `vercel --prod` 또는 Vercel Git 연동으로 배포합니다.

Elysia는 Next.js Route Handler의 Web Standard `Request`/`Response` 위에서 실행되므로 별도 백엔드 서버가 필요하지 않습니다.
