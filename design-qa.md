# Design QA

## Comparison Target

- Source visual truth: `/Users/leewoonhee/Downloads/main.png`
- Source pixels: 2560 × 2240 PNG
- Implementation: `http://localhost:3010/`
- Implementation full-page screenshot: `/Users/leewoonhee/Project/next/taskory-cbt/qa/implementation-main-pass2.jpg`
- Same-viewport screenshot: `/Users/leewoonhee/Project/next/taskory-cbt/qa/implementation-main-viewport.jpg`
- Combined comparison: `/Users/leewoonhee/Project/next/taskory-cbt/qa/main-comparison-pass2.jpg`
- Mobile evidence: `/Users/leewoonhee/Project/next/taskory-cbt/qa/implementation-mobile.jpg`
- CSS viewport: 1280 × 1120, deviceScaleFactor 1
- Browser content capture: 1265 × 1120 after scrollbar reservation
- Density normalization: source was downsampled 2:1 to 1280 × 1120 and horizontally center-cropped to 1265 × 1120 for the combined comparison
- State: desktop home, default search state, white background

The reference is a dark wireframe while the user explicitly required a white page. The comparison therefore treats the reference as structural truth for header, hero, search, keyword chips, and footer proportions; the implementation color truth is the requested white background with restrained neutral surfaces.

## Findings

- No actionable P0, P1, or P2 differences remain.
- [P3] The supplied logo is too small to reuse as a production brand asset.
  - Location: global header and footer.
  - Evidence: the source logo occupies only a few pixels in the normalized reference; the implementation uses a Phosphor book icon and text lockup.
  - Impact: structure and visual weight match, but exact brand-asset fidelity cannot be judged.
  - Follow-up: replace the icon lockup when a vector or high-resolution official logo is available.

## Required Fidelity Surfaces

- Fonts and typography: Noto Sans KR Variable provides a calm Korean sans-serif hierarchy. Weight, line height, wrapping, and input copy remain readable at desktop and 390 px mobile.
- Spacing and layout rhythm: header, large rounded hero, centered search, three chips, archive explorer, and footer follow the source landmarks. The final full page is 1265 × 1183, close to the 1280 × 1120 normalized reference without clipping.
- Colors and visual tokens: body background is verified `rgb(255, 255, 255)`. Neutral gray borders/fills and a limited blue status accent replace the wireframe's dark canvas per the user's explicit requirement.
- Image quality and asset fidelity: the source contains no reusable hero imagery or card imagery. Icons use the Phosphor library; there are no CSS-drawn or placeholder image assets.
- Copy and content: every visible label describes CBT search, exams, organizations, availability, question count, or account actions. Demo questions are explicitly separated from public-source production data.
- Responsiveness: 390 × 844 mobile capture has no horizontal overflow; hero, search, chips, and the archive explorer remain usable.
- Accessibility: inputs have labels, controls use semantic buttons/links, radio groups are labeled, tap targets are at least 40 px, and focus/selection states have sufficient contrast.

## Focused Region Comparison

The combined comparison was inspected at the header, hero search region, and chip row. The source has no legible app typography or imagery beyond the tiny logo, so additional image-asset crops were unnecessary. Search height, rounded panel edge, and bottom action bands align with the reference structure.

## Comparison History

### Pass 1

- Finding: [P2] The recommendation heading created excessive vertical separation between the hero and the card row, increasing the page height to 1363 px and changing the reference rhythm.
- Fix: reduced main/footer padding and replaced the large recommendation heading with a compact row above the cards.
- Evidence: `/Users/leewoonhee/Project/next/taskory-cbt/qa/implementation-main-pass1.png`

### Pass 2

- Post-fix evidence: `/Users/leewoonhee/Project/next/taskory-cbt/qa/implementation-main-pass2.jpg`
- Result: card row now begins directly after the reference-sized gap; the page height is 1183 px and no major-region proportion mismatch remains.

### Post-QA iteration — 계층형 시험 아카이브

- 사용자 요구에 따라 확장성이 낮은 시험 카드 행을 `자격증 → 급수 → 연도` 탐색기로 교체했습니다.
- `정보처리기능 → 1급 → 2026년`의 실제 데모 시험 진입 경로와 2009~2026년 연도 목록을 확인했습니다.
- 시험 실행 화면에서 시간 UI와 시간 데이터 필드를 제거했습니다.
- Evidence: `/Users/leewoonhee/Project/next/taskory-cbt/qa/catalog-hierarchy-final.jpg`
- Result: 계층 탐색 및 시간 미표시 검증 통과.

## Functional Verification

- Main search navigates to a filtered exam list.
- Exam list opens the available CBT exam.
- Answer selection and submission return a score through the Elysia API.
- Anonymous results hide answer review and show the login CTA.
- Login, signup, and mypage routes render their required forms and empty states.
- Authenticated mypage data is read from `GET /api/attempts/me`; unauthenticated access correctly returns 401.
- Browser console errors: none.
- 시험 풀이 화면은 모든 문항을 한 페이지에 연속 표시하며, 이전/다음 문항 전환 버튼 없이 답안 현황 번호로 문항 위치를 이동합니다.

## Follow-up Polish

- Replace the temporary icon-based brand lockup with the official logo when supplied.
- Add production AdSense slots only after the publisher and slot IDs are issued.

final result: passed
