# Odday 아키텍처 가이드 — Feature-Sliced Design (FSD)

이 폴더는 앞으로 Odday에 **화면·기능을 추가하거나 수정할 때 지켜야 할 아키텍처 규칙**을 정리한 문서 모음입니다.
우리는 [Feature-Sliced Design(FSD)](https://feature-sliced.design/) 방법론을 기준으로 삼습니다.

> FSD는 "프론트엔드 애플리케이션을 구조화하기 위한 아키텍처 방법론(rules and conventions on organizing code)"입니다.
> 비즈니스 요구가 계속 바뀌어도 코드를 이해하기 쉽고, 고치기 안전하게 유지하는 것을 목표로 합니다.
> — [FSD 공식 문서 · Overview](https://feature-sliced.design/docs/get-started/overview)

## 문서 구성

| 문서 | 내용 | 언제 읽나 |
| --- | --- | --- |
| [fsd-concepts.md](./fsd-concepts.md) | FSD의 개념 — 레이어 / 슬라이스 / 세그먼트, 의존성 규칙, Public API | FSD를 처음 접할 때, 규칙이 헷갈릴 때 |
| [odday-fsd-guide.md](./odday-fsd-guide.md) | 이 프로젝트에 FSD를 어떻게 적용했는가 — 레이어별 구조 매핑, 폴더 배치, 경로 별칭 | 새 폴더/파일을 만들 위치가 헷갈릴 때 |
| [adding-features.md](./adding-features.md) | 기능을 추가/수정할 때의 실무 절차와 체크리스트, 예제 | 실제로 작업을 시작할 때 |

## 30초 요약

FSD는 코드를 3단계로 나눕니다.

```
레이어(Layer)  →  슬라이스(Slice)  →  세그먼트(Segment)
"기술적 책임"      "비즈니스 도메인"     "코드의 성격"
app/pages/...      quest / feedback     ui / model / api / lib
```

핵심 규칙은 단 하나입니다.

> **한 파일은 자기보다 "아래" 레이어의 슬라이스만 import할 수 있다.**
> — [FSD 공식 문서 · Layers](https://feature-sliced.design/docs/reference/layers)

레이어 순서(위 → 아래): **app → pages → widgets → features → entities → shared**

- 위에서 아래로만 의존한다. (`pages`는 `features`를 쓸 수 있지만, `features`는 `pages`를 쓸 수 없다)
- 같은 레이어의 다른 슬라이스끼리는 서로 import하지 않는다. (`features/share`가 `features/feedback`을 직접 참조 ✗)
- 슬라이스 바깥에서는 그 슬라이스의 `index.ts`(Public API)로만 접근한다. 내부 파일을 직접 참조하지 않는다.

## 도입 상태

Odday MVP는 **FSD 구조로의 전환을 마쳤습니다.** `src/`는 이제 `app / pages / features / entities / shared`
레이어로 구성되며, 이전의 flat 구조(`screens/`, `components/`, `lib/`, `state/`, `data/`, `types/`)는 모두
이관·제거되었습니다. 레이어별 배치와 매핑, 전환 과정에서의 판단은 [odday-fsd-guide.md](./odday-fsd-guide.md)를 참고하세요.

앞으로 화면·기능을 추가할 때는 [adding-features.md](./adding-features.md)의 절차를 따릅니다.

## 출처 (웹 기반)

이 가이드는 아래 FSD 공식 문서를 근거로 작성했습니다.

- [Overview](https://feature-sliced.design/docs/get-started/overview)
- [Reference · Layers](https://feature-sliced.design/docs/reference/layers)
- [Reference · Slices and segments](https://feature-sliced.design/docs/reference/slices-segments)
- [Reference · Public API](https://feature-sliced.design/docs/reference/public-api)
- [Tutorial](https://feature-sliced.design/docs/get-started/tutorial)
- [Migration guide](https://feature-sliced.design/docs/guides/migration/from-custom)
