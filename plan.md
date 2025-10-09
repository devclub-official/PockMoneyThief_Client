## 프로젝트 구현 계획 (plan.md)

> 본 문서는 `requirements.md`를 기반으로 한 단계별 구현 계획입니다. Next.js 15(App Router) + TypeScript를 중심으로, 성능·접근성·공정성(검증 가능 추첨)을 최우선 목표로 합니다. 모든 항목은 한국어 기준으로 작성되었습니다.

### 0. 범위와 목표 정리

- **핵심 목표**: 누구나 재현 가능한 공정한 추첨(래플) 플랫폼 구축
- **1차 출시(MVP) 범위**
  - 홈(진행 중/마감 리스트, 공정성 소개 섹션)
  - 카카오 로그인(OAuth) 기반 회원 인증
  - 추첨 등록(Admin)·추첨 상세·추첨 참여(1인 1회 제한)
  - 시드 공개(외부 데이터 원천 표기) 및 결과 생성/검증 UI(재현 절차 제공)
  - 기본 배송 정보 입력(마이페이지), 관리자 대시보드(리스트/상태 변경)
  - 다크/라이트/시스템 모드, 반응형 UI, 기본 SEO, 접근성 기본 수칙
- **후속 범위(차차 확장)**
  - 고급 애니메이션/브랜드 캠페인 테마(할로윈/크리스마스)
  - 추가 외부 시드 소스, 고급 통계/리포트, 오픈소스 레포 공개

### 1. 기술 스택 정합성

- Framework: Next.js 15(App Router) + TypeScript
- Styling: Tailwind CSS
- Data Fetching: React Query + `ky`
- Form: React Hook Form + Zod
- State: Jotai(필요 시)
- Formatting: ESLint + Prettier
- Git Hooks: Husky
- Auth: 카카오 OAuth(커스텀 라우트 + JWT 세션)
- Error logging: Sentry
- Package Manager: pnpm

### 2. 마일스톤

| 단계 | 마일스톤            | 핵심 산출물                                                               |
| ---- | ------------------- | ------------------------------------------------------------------------- |
| 0    | 기초 설계/레포 준비 | 레포 생성, 이슈 템플릿, 브랜치 전략                                       |
| 1    | 프로젝트 부트스트랩 | Next.js 15(app router), TS, Tailwind, ESLint/Prettier, Husky, Sentry 설정 |
| 2    | UI 프레임/레이아웃  | 전역 레이아웃, 헤더/푸터, 다크모드, 테마 토글                             |
| 3    | 인증(카카오)        | OAuth 흐름, JWT 세션, 보호 라우트 가드                                    |
| 4    | 타입/도메인 정의    | `types/`, `lib/schemas.ts`, 상수, 유틸                                    |
| 5    | API/데이터 계층     | `lib/api.ts`, React Query Provider, 쿼리/뮤테이션 훅                      |
| 6    | 추첨 등록(Admin)    | 등록 폼, 이미지/기간/시드소스 설정, 검증                                  |
| 7    | 추첨 참여/중복 방지 | 참여 버튼/상태, 1인 1회 로직, 피드백 UI                                   |
| 8    | 시드 공개/외부 연동 | 시드 소스 명시, 외부 API 스텁/연동 전략                                   |
| 9    | 결과 생성/검증 UI   | 결정적 난수 설계, 재현 절차, 코드 보기                                    |
| 10   | 마이페이지/배송     | 참여·당첨 내역, 배송지 입력/변경                                          |
| 11   | 관리자 대시보드     | 상품/회원/배송 상태 관리                                                  |
| 12   | 접근성/성능         | ARIA/키보드 내비, LCP/TTFB, 이미지 최적화                                 |
| 13   | SEO/메타            | 메타 태그, 오픈그래프, 사이트맵/robots                                    |
| 14   | 배포/운영           | Vercel 배포, 환경변수, 모니터링                                           |
| 15   | 테마/에셋 정책      | 시즌 테마 시스템, Pixabay/Heroicons 정책                                  |

#### 마일스톤 진행 체크리스트

- [x] 0.  기초 설계/레포 준비
  - [x] 레포 생성
  - [x] 이슈 템플릿 구성
  - [x] 브랜치 전략 정의
- [x] 1.  프로젝트 부트스트랩
  - [x] Next.js 15(app router) 프로젝트 초기화
  - [x] TypeScript 설정 검증
  - [x] Tailwind CSS 설정 완료
  - [x] ESLint/Prettier 규칙 적용
  - [x] Husky/lint-staged 적용
  - [x] Sentry 초기화/환경변수 연동
