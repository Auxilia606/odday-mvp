# 기능 추가·수정 실무 가이드

> 화면이나 기능을 만들기 전에 이 문서를 봅니다.
> 개념은 [fsd-concepts.md](./fsd-concepts.md), 폴더 매핑은 [odday-fsd-guide.md](./odday-fsd-guide.md).

## 시작 전: 3가지 질문

새 코드를 짜기 전에 스스로 답합니다.

1. **어느 레이어인가?** — 새 화면? → `pages`. 재사용되는 상호작용? → `features`. 비즈니스 개념(명사)? → `entities`. 도메인 무관 유틸/UI? → `shared`.
2. **어느 슬라이스(도메인)인가?** — 예: 퀘스트 공유 → `share-odday`, 퀘스트 개념 → `quest`.
3. **어느 세그먼트인가?** — 화면/컴포넌트 → `ui`, 상태/타입/로직 → `model`, 외부 요청 → `api`, 내부 유틸 → `lib`, 설정 → `config`.

그 다음 import 방향(위→아래)과 Public API(`index.ts`)만 지키면 됩니다.

## 레이어 결정 플로우차트

```
새로 만들 것이…
│
├─ 라우트/스텝에 대응하는 화면 전체?        → pages/<화면>/ui
│
├─ 사용자가 하는 동작인데 여러 화면에서 재사용? → features/<동작>
│   (한 화면에서만 쓰면 그 pages 슬라이스 안에 둔다)
│
├─ 우리가 다루는 "명사"(데이터 개념)?         → entities/<개념>
│
├─ 여러 페이지에 걸친 큰 UI 블록?            → widgets/<블록>
│
└─ 도메인과 무관한 UI/유틸/상수/외부 어댑터?   → shared/{ui,lib,api,config}
```

---

## 시나리오별 절차

### A. 새 화면(스텝) 추가

예: "오늘의 요약" 화면을 추가한다.

1. `src/pages/summary/` 폴더 생성.
2. `pages/summary/ui/SummaryScreen.tsx`에 화면 컴포넌트 작성.
3. `pages/summary/index.ts`에 Public API 노출:
   ```ts
   export { SummaryScreen } from "./ui/SummaryScreen";
   ```
4. `app/flow/useOddayFlow.ts`의 `Step` 유니온에 `"summary"` 추가하고 전환 로직 연결.
5. `app/App.tsx`에서 `flow.step === "summary"` 분기에 `<SummaryScreen />` 렌더.
6. 화면에서 필요한 데이터는 **아래 레이어**에서만 가져온다:
   ```ts
   import { pickQuests } from "@/entities/quest";   // ✓ entities는 pages보다 아래
   import { Button } from "@/shared/ui/Button";      // ✓ shared
   ```

### B. 새 상호작용(feature) 추가

예: "퀘스트 즐겨찾기" 기능. 목록·상세 여러 화면에서 재사용된다.

1. `src/features/bookmark-quest/` 생성.
2. 세그먼트 배치:
   - `model/useBookmark.ts` — 상태/로직
   - `ui/BookmarkButton.tsx` — 버튼 UI
3. `features/bookmark-quest/index.ts`:
   ```ts
   export { BookmarkButton } from "./ui/BookmarkButton";
   export { useBookmark } from "./model/useBookmark";
   ```
4. 퀘스트 개념이 필요하면 `entities/quest`에서 가져온다. **다른 feature는 import하지 않는다.**
5. 화면(`pages`)에서 `import { BookmarkButton } from "@/features/bookmark-quest"`로 사용.

> ⚠️ 처음부터 feature로 만들지 마세요. **한 화면에서만 쓴다면** 그냥 그 `pages` 슬라이스 안에 두고,
> 두 번째 화면에서 필요해질 때 `features`로 승격합니다.

### C. 새 데이터 개념(entity) 추가

예: "뱃지(badge)" 개념 도입.

1. `src/entities/badge/` 생성.
2. `model/badge.ts` — 타입/스키마, `model/dataset.ts` — 데이터, 필요하면 `api/` — 서버 요청.
3. `entities/badge/index.ts`에서 타입·조회 함수만 명시적으로 노출.
4. 다른 엔티티(`quest` 등)를 꼭 참조해야 하면 **`@x` 표기**만 사용(직접 import 금지):
   ```ts
   import type { Quest } from "@/entities/quest/@x/badge";
   ```

### D. 기존 화면 수정

1. 해당 화면의 `pages/<slice>/` 폴더만 연다.
2. 화면 안에서만 쓰는 UI는 같은 슬라이스 `ui/`에 파일 추가(다른 곳에 두지 않는다).
3. 로직이 다른 화면과 겹치기 시작하면 → `features` 또는 `entities`로 내려 공유한다(복붙 → 승격).

### E. 공용 UI/유틸 추가

- 버튼·모달처럼 도메인 무관 UI → `shared/ui/<Component>/`, 컴포넌트별 `index.ts`.
- 날짜 포맷 같은 순수 유틸 → `shared/lib/<name>/`.
- PostHog 같은 외부 서비스 어댑터 → `shared/api/`.
- `shared`에는 **quest/record 같은 도메인 지식을 절대 넣지 않는다.**

---

## 커밋 전 체크리스트

- [ ] 새 파일이 올바른 **레이어/슬라이스/세그먼트**에 있는가?
- [ ] import가 **아래 레이어 방향**으로만 흐르는가? (`features`→`pages` 참조 없음)
- [ ] **같은 레이어의 다른 슬라이스**를 직접 import하지 않았는가?
- [ ] 슬라이스는 **`index.ts`(Public API)** 로만 외부에 노출되는가?
- [ ] 같은 슬라이스 내부는 **상대경로**로, 바깥은 **별칭+index**로 import했는가?
- [ ] 한 화면에서만 쓰는 코드를 성급하게 `features`로 빼지 않았는가?
- [ ] `npm run typecheck` 통과하는가?

---

## import 규칙 빠른 참조

| 이 레이어에서 | import 할 수 있는 것 |
| --- | --- |
| `app` | pages, widgets, features, entities, shared (전부) |
| `pages` | widgets, features, entities, shared |
| `widgets` | features, entities, shared |
| `features` | entities, shared |
| `entities` | shared (+ 같은 레이어는 `@x` 표기로만) |
| `shared` | (없음 — 아무 레이어도 import하지 않음) |

이 표를 어기면 순환 의존이나 예측 불가능한 변경 전파가 생깁니다. 규칙이 곧 안전장치입니다.
