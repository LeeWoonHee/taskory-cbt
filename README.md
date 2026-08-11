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
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-발급받은_클라이언트_ID
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=pub-발급받은_게시자_ID
NEXT_PUBLIC_ADSENSE_HOME_SLOT_ID=홈_광고_단위_ID
NEXT_PUBLIC_ADSENSE_EXAMS_SLOT_ID=시험목록_광고_단위_ID
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
- `PATCH /api/admin/exams/:id` (관리자 전용, 시험명 변경)
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

## Google AdSense 설정

1. [Google AdSense](https://www.google.com/adsense/)에서 사이트를 등록하고 사이트 심사를 요청합니다.
2. AdSense의 사이트 설정에서 확인한 클라이언트 ID(`ca-pub-...`)와 게시자 ID(`pub-...`)를 로컬 `.env.local` 및 Vercel 환경 변수에 등록합니다.
3. AdSense에서 반응형 디스플레이 광고 단위를 만든 뒤 광고 단위 ID를 `NEXT_PUBLIC_ADSENSE_HOME_SLOT_ID`와 `NEXT_PUBLIC_ADSENSE_EXAMS_SLOT_ID`에 각각 등록합니다.
4. 재배포 후 `https://내도메인/ads.txt`에서 아래 형식의 응답이 보이는지 확인합니다.

```text
google.com, pub-게시자_ID, DIRECT, f08c47fec0942fa0
```

광고 스크립트와 광고 단위는 해당 환경 변수가 모두 설정된 경우에만 렌더링됩니다. 환경 변수가 비어 있으면 사이트에서 광고 영역을 숨기며, `/ads.txt`는 404를 반환합니다.

## 문의 및 의견

사이트 하단의 `문의 및 의견`에서 사용자의 기본 메일 앱을 열어 불편사항과 개선 의견을 보낼 수 있습니다. 접수 메일 주소는 `dldns012@gmail.com`입니다.