- [ ] 2.  UI 프레임/레이아웃
  - [ ] 전역 레이아웃 구축(`app/layout.tsx`)
  - [ ] 헤더/푸터 컴포넌트 추가
  - [ ] 다크모드/테마 토글 동작
- [ ] 3.  인증(카카오)
  - [ ] 로그인 진입 페이지(`/login`)
  - [ ] 카카오 OAuth 콜백 처리
  - [ ] JWT 세션 발급 및 쿠키 저장(HttpOnly)
  - [ ] 보호 라우트 가드 동작 확인
- [ ] 4.  타입/도메인 정의
  - [ ] `types/index.ts` 기본 인터페이스 작성
  - [ ] `lib/schemas.ts` Zod 스키마 작성
  - [ ] `lib/constants.ts` 상수 분리
- [ ] 5.  API/데이터 계층
  - [ ] `lib/client.ts`(ky 인스턴스) 구성
  - [ ] `lib/api.ts` 기능별 메서드 정의
  - [ ] React Query Provider 적용 및 기본 쿼리 훅 작성
- [ ] 6.  추첨 등록(Admin)
  - [ ] 등록 폼 UI/유효성
  - [ ] 이미지/기간/시드 소스 입력 처리
  - [ ] 생성 후 상세 페이지 이동
- [ ] 7.  추첨 참여/중복 방지
  - [ ] 참여 버튼/상태 처리
  - [ ] 1인 1회 제한 서버/클라이언트 로직
  - [ ] 사용자 피드백(토스트/상태)
- [ ] 8.  시드 공개/외부 연동
  - [ ] 시드 소스 정보 공개(발표 전 고정)
  - [ ] 외부 API 스텁/연동 전략 문서화
- [ ] 9.  결과 생성/검증 UI
  - [ ] 결정적 난수 로직 구현(SHA256 기반)
  - [ ] 재현 절차/코드 스니펫 노출
  - [ ] 결과/해시/입력값 UI 공개
- [ ] 10. 마이페이지/배송
  - [ ] 참여/당첨 내역 조회
  - [ ] 배송지 입력/수정
- [ ] 11. 관리자 대시보드
  - [ ] 상품/회원/배송 리스트 및 상태 변경
  - [ ] 검색/필터/동기화(Optimistic/Invalidate)
- [ ] 12. 접근성/성능
  - [ ] ARIA/키보드 내비게이션 점검
  - [ ] LCP/TTFB 목표 충족 확인
  - [ ] 이미지 최적화(Next/Image + WebP)
- [ ] 13. SEO/메타
  - [ ] 메타/OG/트위터 카드 설정
  - [ ] sitemap.xml/robots.txt 생성
- [ ] 14. 배포/운영
  - [ ] Vercel 배포 파이프라인 구성
  - [ ] 환경변수 분리(Preview/Prod)
  - [ ] Sentry 릴리즈/소스맵 업로드
- [ ] 15. 테마/에셋 정책
  - [ ] 시즌 테마 시스템(기본/이벤트) 구성
  - [ ] Pixabay/Heroicons 사용 가이드 정리

### 3. 디렉터리 구조(초안)

```
src/
  app/
    layout.tsx
    page.tsx                # 홈
    (auth)/login/page.tsx   # 카카오 로그인 진입
    raffles/
      page.tsx              # 추첨 리스트
      [id]/page.tsx         # 추첨 상세/참여
      [id]/result/page.tsx  # 결과/검증
    admin/
      raffles/new/page.tsx  # 추첨 등록
      dashboard/page.tsx    # 관리자 대시보드
    my/page.tsx             # 마이페이지
  components/
    common/
    features/
  hooks/
  lib/
    api.ts
    client.ts               # ky 인스턴스, sentry 등
    schemas.ts              # Zod 스키마
    constants.ts
    utils.ts
  types/
    index.ts
  styles/
    globals.css
```

### 4. 환경 구성(명령/체크리스트)

- 프로젝트 생성(비대화형, 루트 생성 시 점 위치 사용 가능)
  - `pnpm dlx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --use-pnpm --import-alias "@/*"`
- 필수 패키지
  - `pnpm add @tanstack/react-query ky jotai zod react-hook-form`
  - `pnpm add -D @types/node @types/react eslint prettier eslint-config-prettier eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks husky lint-staged`
  - `pnpm add @sentry/nextjs`
