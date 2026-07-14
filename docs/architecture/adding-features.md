# Practical Guide to Adding / Changing Features

> Read this document before building a screen or feature.
> For concepts see [fsd-concepts.md](./fsd-concepts.md); for folder mapping see [odday-fsd-guide.md](./odday-fsd-guide.md).

## Before you start: 3 questions

Answer these to yourself before writing new code.

1. **Which layer?** — A new screen? → `pages`. A reusable interaction? → `features`. A business concept (a noun)? → `entities`. A domain-agnostic util/UI? → `shared`.
2. **Which slice (domain)?** — e.g. sharing a quest → `share-odday`, the quest concept → `quest`.
3. **Which segment?** — screen/component → `ui`, state/types/logic → `model`, external requests → `api`, internal utils → `lib`, config → `config`.

After that, just respect the import direction (top → bottom) and the Public API (`index.ts`).

## Layer decision flowchart

```
What you're about to build is…
│
├─ A whole screen corresponding to a route/step?      → pages/<screen>/ui
│
├─ A user action reused across several screens?        → features/<action>
│   (if used on only one screen, keep it inside that pages slice)
│
├─ A "noun" (data concept) we deal with?               → entities/<concept>
│
├─ A large UI block spanning several pages?            → widgets/<block>
│
└─ A domain-agnostic UI/util/constant/external adapter? → shared/{ui,lib,api,config}
```

---

## Procedures by scenario

### A. Adding a new screen (step)

Example: add a "Today's summary" screen.

1. Create the `src/pages/summary/` folder.
2. Write the screen component in `pages/summary/ui/SummaryScreen.tsx`.
3. Expose the Public API in `pages/summary/index.ts`:
   ```ts
   export { SummaryScreen } from "./ui/SummaryScreen";
   ```
4. Add `"summary"` to the `Step` union in `app/flow/useOddayFlow.ts` and wire up the transition logic.
5. Render `<SummaryScreen />` in the `flow.step === "summary"` branch in `app/App.tsx`.
6. Pull the data the screen needs **only from lower layers**:
   ```ts
   import { pickQuests } from "@/entities/quest";   // ✓ entities is below pages
   import { Button } from "@/shared/ui/Button";      // ✓ shared
   ```

### B. Adding a new interaction (feature)

Example: a "bookmark quest" feature, reused across the list and detail screens.

1. Create `src/features/bookmark-quest/`.
2. Lay out the segments:
   - `model/useBookmark.ts` — state/logic
   - `ui/BookmarkButton.tsx` — the button UI
3. `features/bookmark-quest/index.ts`:
   ```ts
   export { BookmarkButton } from "./ui/BookmarkButton";
   export { useBookmark } from "./model/useBookmark";
   ```
4. If you need the quest concept, pull it from `entities/quest`. **Do not import other features.**
5. Use it from a screen (`pages`) via `import { BookmarkButton } from "@/features/bookmark-quest"`.

> ⚠️ Don't build it as a feature from the start. **If it's used on only one screen**, keep it inside that `pages` slice,
> and promote it to `features` when a second screen needs it.

### C. Adding a new data concept (entity)

Example: introducing a "badge" concept.

1. Create `src/entities/badge/`.
2. `model/badge.ts` — types/schemas, `model/dataset.ts` — data, and if needed `api/` — server requests.
3. Expose only the types and query functions explicitly from `entities/badge/index.ts`.
4. If you must reference another entity (`quest`, etc.), use the **`@x` notation only** (no direct import):
   ```ts
   import type { Quest } from "@/entities/quest/@x/badge";
   ```

### D. Changing an existing screen

1. Open only that screen's `pages/<slice>/` folder.
2. UI used only within that screen goes into the same slice's `ui/` (don't put it elsewhere).
3. When the logic starts overlapping with other screens → move it down to `features` or `entities` to share it (duplicate first → then promote).

### E. Adding shared UI/utils

- Domain-agnostic UI like buttons/modals → `shared/ui/<Component>/`, with a per-component `index.ts`.
- Pure utils like date formatting → `shared/lib/<name>/`.
- External-service adapters like PostHog → `shared/api/`.
- **Never put domain knowledge (quest/record, etc.) into `shared`.**

---

## Pre-commit checklist

- [ ] Is the new file in the correct **layer/slice/segment**?
- [ ] Do imports flow **only toward lower layers**? (no `features`→`pages` reference)
- [ ] Did you avoid importing **another slice in the same layer** directly?
- [ ] Is the slice exposed to the outside only through its **`index.ts` (Public API)**?
- [ ] Within the same slice, did you import via **relative paths**, and from outside via **alias + index**?
- [ ] Did you avoid prematurely extracting single-screen code into `features`?
- [ ] Does `npm run typecheck` pass?

---

## Quick reference: import rules

| From this layer | You may import |
| --- | --- |
| `app` | pages, widgets, features, entities, shared (everything) |
| `pages` | widgets, features, entities, shared |
| `widgets` | features, entities, shared |
| `features` | entities, shared |
| `entities` | shared (+ same layer only via the `@x` notation) |
| `shared` | (nothing — imports no layer) |

Breaking this table creates circular dependencies or unpredictable change propagation. The rules are the safety net.
