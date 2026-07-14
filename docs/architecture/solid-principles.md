# SOLID Principles for React Components in Odday

This document defines **how we apply the SOLID principles when writing React components** in Odday.
It sits alongside the [FSD guide](./README.md): FSD decides **where** code goes (layer / slice / segment),
while SOLID decides **how** each unit is shaped internally so it stays easy to change.

> SOLID is five object-oriented design principles. In a React + TypeScript codebase the "object" is usually a
> **component, hook, or module**, so we read each principle through that lens rather than through classes.

## 30-second summary

| Letter | Principle | In one line, for our React code |
| --- | --- | --- |
| **S** | Single Responsibility | A component either **renders UI** or **orchestrates logic** — not both. One reason to change. |
| **O** | Open/Closed | Extend behavior by **adding a variant/adapter/prop**, not by editing a growing `if`/`switch`. |
| **L** | Liskov Substitution | A wrapper component must honor the **full contract** of what it wraps (e.g. a `Button` behaves like a `<button>`). |
| **I** | Interface Segregation | A component's props should be **only what it uses** — no forced, unused props. |
| **D** | Dependency Inversion | Depend on an **abstraction** (props, callbacks, an adapter interface), never on a concrete implementation like PostHog. |

The golden test before writing a component: *"When requirements change, how many files do I touch, and is the change an **add** or an **edit**?"* SOLID pushes you toward small, additive changes.

---

## S — Single Responsibility Principle

> A module should have one reason to change.

In practice this means we keep a clear split between **three responsibilities**:

1. **UI rendering** — `pages/*/ui`, `shared/ui` (presentational, driven by props)
2. **Flow / state orchestration** — `app/flow`, hooks
3. **Domain rules & data access** — `entities/*/model`, `entities/*/api`

FSD already encodes this split by segment (`ui` / `model` / `api`). SRP is the reason that split exists.

### ✅ Good — the flow logic lives outside the screen

`useOddayFlow` ([src/app/flow/useOddayFlow.ts](../../src/app/flow/useOddayFlow.ts)) owns all step
transitions, persistence, and event tracking. The screens under `pages/*/ui` just render props and call callbacks.
`FeedbackScreen` ([src/pages/feedback/ui/FeedbackScreen.tsx](../../src/pages/feedback/ui/FeedbackScreen.tsx))
receives `draft` / `onDraftChange` / `onSubmit` and knows nothing about `sessionStorage`, analytics, or what
"next step" means.

```tsx
// The screen's only job is to render the form and report intent.
export function FeedbackScreen({ draft, onDraftChange, onSubmit }: {
  draft: FeedbackDraft;
  onDraftChange: Dispatch<SetStateAction<FeedbackDraft>>;
  onSubmit: (input: FeedbackInput) => void;
}) { /* ...render only... */ }
```

Because of this split, a copy change on the feedback screen and a change to *when history is saved* are two
different files with two different reasons to change.

### ❌ Bad — a screen that also persists and tracks

```tsx
function FeedbackScreen() {
  const [draft, setDraft] = useState(EMPTY_FEEDBACK_DRAFT);
  const onSubmit = () => {
    addRecord({ /* ... */ });                 // ← domain persistence
    trackEvent({ type: "quest_feedback_submitted" }); // ← analytics
    sessionStorage.setItem("odday-flow", /* ... */);  // ← flow persistence
    navigateToNext();                          // ← flow control
  };
  // ...render...
}
```

Now the component changes for four unrelated reasons. Push persistence into `entities/record`, tracking into
`shared/lib/analytics`, and step control into `app/flow`.

**Rule of thumb:** if a component both `useState`s business data *and* renders markup *and* talks to storage/analytics,
it is doing too much. Lift the logic into a hook or a `model`/`api` module.

---

## O — Open/Closed Principle

> Open for extension, closed for modification.

Adding a new case should mean **adding** a data entry, a variant, or an adapter — not editing a growing conditional
that every existing case depends on.

### ✅ Good — variants as a lookup map

