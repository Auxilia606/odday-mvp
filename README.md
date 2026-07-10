# Odday

> 오늘을 조금 이상하게. — Make today a little odd.

평범한 하루에 작은 현실 퀘스트를 제안하고, 사용자가 실제로 평소와 다른 행동을 하는지
익명 행동 데이터로 검증하는 GitHub Pages 기반 MVP.

기획·검증 배경은 [docs/concept/MVP.md](docs/concept/MVP.md) 참고.

## 기술 스택

- Vite + React + TypeScript
- Tailwind CSS
- 백엔드/DB 없음 — 순수 정적 SPA. 개인 기록은 `localStorage`, 익명 식별자는 `crypto.randomUUID()`
- 행동 데이터는 이벤트 추상화 레이어(`src/lib/analytics.ts`)로 수집. 현재는 console/localStorage 싱크이며, PostHog·Umami 등은 어댑터만 추가하면 연결됨

## 개발

```bash
npm install
npm run dev        # http://localhost:5173/odday/
npm run build      # tsc + vite build → dist/
npm run preview    # 프로덕션 빌드 미리보기
```

## 배포 (GitHub Pages)

`main`/`master` 푸시 시 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)이
자동 빌드·배포한다. 최초 1회 수동 설정 필요:

1. GitHub 레포 **Settings → Pages → Source** 를 **GitHub Actions**로 지정
2. `vite.config.ts`의 `base`는 `/odday/`로 설정되어 있음 — 레포 이름이 다르면 함께 변경

배포 주소: `https://{username}.github.io/odday/`

## 구조

```
src/
├── types/       분석 이벤트 · 퀘스트 타입
├── data/        하드코딩 퀘스트 데이터셋 + 상황별 필터
├── lib/         visitor · ref · analytics · storage · share
├── state/       useOddayFlow (스텝 상태 머신 + 이벤트 발생)
├── screens/     Start · Context · QuestList · QuestDetail · Feedback · NextQuest · History
└── components/  공용 UI
```

## 유입 경로 측정

`?ref=linkedin-post` 등 쿼리 파라미터로 진입하면 세션 동안 유지되어 모든 이벤트에 첨부된다.
(`linkedin-profile`, `linkedin-post`, `github`, `portfolio`, `friend`, `community`)
