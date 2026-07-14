# Odday에 FSD 적용하기

> FSD 개념 자체는 [fsd-concepts.md](./fsd-concepts.md)를 먼저 읽으세요.
> 이 문서는 **Odday MVP의 실제 코드**가 FSD 구조에 어떻게 매핑되는지를 다룹니다.
> 전환은 **완료되었으며**, 아래는 그 결과와 판단 근거입니다.

## 1. 이전 구조 (flat, 전환 전)

전환 전 `src/`는 "성격별 폴더"로 나뉘어 있었습니다. (기록용 — 지금은 존재하지 않습니다.)

```
src/
  App.tsx              # 스텝 기반 화면 전환 (라우터 역할)
  main.tsx             # 진입점
  index.css            # 전역 스타일
  screens/             # 화면 7개 (Start, Context, QuestList, QuestDetail, Feedback, NextQuest, History)
  components/ui.tsx     # 공용 UI 컴포넌트
  state/useOddayFlow.ts # 전체 흐름 상태 오케스트레이션
  data/quests.ts        # 퀘스트 데이터셋 + 추천 로직(pickQuests)
  lib/                 # analytics, posthog, storage, visitor, ref, share
  types/               # quest, analytics 타입
```

이 구조는 "성격별 폴더(screens/components/lib)"라서, 기능이 커질수록 한 기능의 코드가 여러 폴더에 흩어집니다.
FSD는 이걸 **도메인별(슬라이스)** 로 다시 묶습니다.

## 2. 현재 구조 (FSD)

전환 후 실제 `src/` 트리입니다.

```
src/
  app/                              # ── 레이어: app (전역 설정)
    App.tsx                         #   스텝 전환 = 우리 앱의 "라우터"
    main.tsx                        #   진입점 (PostHog 어댑터 등록)
    styles/index.css                #   전역 스타일
    flow/useOddayFlow.ts            #   전체 흐름 오케스트레이션 (아래 3.2 참고)

  pages/                            # ── 레이어: pages (스텝 = 화면)
    start/        { ui/StartScreen.tsx,        index.ts }
    context/      { ui/ContextScreen.tsx,      index.ts }
    quest-list/   { ui/QuestListScreen.tsx,    index.ts }
    quest-detail/ { ui/QuestDetailScreen.tsx,  index.ts }
    feedback/     { ui/FeedbackScreen.tsx, model/feedback.ts, index.ts }
    next-quest/   { ui/NextQuestScreen.tsx,    index.ts }
    history/      { ui/HistoryScreen.tsx,      index.ts }

  features/                         # ── 레이어: features (재사용되는 상호작용)
    share-odday/  { model/shareOdday.ts, index.ts }

  entities/                         # ── 레이어: entities (비즈니스 개념 = 명사)
    quest/
      model/quest.ts                #   타입 + 라벨 (기존 types/quest.ts)
      model/dataset.ts              #   QUESTS 데이터 + getQuestById (기존 data/quests.ts)
      model/pick.ts                 #   pickQuests 추천 로직 (기존 data/quests.ts)
      @x/record.ts                  #   record 슬라이스를 위한 교차 참조 Public API
      index.ts
    record/                         #   완료 기록(히스토리) 도메인
      model/record.ts               #   OddayRecord 타입
      api/storage.ts                #   localStorage 접근 (기존 lib/storage.ts)
      index.ts

  shared/                           # ── 레이어: shared (도메인 무관 토대)
    ui/                             #   기존 components/ui.tsx 를 컴포넌트별로 분리
      Button/index.tsx   Card/index.tsx   OptionGroup/index.tsx
      Screen/index.tsx   Tag/index.tsx
    lib/
      analytics/ { index.ts, events.ts }   #   trackEvent + 이벤트 타입 (기존 lib/analytics.ts, types/analytics.ts)
      ref/       index.ts                  #   유입 경로 캡처 (기존 lib/ref.ts)
      visitor/   index.ts                  #   익명 방문자/세션 식별자 (기존 lib/visitor.ts)
    api/
      posthog.ts                           #   PostHog 어댑터 (기존 lib/posthog.ts)
```

> **초기 계획에서 바뀐 세 가지 (의존성 규칙을 지키기 위한 조정):**
>
> 1. **`visitor` 는 `entities` 가 아니라 `shared/lib/visitor` 로.** 익명 방문자/세션 id는
>    `shared/lib/analytics`(trackEvent)가 모든 이벤트에 붙이는 값입니다. `shared` 는 위 레이어(`entities`)를
>    import할 수 없으므로, analytics의 의존 대상인 visitor도 `shared` 에 있어야 규칙이 성립합니다.
>    visitor는 특정 도메인 개념이라기보다 **익명 식별 인프라**에 가까우므로 shared가 더 자연스럽습니다.
> 2. **피드백 폼 타입(`FeedbackDraft`/`FeedbackInput`)은 `pages/feedback/model` 로.**
>    이 타입들은 `FeedbackScreen`(pages)과 흐름 오케스트레이터(`app/flow`)가 함께 씁니다. pages는 app을
>    import할 수 없으므로 타입을 app에 두면 위반입니다. **app → pages 방향은 허용**되므로 피드백 화면과
>    같은 슬라이스에 두고, `app/flow`가 이를 가져다 씁니다.
> 3. **`features` 는 `share-odday` 하나만 만들었습니다.** 나머지(select-quest, submit-feedback,
>    request-next-quest 등)는 "재사용될 때 만든다" 원칙에 따라 **미리 만들지 않았습니다.** 현재 이 상호작용
>    로직은 `app/flow/useOddayFlow` 안에 있고, 여러 화면에서 중복이 생기면 그때 features로 승격합니다.

