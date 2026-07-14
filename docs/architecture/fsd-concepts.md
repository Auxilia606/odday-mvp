# FSD 개념 정리

> 이 문서는 [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)를 근거로 정리한 개념 설명입니다.
> 특정 프로젝트에 종속되지 않은 순수 개념이며, Odday에의 적용은 [odday-fsd-guide.md](./odday-fsd-guide.md)에서 다룹니다.

## 1. FSD란

FSD(Feature-Sliced Design)는 프론트엔드 코드를 **어떤 폴더에, 어떤 이름으로, 무엇을 근거로** 배치할지 정하는 규칙 모음입니다.
목표는 다음과 같습니다. ([Overview](https://feature-sliced.design/docs/get-started/overview))

- **큰 프로젝트의 수정 비용을 낮춘다** — 서로 얽힌 코드가 늘어나도 변경 영향 범위를 예측할 수 있게.
- **온보딩을 쉽게 한다** — 폴더 이름만 봐도 그 코드가 무슨 책임을 지는지 알 수 있게.
- **리팩터링을 안전하게 한다** — 한 곳을 고쳤을 때 엉뚱한 곳이 깨지지 않게.

FSD는 코드를 **3단계 계층**으로 나눕니다.

```
Layer(레이어)  ─▶  Slice(슬라이스)  ─▶  Segment(세그먼트)
     책임              도메인               성격
```

---

## 2. 레이어 (Layer) — "기술적 책임"으로 나누기

레이어는 코드를 **책임과 의존 방향**으로 나눈 최상위 폴더입니다. 총 7개이며 위에서 아래로 나열됩니다.
([Layers](https://feature-sliced.design/docs/reference/layers))

| # | 레이어 | 하는 일 | 예시 |
| --- | --- | --- | --- |
| 1 | **app** | 앱 전역 설정. 라우팅, 전역 스토어, 전역 스타일, 진입점, Provider, 애널리틱스 초기화 | `App.tsx`, `main.tsx`, 전역 CSS, PostHog 초기화 |
| 2 | ~~processes~~ | 여러 페이지에 걸친 시나리오 (**deprecated**) | — 쓰지 말고 `features`/`app`으로 분산 |
| 3 | **pages** | 라우트에 대응하는 화면 전체. 페이지 UI, 로딩/에러 상태, 데이터 로딩 | `HomePage`, `FeedPage` |
| 4 | **widgets** | 여러 페이지에서 재사용되는 크고 자족적인 UI 블록 | 페이지 레이아웃, 헤더+사이드바 조합 |
| 5 | **features** | 사용자가 수행하는 **재사용되는 상호작용**. 폼, 검증, 관련 API 호출, 내부 상태 | `LoginForm`, `AddToCart` |
| 6 | **entities** | 프로젝트가 다루는 **비즈니스 개념(명사)**. 데이터 모델, 스키마, 엔티티 API, 표현용 UI | `User`, `Product`, `Post` |
| 7 | **shared** | 프로젝트에 종속되지 않는 재사용 기반. UI 키트, API 클라이언트, 유틸, 상수 | `Button`, `apiClient`, `formatDate` |

### 핵심 규칙: 의존성은 아래로만

> **"한 슬라이스의 파일은, 자기보다 엄격히 아래에 있는 레이어의 슬라이스만 import할 수 있다."**
> — [Layers](https://feature-sliced.design/docs/reference/layers)

```
app       ─┐  (가장 위: 아무나 못 가져다 쓰지만, 아래를 다 쓸 수 있음)
pages      │  ▼  import 가능한 방향
widgets    │
features   │
entities   │
shared    ─┘  (가장 아래: 아무도 위를 못 씀. 하지만 모두가 shared를 씀)
```

- `pages`는 `widgets`, `features`, `entities`, `shared`를 쓸 수 있다.
- `features`는 `entities`, `shared`만 쓸 수 있다. (`pages`나 다른 `features`는 ✗)
- `shared`는 아무 레이어도 import하지 않는다. (앱 전체의 토대)

**예외 두 가지:**
- `app`과 `shared`는 슬라이스로 나누지 않으며, 내부 세그먼트끼리는 자유롭게 import할 수 있습니다.

### "모든 게 feature일 필요는 없다"

FSD는 과도한 분할을 경계합니다. **재사용되는 상호작용만 `features`로** 만드세요.
한 페이지에서만 쓰는 UI 블록은 그냥 그 `pages` 슬라이스 안에 두면 됩니다. ([Layers](https://feature-sliced.design/docs/reference/layers))

---

## 3. 슬라이스 (Slice) — "비즈니스 도메인"으로 나누기

슬라이스는 레이어 안에서 **비즈니스 의미**로 코드를 묶은 폴더입니다.
이름은 도메인에서 나옵니다 — 사진 앱이라면 `photo`, `effects`, `gallery`; SNS라면 `post`, `comments`, `news-feed`.
([Slices and segments](https://feature-sliced.design/docs/reference/slices-segments))

- 슬라이스는 `pages`, `widgets`, `features`, `entities` 레이어에만 존재합니다.
- `app`과 `shared`에는 슬라이스가 없습니다. (앱 전역 설정과 토대 코드라 도메인 분할이 무의미)

### 두 가지 이상: 낮은 결합, 높은 응집

- **Zero coupling (제로 결합)** — 같은 레이어의 다른 슬라이스끼리 서로 참조하지 않는다.
- **High cohesion (높은 응집)** — 한 슬라이스는 자기 목적에 관련된 코드를 대부분 담는다.

같은 레이어 내 슬라이스 간 직접 import가 금지되어 있어 순환 의존을 원천 차단합니다.
슬라이스 A와 B가 서로 필요하면 → 둘 다 **아래 레이어(예: entities, shared)**로 공통 부분을 내려서 공유합니다.

---

## 4. 세그먼트 (Segment) — "코드의 성격"으로 나누기

세그먼트는 슬라이스 안에서 코드를 **기술적 성격**으로 나눈 하위 폴더입니다. 표준 이름은 다음과 같습니다.
([Slices and segments](https://feature-sliced.design/docs/reference/slices-segments))

| 세그먼트 | 담는 것 |
| --- | --- |
| `ui` | UI 컴포넌트, 포맷터, 스타일 |
| `api` | 백엔드 요청, 요청/응답 타입, 매퍼 |
| `model` | 스키마, 인터페이스, 스토어(상태), 비즈니스 로직 |
| `lib` | 이 슬라이스 내부에서만 쓰는 유틸 |
| `config` | 설정값, 기능 플래그 |

> 커스텀 세그먼트를 만들어도 되지만, **성격(essence)이 아니라 목적(purpose)을 담아** 이름 짓습니다.
> `components`, `hooks` 같은 "무엇인가"가 아니라 "무엇을 위한 것인가"로 나누세요.

작은 슬라이스라면 세그먼트를 다 만들 필요 없이 `ui`, `model` 정도만 있어도 됩니다.

---

## 5. Public API — `index.ts`

슬라이스는 **자기 내부 파일을 외부에 직접 노출하지 않습니다.** 대신 `index.ts`로 "공개할 것만" 내보냅니다.
이 `index.ts`가 슬라이스의 **계약(contract)** 이자 **관문(gate)** 입니다. ([Public API](https://feature-sliced.design/docs/reference/public-api))

Public API의 목적:
1. **구조 보호** — 내부 파일을 리팩터링해도 바깥 코드가 안 깨진다.
2. **동작 명확성** — 의미 있는 동작 변경은 API 변경으로 드러난다.
3. **최소 노출** — 꼭 필요한 것만 공개한다.

```ts
// ❌ 나쁨: 와일드카드 재노출 — 내부 구현이 다 새어나감
export * from "./ui/Comment";
export * from "./model/comments";

// ✅ 좋음: 필요한 것만 명시적으로
export { LoginPage } from "./ui/LoginPage";
export { RegisterPage } from "./ui/RegisterPage";
```

### 같은 슬라이스 안에서는 index를 거치지 않는다

순환 import를 피하려고, **같은 슬라이스 내부 파일끼리는 상대경로로 직접** 가져옵니다.

```ts
// ❌ pages/home/ui/HomePage.tsx 안에서
import { loadUserStatistics } from "../";        // 자기 슬라이스 index → 순환 위험

// ✅ 직접 상대경로로
import { loadUserStatistics } from "../api/loadUserStatistics";
```

### `shared/ui`, `shared/lib`는 컴포넌트별 index로

한 덩어리 index로 다 내보내면 트리셰이킹이 안 돼 번들이 커집니다.
`shared/ui`, `shared/lib`는 **컴포넌트/유틸마다 개별 index**를 두는 것을 권장합니다. ([Public API](https://feature-sliced.design/docs/reference/public-api))

---

## 6. 엔티티 간 교차 참조 — `@x` 표기

엔티티끼리 서로 참조해야 할 때가 있습니다(예: `entities/A`가 `entities/B`의 타입을 필요로 함).
같은 레이어 간 직접 import는 금지지만, **entities 레이어에 한해** `@x` 표기로 명시적 교차 참조를 허용합니다.
([Public API](https://feature-sliced.design/docs/reference/public-api))

```
entities/A/
  @x/
    B.ts        ← entities/B를 위해 A가 공개하는 전용 Public API
  index.ts      ← 일반 Public API
```

```ts
// entities/B 안에서
import type { EntityA } from "entities/A/@x/B";
```

> 교차 참조는 **최소한으로**, 그리고 **entities 레이어에서만** 사용하세요.

---

## 7. 자동 검사 — Steiger

FSD 규칙(의존성 방향, Public API 등)은 사람이 매번 검토하기 어렵습니다.
[Steiger](https://github.com/feature-sliced/steiger) 아키텍처 린터로 규칙 위반을 자동 검출할 수 있습니다.
도입은 [odday-fsd-guide.md](./odday-fsd-guide.md)의 "도구" 항목을 참고하세요.

---

## 요약 체크리스트

- [ ] 새 코드가 어느 **레이어**에 속하는가? (app/pages/widgets/features/entities/shared)
- [ ] 그 레이어 안 어느 **슬라이스(도메인)** 인가?
- [ ] 슬라이스 안 어느 **세그먼트(ui/model/api/lib/config)** 인가?
- [ ] import가 **아래 레이어 방향**으로만 흐르는가?
- [ ] 같은 레이어의 다른 슬라이스를 직접 참조하고 있지 않은가?
- [ ] 슬라이스 바깥에서 **`index.ts`(Public API)** 로만 접근하는가?
