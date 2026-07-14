# AGENTS.md

Entry point for AI coding agents working on **Odday**. Start here, then follow the links
below to the detailed docs. This file is an **index** — it does not duplicate content, it
points to the source of truth for each topic.

> Odday: 오늘을 조금 이상하게. — Make today a little odd.
> A GitHub Pages–based MVP that proposes small real-world quests and validates, through
> anonymous behavior data, whether users actually act differently than usual.

## What this project is

A backend-less static SPA (Vite + React + TypeScript + Tailwind). Personal records live in
`localStorage`; the anonymous visitor id is a `crypto.randomUUID()`. Behavior data flows
through an analytics abstraction (`src/shared/lib/analytics`) whose current sinks are
console/localStorage, with PostHog wired as an optional adapter.

Full product background, hypotheses, event design, and metrics: [docs/concept/MVP.md](docs/concept/MVP.md).

## Commands

```bash
npm install
npm run dev        # http://localhost:5173/odday-mvp/
npm run build      # tsc -b && vite build → dist/
npm run preview    # preview the production build
npm run typecheck  # tsc -b --noEmit
```

Before committing a non-trivial change, `npm run typecheck` must pass (it is `strict`, with
`noUnusedLocals`/`noUnusedParameters`).

## Non-negotiable rules

1. **Architecture is Feature-Sliced Design (FSD).** Screens and features must respect the
   layer/slice/segment structure and the import direction. Read
   [docs/architecture/README.md](docs/architecture/README.md) first.
2. **Imports flow top → bottom only:** `app → pages → widgets → features → entities → shared`.
   Same-layer slices do not import each other (entities may cross-reference only via `@x`).
   Access a slice from outside only through its `index.ts` (Public API).
3. **Component internals follow SOLID.** See [docs/architecture/solid-principles.md](docs/architecture/solid-principles.md).
4. **Language policy:** documentation prose is **English**; product-facing strings — quest
   text, on-screen UI copy, taglines — stay **Korean** (those are the actual shipped strings).
5. **No PII.** Only anonymous, aggregate behavior data. See MVP.md §13.

## Documentation index

| Document | What it covers | Read when |
| --- | --- | --- |
| [README.md](README.md) | Project overview, stack, dev/deploy, referral tracking | First orientation |
| [docs/concept/MVP.md](docs/concept/MVP.md) | Product plan: hypotheses, flow, quest categories, event schema, funnels, metrics | Understanding *why* something exists or designing product behavior |
| [docs/architecture/README.md](docs/architecture/README.md) | FSD overview + 30-second summary + adoption status | Before touching any screen/feature |
| [docs/architecture/fsd-concepts.md](docs/architecture/fsd-concepts.md) | FSD concepts — layers/slices/segments, dependency rules, Public API | When the FSD rules feel unclear |
| [docs/architecture/odday-fsd-guide.md](docs/architecture/odday-fsd-guide.md) | How FSD maps onto this repo — folder placement, path aliases | When unsure *where* a file goes |
| [docs/architecture/adding-features.md](docs/architecture/adding-features.md) | Step-by-step procedures + pre-commit checklist for adding/changing features | When you start writing code |
| [docs/architecture/solid-principles.md](docs/architecture/solid-principles.md) | SOLID applied to React components here, with a PR checklist | When writing or reviewing a component |

## Source map

```
src/
├── app/        App shell, flow state machine (useOddayFlow), entry (main), global styles
├── pages/      One slice per screen/step: start · context · quest-list · quest-detail
│               · feedback · next-quest · history   (each exposes ui/ via index.ts)
├── features/   Reusable user actions: share-odday
├── entities/   Business nouns: quest (dataset/pick/model), record (storage/model)
│               (cross-entity refs use the @x/ notation only)
└── shared/     Domain-agnostic building blocks:
    ├── ui/     Button · Card · HeroBadge · OptionGroup · Screen · Tag
    ├── lib/    analytics · ref · visitor
    └── api/    posthog adapter
```

- **Path alias:** `@/*` → `src/*` (configured in `vite.config.ts` and `tsconfig.app.json`).
- **Within a slice:** import via relative paths. **From outside a slice:** import via `@` + the slice's `index.ts`.

## Deployment

Pushing to `main`/`master` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml),
which builds and deploys to GitHub Pages. `vite.config.ts`'s `base` must match the repo name
(`/odday-mvp/`) or assets 404. Deploy URL: `https://{username}.github.io/odday-mvp/`.

## Environment

Copy `.env.example` → `.env`. PostHog is optional: if `VITE_PUBLIC_POSTHOG_KEY` is empty,
collection is disabled and only the console/localStorage sinks run. The PostHog key is a
public client key, not a secret.