## 3. 매핑표 — 지금 파일이 어디로 가는가

| 현재 | FSD 위치 | 레이어 | 비고 |
| --- | --- | --- | --- |
| `App.tsx` | `app/App.tsx` | app | 스텝 전환 = 라우터 |
| `main.tsx` | `app/main.tsx` | app | 진입점 |
| `index.css` | `app/styles/index.css` | app | 전역 스타일 |
| `state/useOddayFlow.ts` | `app/flow/useOddayFlow.ts` | app | 아래 3.2 참고 |
| `screens/*.tsx` | `pages/<slice>/ui/*.tsx` | pages | 화면 1개 = 슬라이스 1개 |
| `components/ui.tsx` | `shared/ui/<Component>/` | shared | 컴포넌트별로 분리 |
| `data/quests.ts` | `entities/quest/model/dataset.ts` + `model/pick.ts` | entities | 데이터셋과 추천 로직을 세그먼트로 분리 |
| `types/quest.ts` | `entities/quest/model/quest.ts` | entities | 퀘스트 타입 |
| `lib/storage.ts` | `entities/record/api/storage.ts` | entities | 완료 기록 저장 |
| `lib/visitor.ts` | `shared/lib/visitor/` | **shared** | 익명 식별 인프라 (아래 3.1 참고) |
| `lib/analytics.ts` | `shared/lib/analytics/` | shared | 전역 이벤트 수집 |
| `types/analytics.ts` | `shared/lib/analytics/events.ts` | shared | 이벤트 타입 |
| `lib/posthog.ts` | `shared/api/posthog.ts` | shared | 외부 서비스 어댑터 |
| `lib/ref.ts` | `shared/lib/ref/` | shared | 유입 경로 유틸 |
| `lib/share.ts` | `features/share-odday/model/` | features | 공유 상호작용 |
| `state/useOddayFlow.ts` 의 `FeedbackDraft`/`FeedbackInput` | `pages/feedback/model/feedback.ts` | pages | 피드백 폼 타입 (아래 3.1 참고) |

### 3.1 왜 이렇게 나뉘는가 (판단 근거)

- **화면(screens) → pages**: 각 스텝은 라우트에 대응하는 화면 전체입니다. FSD의 `pages`가 정확히 이 역할입니다.
- **quests 데이터/타입 → entities/quest**: "퀘스트"는 우리가 다루는 핵심 **명사(비즈니스 개념)** 이므로 엔티티입니다.
  추천 로직 `pickQuests`도 퀘스트라는 개념에 대한 규칙이므로 `entities/quest/model`에 둡니다.
- **완료 기록 저장 → entities/record**: 히스토리는 "완료 기록"이라는 별도 개념입니다.
  `sessionStorage`/`localStorage` 접근은 이 엔티티의 `api` 세그먼트로 봅니다.
- **share → features/share-odday**: 공유는 사용자가 수행하는 **상호작용**이고 여러 화면(next-quest, history)에서 재사용됩니다. → feature.
- **analytics → shared**: 이벤트 수집은 특정 도메인이 아니라 앱 전역에서 쓰이는 도메인 무관 인프라입니다. → shared.
- **visitor → shared (entities 아님)**: 익명 방문자/세션 id는 `shared/lib/analytics`가 모든 이벤트에 붙이는 값입니다.
  `shared` 는 `entities` 를 import할 수 없으므로(의존성 방향), analytics가 의존하는 visitor는 `shared` 에 있어야 합니다.
  visitor는 도메인 개념이라기보다 **익명 식별 인프라**이므로 shared가 더 정확합니다. (§2 조정사항 1)
- **record → quest 교차 참조는 `@x` 로**: `OddayRecord.category` 는 `entities/quest` 의 `Category` 타입을 씁니다.
  같은 레이어(entities) 간 직접 import는 금지이므로, quest가 record 전용 Public API `entities/quest/@x/record.ts` 로
  `Category` 만 노출하고 record는 이를 통해 가져옵니다. ([fsd-concepts §6](./fsd-concepts.md))
- **피드백 폼 타입 → pages/feedback/model**: `FeedbackDraft`/`FeedbackInput` 은 `FeedbackScreen`(pages)과
  `app/flow`가 함께 씁니다. pages는 app을 import할 수 없으므로 피드백 슬라이스에 두고, **app → pages** 방향으로
  `app/flow`가 가져다 씁니다. (§2 조정사항 2)

