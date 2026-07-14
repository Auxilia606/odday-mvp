# FSD Concepts

> This document explains the concepts, based on the [official Feature-Sliced Design docs](https://feature-sliced.design/).
> It covers the pure concepts, independent of any specific project; how they apply to Odday is covered in [odday-fsd-guide.md](./odday-fsd-guide.md).

## 1. What is FSD

FSD (Feature-Sliced Design) is a set of rules for deciding **which folder, under what name, and on what basis** to place frontend code.
Its goals are: ([Overview](https://feature-sliced.design/docs/get-started/overview))

- **Lower the cost of changing a large project** — so that even as interdependent code grows, you can predict the blast radius of a change.
- **Make onboarding easy** — so that the folder name alone tells you what that code is responsible for.
- **Make refactoring safe** — so that fixing one place doesn't break something unexpected.

FSD divides code into a **three-level hierarchy**.

```
Layer          ─▶  Slice          ─▶  Segment
responsibility     domain             nature
```

---

## 2. Layer — dividing by "technical responsibility"

Layers are the top-level folders that divide code by **responsibility and dependency direction**. There are seven, listed top to bottom.
([Layers](https://feature-sliced.design/docs/reference/layers))

| # | Layer | What it does | Examples |
| --- | --- | --- | --- |
| 1 | **app** | App-wide setup: routing, global store, global styles, entry point, providers, analytics init | `App.tsx`, `main.tsx`, global CSS, PostHog init |
| 2 | ~~processes~~ | Scenarios spanning multiple pages (**deprecated**) | — don't use; distribute into `features`/`app` |
| 3 | **pages** | Whole screens corresponding to routes: page UI, loading/error states, data loading | `HomePage`, `FeedPage` |
| 4 | **widgets** | Large, self-contained UI blocks reused across pages | page layout, header+sidebar combination |
| 5 | **features** | **Reusable interactions** a user performs: forms, validation, related API calls, internal state | `LoginForm`, `AddToCart` |
| 6 | **entities** | **Business concepts (nouns)** the project deals with: data models, schemas, entity APIs, presentation UI | `User`, `Product`, `Post` |
| 7 | **shared** | Reusable foundation not tied to the project: UI kit, API client, utils, constants | `Button`, `apiClient`, `formatDate` |

### Core rule: dependencies flow downward only

> **"A file in a slice may only import from slices in layers strictly below its own."**
> — [Layers](https://feature-sliced.design/docs/reference/layers)

```
app       ─┐  (topmost: nobody can import it, but it can use everything below)
pages      │  ▼  allowed import direction
widgets    │
features   │
entities   │
shared    ─┘  (bottommost: nobody's above it can be used by it, but everyone uses shared)
```

- `pages` may use `widgets`, `features`, `entities`, `shared`.
- `features` may use only `entities`, `shared`. (`pages` or other `features` ✗)
- `shared` imports from no layer at all. (It's the foundation of the whole app.)

**Two exceptions:**
- `app` and `shared` are not divided into slices, and their internal segments may import each other freely.

### "Not everything needs to be a feature"

FSD guards against over-splitting. Make something a `feature` **only if it's a reusable interaction**.
A UI block used on just one page can simply live inside that `pages` slice. ([Layers](https://feature-sliced.design/docs/reference/layers))

---

## 3. Slice — dividing by "business domain"

A slice is a folder that groups code within a layer by **business meaning**.
Names come from the domain — for a photo app: `photo`, `effects`, `gallery`; for a social network: `post`, `comments`, `news-feed`.
([Slices and segments](https://feature-sliced.design/docs/reference/slices-segments))

- Slices exist only in the `pages`, `widgets`, `features`, and `entities` layers.
- `app` and `shared` have no slices. (They're app-wide setup and foundation code, so domain splitting is meaningless.)

### Two ideals: low coupling, high cohesion

- **Zero coupling** — different slices within the same layer don't reference each other.
- **High cohesion** — a slice holds most of the code related to its own purpose.

Because direct imports between slices in the same layer are forbidden, circular dependencies are blocked at the source.
If slices A and B both need each other → move the shared part down to a lower layer (e.g. entities, shared) and share it there.

---

## 4. Segment — dividing by "nature of the code"

A segment is a subfolder that divides code within a slice by **technical nature**. The standard names are:
([Slices and segments](https://feature-sliced.design/docs/reference/slices-segments))

| Segment | What it holds |
| --- | --- |
| `ui` | UI components, formatters, styles |
| `api` | Backend requests, request/response types, mappers |
| `model` | Schemas, interfaces, stores (state), business logic |
| `lib` | Utilities used only inside this slice |
| `config` | Config values, feature flags |

> You may create custom segments, but name them by **purpose, not essence**.
> Divide by "what it's for," not "what it is" — avoid names like `components` or `hooks`.

For a small slice you don't need every segment; `ui` and `model` alone may be enough.

---

## 5. Public API — `index.ts`

A slice **does not expose its internal files directly to the outside.** Instead, `index.ts` exports "only what's public."
This `index.ts` is the slice's **contract** and **gate**. ([Public API](https://feature-sliced.design/docs/reference/public-api))

Purposes of the Public API:
1. **Structure protection** — refactoring internal files won't break outside code.
2. **Behavior clarity** — a meaningful behavior change shows up as an API change.
3. **Minimal exposure** — expose only what's necessary.

```ts
// ❌ Bad: wildcard re-export — the whole internal implementation leaks
export * from "./ui/Comment";
export * from "./model/comments";

// ✅ Good: only what's needed, explicitly
export { LoginPage } from "./ui/LoginPage";
export { RegisterPage } from "./ui/RegisterPage";
```

### Within the same slice, don't go through index

To avoid circular imports, **files within the same slice import each other directly via relative paths.**

```ts
// ❌ inside pages/home/ui/HomePage.tsx
import { loadUserStatistics } from "../";        // own slice index → circular risk

// ✅ directly via relative path
import { loadUserStatistics } from "../api/loadUserStatistics";
```

### `shared/ui` and `shared/lib` use per-component index files

Exporting everything through one big index breaks tree-shaking and bloats the bundle.
For `shared/ui` and `shared/lib`, prefer a **separate index per component/util**. ([Public API](https://feature-sliced.design/docs/reference/public-api))

---

## 6. Cross-imports between entities — the `@x` notation

Sometimes entities need to reference each other (e.g. `entities/A` needs a type from `entities/B`).
Direct imports between same-layer slices are forbidden, but **for the entities layer only**, the `@x` notation allows explicit cross-imports.
([Public API](https://feature-sliced.design/docs/reference/public-api))

```
entities/A/
  @x/
    B.ts        ← the dedicated Public API A exposes for entities/B
  index.ts      ← the general Public API
```

```ts
// inside entities/B
import type { EntityA } from "entities/A/@x/B";
```

> Use cross-imports **as little as possible**, and **only in the entities layer**.

---

## 7. Automated checking — Steiger

FSD rules (dependency direction, Public API, etc.) are hard for a human to review every time.
The [Steiger](https://github.com/feature-sliced/steiger) architecture linter can detect rule violations automatically.
For adoption, see the "Tools" section of [odday-fsd-guide.md](./odday-fsd-guide.md).

---

## Summary checklist

- [ ] Which **layer** does the new code belong to? (app/pages/widgets/features/entities/shared)
- [ ] Which **slice (domain)** within that layer?
- [ ] Which **segment (ui/model/api/lib/config)** within that slice?
- [ ] Do imports flow **only toward lower layers**?
- [ ] Are you avoiding direct references to other slices in the same layer?
- [ ] From outside a slice, do you access it only through its **`index.ts` (Public API)**?