- 초기 설정
  - Husky: `pnpm dlx husky-init && pnpm install` → `pre-commit`에 `lint-staged` 실행 추가
  - ESLint/Prettier: 프로젝트 규칙에 맞춰 확장/룰 구성
  - Tailwind: CSS 레이어/프리플라이트, 다크모드 class 전략
  - React Query Provider: `app/layout.tsx`에서 QueryClientProvider 래핑
  - Sentry: `@sentry/nextjs` 초기화 및 환경변수 연동

### 5. 환경변수(.env) 설계

- `NEXT_PUBLIC_APP_URL`
- `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`, `KAKAO_REDIRECT_URI`
- `JWT_SECRET`
- `SENTRY_DSN`
- 외부 시드 소스 키(필요 시) 예: `KOSPI_API_KEY`, `KMA_API_KEY`

### 6. 공통 UI/레이아웃

- 전역 레이아웃: 헤더(로고, 로그인/마이), 푸터(공정성 소개 링크)
- **다크/라이트/시스템**: 사용자 토글 + 시스템 감지, `data-theme` 또는 class 전략
- 반응형: 360px 이상, 주요 브레이크포인트에서 레이아웃 변형
- 접근성: Landmark, Skip link, 키보드 포커스 스타일, ARIA 라벨

### 7. 인증(카카오 OAuth + JWT)

- 흐름
  1. `/login` → 카카오 인증 링크 이동
  2. 카카오 콜백 → 서버 라우트에서 사용자 식별 정보 수신
  3. 서버에서 자체 JWT 발급(만료 포함) → HttpOnly 쿠키 저장
  4. 클라이언트는 JWT 기반으로 보호 리소스 접근
- 보호 라우트: `middleware` 또는 서버 컴포넌트에서 세션 검증
- 탈퇴/로그아웃: 쿠키 삭제, 서버 세션 무효화(필요 시)

### 8. 도메인/타입/스키마

- `types/index.ts`: User, Raffle, Entry, Shipment, SeedSource 등 인터페이스 정의
- `lib/schemas.ts`: 등록/참여/배송 등 Zod 스키마 정의
- `lib/constants.ts`: 하드코딩 문자열/숫자 분리(예: 참여 제한 수, 날짜 포맷)

### 9. API 계층 및 데이터 패칭

- `lib/client.ts`에 ky 인스턴스 생성(베이스 URL, 헤더, 에러 인터셉트)
- `lib/api.ts`에 기능별 메서드 정의 예시
  - `raffleApi.getList()`, `raffleApi.getById(id)`, `raffleApi.create(payload)`
  - `entryApi.participate(raffleId)`, `shipmentApi.update(...)` 등
- React Query
  - 쿼리 키: `['raffles']`, `['raffle', id]`, `['entries', raffleId]` 등 명확화
  - 오류 핸들링: Sentry 로깅 + 사용자 피드백 토스트

### 10. 기능별 화면 계획(AC 포함)

- 홈(Home)
  - 진행 중/마감 리스트, 공정성 소개 카드
  - AC: SSR로 LCP 최적화, 리스트 10개 페이지네이션, 다크모드 대응

- 추첨 등록(Admin)
  - 상품명/이미지/기간/시드 소스 선택/seed 생성 기준 입력 폼
  - 유효성(Zod) + 미리보기, 등록 성공 시 상세로 라우팅
  - AC: 필수값 유효성 오류 메시지, 비정상 값 서버 검증

- 추첨 상세
  - 상품 정보/참여 조건/시드 정보, 참여 버튼
  - AC: 로그인 상태에서만 참여 버튼 활성, 이미 참여 시 비활성/알림

- 결과/검증
  - 당첨자 공개, seed/참여자 목록, "동일 결과 재현" 단계 안내
  - AC: 동일 입력으로 동일 결과 도출, 코드 스니펫/해시값 일치 표시

- 마이페이지(My)
  - 참여/당첨 내역, 배송지 입력/수정
  - AC: 필수 필드 유효성, 변경 이력 반영

- 관리자 대시보드
  - 상품/회원/배송 상태 테이블, 검색/필터, 상태 변경
  - AC: 서버 반영 후 UI 즉시 동기화(Optimistic Update/Invalidate)

### 11. 결정적 난수/검증 설계(핵심)

