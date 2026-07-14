# Applying FSD to Odday

> Read [fsd-concepts.md](./fsd-concepts.md) first for the FSD concepts themselves.
> This document covers how **Odday MVP's actual code** maps onto the FSD structure.
> The migration is **complete**; what follows is the result and the reasoning behind it.

## 1. Previous structure (flat, before migration)

Before the migration, `src/` was divided into "folders by nature." (For the record — this no longer exists.)

```
src/
  App.tsx              # step-based screen transitions (acts as the router)
  main.tsx             # entry point
  index.css            # global styles
  screens/             # 7 screens (Start, Context, QuestList, QuestDetail, Feedback, NextQuest, History)
  components/ui.tsx     # shared UI components
  state/useOddayFlow.ts # orchestrates the overall flow state
  data/quests.ts        # quest dataset + recommendation logic (pickQuests)
  lib/                 # analytics, posthog, storage, visitor, ref, share
  types/               # quest, analytics types
```

Because this structure was "folders by nature (screens/components/lib)," a single feature's code scattered across
several folders as the feature grew. FSD regroups this **by domain (slices)** instead.

## 2. Current structure (FSD)

The actual `src/` tree after migration.

```
src/
  app/                              # ── layer: app (global setup)
    App.tsx                         #   step transitions = our app's "router"
    main.tsx                        #   entry point (registers the PostHog adapter)
    styles/index.css                #   global styles
    flow/useOddayFlow.ts            #   overall flow orchestration (see 3.2 below)

  pages/                            # ── layer: pages (a step = a screen)
    start/        { ui/StartScreen.tsx,        index.ts }
    context/      { ui/ContextScreen.tsx,      index.ts }
    quest-list/   { ui/QuestListScreen.tsx,    index.ts }
    quest-detail/ { ui/QuestDetailScreen.tsx,  index.ts }
    feedback/     { ui/FeedbackScreen.tsx, model/feedback.ts, index.ts }
    next-quest/   { ui/NextQuestScreen.tsx,    index.ts }
    history/      { ui/HistoryScreen.tsx,      index.ts }

  features/                         # ── layer: features (reusable interactions)
    share-odday/  { model/shareOdday.ts, index.ts }

  entities/                         # ── layer: entities (business concepts = nouns)
    quest/
      model/quest.ts                #   types + labels (former types/quest.ts)
      model/dataset.ts              #   QUESTS data + getQuestById (former data/quests.ts)
      model/pick.ts                 #   pickQuests recommendation logic (former data/quests.ts)
      @x/record.ts                  #   cross-import Public API for the record slice
      index.ts
    record/                         #   completion-record (history) domain
      model/record.ts               #   OddayRecord type
      api/storage.ts                #   localStorage access (former lib/storage.ts)
      index.ts

  shared/                           # ── layer: shared (domain-agnostic foundation)
    ui/                             #   former components/ui.tsx split per component
      Button/index.tsx   Card/index.tsx   OptionGroup/index.tsx
      Screen/index.tsx   Tag/index.tsx
    lib/
      analytics/ { index.ts, events.ts }   #   trackEvent + event types (former lib/analytics.ts, types/analytics.ts)
      ref/       index.ts                  #   referral-path capture (former lib/ref.ts)
      visitor/   index.ts                  #   anonymous visitor/session identifier (former lib/visitor.ts)
    api/
      posthog.ts                           #   PostHog adapter (former lib/posthog.ts)
```