### 3.2 useOddayFlow는 어디에? (주의 지점)

`useOddayFlow`는 전체 스텝 전환 + 여러 엔티티(quest, record)를 오케스트레이션하는 **앱 전역 흐름**입니다.
FSD의 (deprecated된) `processes` 레이어가 다루던 영역이며, 현행 스펙은 이를 **`app` 또는 `features`로 분산**하라고 권합니다.
([Layers](https://feature-sliced.design/docs/reference/layers))

- MVP 단계에서는 **통째로 `app/flow/`에 두는 것**을 권장합니다(가장 단순, 라우터에 가까운 성격).
- 흐름이 더 커지면, 개별 상호작용(예: `selectQuest`, `submitFeedback`)의 로직을 각 `features/*/model`로 떼어내고
  `app/flow`는 스텝 전환만 담당하도록 얇게 유지하세요.

## 4. 전환 과정 (완료)

FSD 공식 [마이그레이션 가이드](https://feature-sliced.design/docs/guides/migration/from-custom)의 순서를 우리 상황에 맞춰 아래와 같이 진행했습니다.

1. ✅ **폴더 골격** — `src/`에 `app/ pages/ features/ entities/ shared/` 레이어 폴더 생성.
2. ✅ **shared 먼저** — `components/ui.tsx` → `shared/ui/*`, `lib/{analytics,ref,visitor,posthog}` → `shared/lib`·`shared/api`.
   (토대가 먼저 있어야 위 레이어가 이를 import할 수 있음.)
3. ✅ **entities** — `data/quests.ts` + `types/quest.ts` → `entities/quest`, `lib/storage.ts` → `entities/record` (Category는 `@x` 로 교차 참조).
4. ✅ **pages** — `screens/*` → `pages/<slice>/ui/`, 각 슬라이스에 `index.ts` 추가. 피드백 폼 타입은 `pages/feedback/model`로.
5. ✅ **app 정리** — `App.tsx`, `main.tsx`, `useOddayFlow`, 전역 CSS를 `app/`로.
6. ✅ **features** — 실제로 재사용되는 `share-odday` 만 분리. 나머지 상호작용은 **미리 만들지 않고** `app/flow`에 유지.

> **핵심 원칙(공식 가이드):**
> - 팀 합의를 먼저 얻고, 기능 개발을 멈추지 말 것.
> - 새로 만지는 부분부터 옮기고, 안 건드리는 코드는 그대로 둬도 됨.
> - 추상화를 서두르기보다 **중복을 먼저 허용**할 것 (비즈니스 로직이 아닌 코드는 복붙이 낫다).

## 5. 경로 별칭 (도입 완료)

레이어 경로가 길어지므로 `@/` 별칭을 도입했습니다. 슬라이스 바깥에서의 import는 `@/<layer>/<slice>` 형태로 규칙이 드러납니다.
(같은 슬라이스 **내부**는 여전히 상대경로를 씁니다 — [fsd-concepts §5](./fsd-concepts.md).)

`tsconfig.app.json` — `compilerOptions`에 추가됨:

```jsonc
{
  "compilerOptions": {
    // ...기존 설정...
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

`vite.config.ts` — resolve alias 추가:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  base: "/odday-mvp/",
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
```

그러면 import가 이렇게 됩니다.

```ts
import { Button } from "@/shared/ui/Button";
import { pickQuests } from "@/entities/quest";
import { QuestListScreen } from "@/pages/quest-list";
```

> `vite.config.ts` 가 `node:path`/`__dirname` 을 쓰므로, 이를 타입체크(`tsconfig.node.json`)하려면 `@types/node`
> devDependency가 필요합니다. 별칭 도입과 함께 추가했습니다.

## 6. 도구 — Steiger 린터 (선택)

FSD 규칙(의존성 방향, Public API 위반)을 자동 검사하려면 [Steiger](https://github.com/feature-sliced/steiger)를 도입할 수 있습니다.

```bash
npm i -D steiger @feature-sliced/steiger-plugin
npx steiger src
```

전환 초기에는 위반이 많을 수 있으니, **전환이 어느 정도 끝난 뒤** 도입하는 것을 권장합니다.

## 7. 자주 하는 실수

- ❌ `features`를 미리 잔뜩 만든다 → "모든 게 feature일 필요는 없다". 재사용될 때 만든다.
- ❌ `pages`가 다른 `pages`를 import한다 → 같은 레이어 간 참조 금지. 공통 부분은 아래로 내린다.
- ❌ 슬라이스 내부 파일을 바깥에서 직접 import한다 → 반드시 `index.ts` 경유.
- ❌ `shared`에 도메인(quest, record) 지식을 넣는다 → shared는 도메인 무관해야 한다. 도메인은 entities로.
- ❌ 세그먼트를 `components/`, `hooks/`로 나눈다 → 성격이 아니라 목적으로. `ui/model/api/lib/config`.