- 목표: 외부 시드 + 참여자 명단으로 누구나 재현 가능한 결과 생성
- 입력
  - `externalSeed`: 외부 데이터(예: KOSPI 종가, 기상 데이터)에서 가져온 문자열/숫자
  - `participants`: 정렬된(안정 정렬) 참여자 식별자 목록
  - `raffleId`: 고유 식별자
  - `salt`: 운영자 공개 고정 문자열(사전 공개)
- 절차(개요)
  1. `base = SHA256(externalSeed + '\n' + JSON.stringify(participants) + '\n' + raffleId + '\n' + salt)`
  2. 난수 스트림: `r_i = SHA256(base + ':' + i)`를 반복 생성 → 정수화
  3. `Fisher–Yates` 방식으로 인덱스 섞기 또는 상위 `k`개를 당첨자로 선택
  4. 최종 결과/해시/입력값을 UI에 공개, 누구나 동일 로직으로 재현 가능
- 보안/무결성 유의
  - 모든 입력값은 결과 발표 이전에 고정/공개(타임스탬프 기록)
  - 정렬 규칙/직렬화 규약(JSON.stringify 옵션) 명시
  - 코드 스니펫 및 GitHub 공개(추후)

### 12. 외부 데이터(시드) 연동 전략

- MVP: 시드 값은 외부 API 호출 없이 수동/준실시간 공개로 시작(불가 시 모의 API)
- 확장: KOSPI 종가/기상청 데이터 등 공식 API 연동
  - 실패 대비: 타임아웃/폴백, 결과 캐싱, 호출 로그/감사 추적

### 13. 접근성/성능/보안 목표

- 접근성
  - 색 대비 4.5:1 이상, 키보드 포커스 가능, 스크린리더 ARIA 라벨
- 성능(초기 지표)
  - LCP ≤ 2.0s(SSR+CDN), TTFB ≤ 500ms, Next/Image + WebP
- 보안
  - HTTPS, JWT HttpOnly, CSRF 보호, 입력 검증(Zod + 서버)

### 14. SEO/메타/이미지·아이콘 정책

- SEO: 메타 태그, 오픈그래프/트위터 카드, sitemap.xml, robots.txt
- 이미지/비디오: `pixabay` 고지, 라이선스 준수, 출처 기록
- 아이콘: Heroicons 사용, 크레딧/버전 고정

### 15. 배포/운영

- Vercel 배포(Preview → Production), 환경변수 프로젝트/환경별 분리
- Sentry 릴리즈 트래킹, 소스맵 업로드
- 로그/알림: 에러 알림 채널(Webhook) 연동 고려

### 16. 작업 프로세스/컨벤션

- 커밋 메시지 규칙(`feat`, `fix`, `refactor`, `style`, `docs`, `chore`)
- PR 템플릿(변경 요약, 스크린샷, 체크리스트, 이슈 링크)
- 체크리스트(요구 문서 기준)
  1. 타입 정의 먼저 → 2) API 함수 → 3) 커스텀 훅 → 4) 컴포넌트 → 5) 스타일링 → 6) 에러 핸들링

### 17. 초기 구현 우선순위(구체 태스크)

1. 부트스트랩/설정
   - Next.js 생성, ESLint/Prettier/Husky, Tailwind, Sentry
2. 전역 레이아웃/테마
   - 헤더/푸터, 테마 토글, 다크모드, 반응형 그리드
3. 도메인 타입/스키마
   - `types/index.ts`, `lib/schemas.ts`, `lib/constants.ts`
4. 데이터 계층
   - `ky` 인스턴스, `lib/api.ts`, React Query Provider
5. 인증
   - 카카오 OAuth 라우트, JWT 세션, 보호 라우트 가드
6. 핵심 화면
   - 홈, 추첨 리스트/상세/참여, 등록(Admin), 결과/검증, My, Admin 대시보드
7. 접근성/성능/SEO 기본선 충족
   - LCP/TTFB 점검, ARIA/키보드 내비, 기본 메타/OG
8. 운영/배포
   - Vercel, 환경변수, Sentry 릴리즈

### 18. 수용 기준(DoD) 요약

- 동일 입력(시드/참여자/raffleId/salt) → 동일 결과(해시·당첨자) 재현 가능
- 로그인 사용자만 참여 가능, 1인 1회 제한이 서버에서 강제됨
- 접근성 핵심 항목 통과, Core Web Vitals 목표 충족(LCP/TTFB)
- 이미지/아이콘 라이선스 준수, 시드 출처/타임스탬프 명확 공개
- 코드/설정 문서화(`README`, 본 `plan.md`) 완료