> **Three things that changed from the initial plan (adjustments to respect the dependency rules):**
>
> 1. **`visitor` went to `shared/lib/visitor`, not `entities`.** The anonymous visitor/session id is a value that
>    `shared/lib/analytics` (trackEvent) attaches to every event. `shared` cannot import from an upper layer (`entities`),
>    so visitor — which analytics depends on — must live in `shared` for the rule to hold.
>    visitor is closer to **anonymous-identification infrastructure** than to a specific domain concept, so shared is more natural.
> 2. **The feedback-form types (`FeedbackDraft`/`FeedbackInput`) went to `pages/feedback/model`.**
>    These types are used by both `FeedbackScreen` (pages) and the flow orchestrator (`app/flow`). pages cannot import
>    app, so putting the types in app would be a violation. Since the **app → pages direction is allowed**, they live in the
>    same slice as the feedback screen, and `app/flow` pulls them in.
> 3. **We created only one `feature`: `share-odday`.** The rest (select-quest, submit-feedback,
>    request-next-quest, etc.) were **not created in advance**, following the "create it when it's reused" principle. For now
>    this interaction logic lives inside `app/flow/useOddayFlow`; when duplication appears across screens, we promote it to features.

## 3. Mapping table — where each file goes

| Former | FSD location | Layer | Notes |
| --- | --- | --- | --- |
| `App.tsx` | `app/App.tsx` | app | step transitions = router |
| `main.tsx` | `app/main.tsx` | app | entry point |
| `index.css` | `app/styles/index.css` | app | global styles |
| `state/useOddayFlow.ts` | `app/flow/useOddayFlow.ts` | app | see 3.2 below |
| `screens/*.tsx` | `pages/<slice>/ui/*.tsx` | pages | one screen = one slice |
| `components/ui.tsx` | `shared/ui/<Component>/` | shared | split per component |
| `data/quests.ts` | `entities/quest/model/dataset.ts` + `model/pick.ts` | entities | dataset and recommendation logic split into segments |
| `types/quest.ts` | `entities/quest/model/quest.ts` | entities | quest types |
| `lib/storage.ts` | `entities/record/api/storage.ts` | entities | completion-record storage |
| `lib/visitor.ts` | `shared/lib/visitor/` | **shared** | anonymous-identification infra (see 3.1 below) |
| `lib/analytics.ts` | `shared/lib/analytics/` | shared | global event collection |
| `types/analytics.ts` | `shared/lib/analytics/events.ts` | shared | event types |
| `lib/posthog.ts` | `shared/api/posthog.ts` | shared | external-service adapter |
| `lib/ref.ts` | `shared/lib/ref/` | shared | referral-path util |
| `lib/share.ts` | `features/share-odday/model/` | features | share interaction |
| `FeedbackDraft`/`FeedbackInput` from `state/useOddayFlow.ts` | `pages/feedback/model/feedback.ts` | pages | feedback-form types (see 3.1 below) |

### 3.1 Why it's split this way (the reasoning)

- **screens → pages**: each step is a whole screen corresponding to a route. FSD's `pages` is exactly this role.
- **quests data/types → entities/quest**: "quest" is the core **noun (business concept)** we deal with, so it's an entity.
  The recommendation logic `pickQuests` is also a rule about the quest concept, so it goes in `entities/quest/model`.
- **completion-record storage → entities/record**: history is a separate concept, "completion records."
  `sessionStorage`/`localStorage` access is treated as this entity's `api` segment.
- **share → features/share-odday**: sharing is a user **interaction** and is reused across several screens (next-quest, history). → feature.
- **analytics → shared**: event collection isn't tied to a specific domain; it's domain-agnostic infrastructure used app-wide. → shared.
- **visitor → shared (not entities)**: the anonymous visitor/session id is a value that `shared/lib/analytics` attaches to every event.
  Since `shared` cannot import `entities` (dependency direction), visitor — which analytics depends on — must live in `shared`.
  visitor is anonymous-identification infrastructure rather than a domain concept, so shared is more accurate. (§2, adjustment 1)
- **record → quest cross-import via `@x`**: `OddayRecord.category` uses the `Category` type from `entities/quest`.
  Direct imports between same-layer (entities) slices are forbidden, so quest exposes only `Category` through a record-specific
  Public API `entities/quest/@x/record.ts`, and record pulls it through that. ([fsd-concepts §6](./fsd-concepts.md))
- **feedback-form types → pages/feedback/model**: `FeedbackDraft`/`FeedbackInput` are used by both `FeedbackScreen` (pages)
  and `app/flow`. pages cannot import app, so they live in the feedback slice and `app/flow` pulls them in via the **app → pages**
  direction. (§2, adjustment 2)