`Button` ([src/shared/ui/Button/index.tsx](../../src/shared/ui/Button/index.tsx)) selects its style from a record.
Adding a `"danger"` variant is one new entry; no existing branch is touched.

```tsx
const styles: Record<string, string> = {
  primary: "bg-odday-accent text-black hover:brightness-105",
  secondary: "bg-odday-surface text-white border border-odday-border ...",
  ghost: "bg-transparent text-odday-muted hover:text-white",
  // danger: "..."  ← extend by adding a row
};
```

### ✅ Good — analytics adapters

`shared/lib/analytics` ([src/shared/lib/analytics/index.ts](../../src/shared/lib/analytics/index.ts)) iterates over a
list of adapters. Adding PostHog/Umami is a `registerAdapter(...)` call — `trackEvent` itself never changes.

```ts
const adapters: AnalyticsAdapter[] = [consoleAdapter, localStorageAdapter];
export function registerAdapter(adapter: AnalyticsAdapter): void { adapters.push(adapter); }
```

### ❌ Bad — a switch that grows with every case

```tsx
function renderIcon(kind: string) {
  if (kind === "place") return <PlaceIcon />;
  else if (kind === "party") return <PartyIcon />;
  else if (kind === "duration") return <DurationIcon />; // every new kind edits this function
}
```

Prefer a `Record<Kind, ReactNode>` map (or config-driven rendering) so new kinds are additive.

**Rule of thumb:** when you find yourself about to add another `else if` to satisfy a new requirement, convert the
branch into a lookup table, a variant prop, or an injected adapter.

---

## L — Liskov Substitution Principle

> A subtype must be usable anywhere its base type is expected, without surprises.

For us, the "subtype" is usually a **wrapper component**. If a component wraps a native element or another component,
it must not silently break that element's contract.

### ✅ Good — `Button` is substitutable for `<button>`

`Button` extends `ButtonHTMLAttributes<HTMLButtonElement>` and spreads `{...rest}`, so `onClick`, `disabled`,
`type`, `aria-*`, etc. all work exactly as on a native button. Anywhere a `<button>` is expected, `Button` drops in.

```tsx
export function Button({ variant = "primary", className = "", children, ...rest }:
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...rest}>{children}</button>;
}
```

Notice it also **merges** `className` rather than overwriting it — a caller's styling expectation is preserved.

### ❌ Bad — a wrapper that drops the contract

```tsx
function Button({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return <button onClick={onClick}>{children}</button>;
  // No `disabled`, no `type`, no aria. Swapping <button> → Button now breaks forms
  // (defaults to type="submit" gone) and disabled states. Not substitutable.
}
```

**Rule of thumb:** when wrapping a DOM element, extend its HTML attributes type and forward `...rest`. When wrapping
another component, accept and pass through its contract instead of re-declaring a narrower one.

---

## I — Interface Segregation Principle

> No consumer should be forced to depend on props it does not use.

Keep prop interfaces **small and focused**. Prefer several focused components over one component with a large,
mode-switching prop set.

### ✅ Good — a focused, self-describing prop set

`OptionGroup` ([src/shared/ui/OptionGroup/index.tsx](../../src/shared/ui/OptionGroup/index.tsx)) asks for exactly
what it needs: `label`, `options`, `value`, `onChange`. A caller can't hold it wrong.

```tsx
export function OptionGroup<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) { /* ... */ }
```

### ❌ Bad — one component, many modes

```tsx
// A "do-everything" input that forces every caller to reason about props they don't use.
<Field
  type="select" options={...} multiline={false} rows={undefined}
  showCharCount={false} currency={undefined} onFileDrop={undefined} /* ...15 more... */
/>
```

Split it: `OptionGroup`, `TextArea`, `Select` — each with only the props relevant to it.

**Rule of thumb:** if half a component's props are `undefined` at most call sites, or props only make sense in
combination with a `mode`/`type` flag, split the component.

---

## D — Dependency Inversion Principle

> Depend on abstractions, not concretions. High-level modules shouldn't import low-level details.