### 3.2 Where does useOddayFlow go? (a caution point)

`useOddayFlow` is an **app-wide flow** that orchestrates all step transitions plus several entities (quest, record).
It covers the area the (deprecated) `processes` layer used to handle, and the current spec recommends **distributing it into `app` or `features`.**
([Layers](https://feature-sliced.design/docs/reference/layers))

- For the MVP stage we recommend **keeping it whole in `app/flow/`** (simplest, and close in nature to the router).
- As the flow grows, split each individual interaction's logic (e.g. `selectQuest`, `submitFeedback`) out into its own `features/*/model`
  and keep `app/flow` thin, responsible only for step transitions.

## 4. Migration process (complete)

We followed the order of FSD's official [migration guide](https://feature-sliced.design/docs/guides/migration/from-custom), adapted to our situation, as below.

1. ✅ **Folder skeleton** — created the `app/ pages/ features/ entities/ shared/` layer folders under `src/`.
2. ✅ **shared first** — `components/ui.tsx` → `shared/ui/*`, `lib/{analytics,ref,visitor,posthog}` → `shared/lib`·`shared/api`.
   (The foundation must exist first so upper layers can import it.)
3. ✅ **entities** — `data/quests.ts` + `types/quest.ts` → `entities/quest`, `lib/storage.ts` → `entities/record` (Category cross-imported via `@x`).
4. ✅ **pages** — `screens/*` → `pages/<slice>/ui/`, adding an `index.ts` to each slice. Feedback-form types → `pages/feedback/model`.
5. ✅ **app cleanup** — moved `App.tsx`, `main.tsx`, `useOddayFlow`, and global CSS into `app/`.
6. ✅ **features** — split out only the actually-reused `share-odday`. Other interactions were **not created in advance** and stayed in `app/flow`.

> **Core principles (from the official guide):**
> - Get team agreement first, and don't stop feature development.
> - Move the parts you're already touching first; code you don't touch can stay as-is.
> - Rather than rushing abstraction, **allow duplication first** (for non-business-logic code, copy-paste beats premature abstraction).

## 5. Path aliases (adopted)

Because layer paths get long, we adopted the `@/` alias. Imports from outside a slice take the `@/<layer>/<slice>` form, so the rule is visible.
(Imports **within** the same slice still use relative paths — [fsd-concepts §5](./fsd-concepts.md).)

`tsconfig.app.json` — added to `compilerOptions`:

```jsonc
{
  "compilerOptions": {
    // ...existing settings...
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

`vite.config.ts` — added a resolve alias:

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

Then imports look like this.

```ts
import { Button } from "@/shared/ui/Button";
import { pickQuests } from "@/entities/quest";
import { QuestListScreen } from "@/pages/quest-list";
```

> Since `vite.config.ts` uses `node:path`/`__dirname`, type-checking it (via `tsconfig.node.json`) requires the `@types/node`
> devDependency. We added it along with the alias.

## 6. Tools — the Steiger linter (optional)

To automatically check FSD rules (dependency direction, Public API violations), you can adopt [Steiger](https://github.com/feature-sliced/steiger).

```bash
npm i -D steiger @feature-sliced/steiger-plugin
npx steiger src
```

There may be many violations early in a migration, so we recommend adopting it **after the migration is mostly done**.

## 7. Common mistakes

- ❌ Creating lots of `features` up front → "not everything needs to be a feature." Create it when it's reused.
- ❌ A `pages` slice importing another `pages` slice → references between same-layer slices are forbidden. Move the common part down.
- ❌ Importing a slice's internal file directly from outside → always go through `index.ts`.
- ❌ Putting domain knowledge (quest, record) into `shared` → shared must be domain-agnostic. Domains go in entities.
- ❌ Dividing segments into `components/`, `hooks/` → divide by purpose, not nature. Use `ui/model/api/lib/config`.