This is the principle our analytics layer is built on, and it's the one that most affects component code:
**UI depends on props and callbacks; it never reaches for a concrete service.**

### ✅ Good — screens depend on an abstraction, not on PostHog

Screens call `trackEvent(...)`, an abstraction in `shared/lib/analytics`. The concrete PostHog implementation lives in
`shared/api/posthog.ts` ([src/shared/api/posthog.ts](../../src/shared/api/posthog.ts)) and is injected once at startup
via `registerAdapter`. Swapping analytics vendors changes **zero** screen files.

```
FeedbackScreen ──(onSubmit)──▶ useOddayFlow ──(trackEvent)──▶ AnalyticsAdapter (interface)
                                                                    ▲
                                                       createPosthogAdapter()  ← concrete, injected in app/main.tsx
```

Likewise, screens depend on the **callbacks** passed by `useOddayFlow` (`onSubmit`, `selectQuest`, …), not on the flow's
internals. The flow could switch from `sessionStorage` to a server without touching a single screen.

### ❌ Bad — a screen importing the concrete service

```tsx
import posthog from "posthog-js";
function FeedbackScreen() {
  const onSubmit = () => posthog.capture("feedback_submitted", { /* ... */ }); // ← locked to PostHog
}
```

Now every screen knows about PostHog, and swapping vendors is a repo-wide edit.

**Rule of thumb:** a `pages/*/ui` or `shared/ui` file should never `import` an SDK (posthog, a storage client, an HTTP
client). It receives data via props and reports events via an injected function or an `entities`/`shared` abstraction.

---

## How SOLID maps onto our FSD layers

SOLID and FSD reinforce each other. The dependency rule ("import only from lower layers") *is* Dependency Inversion at
the architecture scale, and the segment split (`ui`/`model`/`api`) *is* Single Responsibility at the file scale.

| Layer | Primary SOLID emphasis |
| --- | --- |
| `shared/ui` | **L, I, O** — small substitutable primitives, focused props, variant maps |
| `shared/lib`, `shared/api` | **D, O** — adapter interfaces, injectable implementations |
| `entities/*/model`, `*/api` | **S** — domain rules & data access isolated from UI |
| `pages/*/ui` | **S, D** — render-only; depends on props/callbacks, not services |
| `app/flow` | **S** — orchestration only; delegates domain work to entities |

---

## Component development checklist

Before opening a PR for a new or changed component, check:

- [ ] **S** — Does this file have a single reason to change? (Rendering *or* orchestration *or* domain logic — not a mix.)
- [ ] **S** — Is any storage / analytics / step-transition code that leaked into a screen pushed down to `entities` / `shared` / `app/flow`?
- [ ] **O** — Would adding the *next* variant/case be an **add** (new row/adapter/entry) rather than an **edit** to a growing conditional?
- [ ] **L** — If it wraps a DOM element or component, does it extend that element's attribute type and forward `...rest` (including `className`, `disabled`, `aria-*`)?
- [ ] **I** — Are all props actually used by most callers? No `mode`-gated dead props?
- [ ] **D** — Does the UI avoid importing any concrete SDK/service, depending on props/callbacks/abstractions instead?

---

## Common mistakes

- ❌ **A "smart" screen** that fetches, persists, tracks, *and* renders. → Split rendering from orchestration (S).
- ❌ **Editing a shared component's `switch` for each new page's need.** → Add a variant or accept a render prop (O).
- ❌ **A wrapper that only forwards `onClick`/`children`** and drops `disabled`/`type`/`aria`. → Extend the HTML attrs type (L).
- ❌ **A god-component with a `type`/`mode` prop** that changes which other props matter. → Split into focused components (I).
- ❌ **`import posthog` (or any SDK) inside `pages/*/ui`.** → Depend on `trackEvent` / an injected adapter (D).
- ❌ **Applying SOLID as ceremony on a one-off component.** → SOLID earns its cost where change is likely; don't abstract a component that will only ever have one form (mirrors FSD's "allow duplication first").
