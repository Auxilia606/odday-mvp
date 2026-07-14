# Odday Architecture Guide — Feature-Sliced Design (FSD)

This folder collects the **architecture rules to follow when adding or changing screens and features** in Odday.
We use the [Feature-Sliced Design (FSD)](https://feature-sliced.design/) methodology as our baseline.

> FSD is "an architectural methodology for structuring frontend applications — a set of rules and conventions on organizing code."
> Its goal is to keep code easy to understand and safe to change even as business requirements keep shifting.
> — [FSD official docs · Overview](https://feature-sliced.design/docs/get-started/overview)

## Document structure

| Document | Contents | When to read |
| --- | --- | --- |
| [fsd-concepts.md](./fsd-concepts.md) | FSD concepts — layers / slices / segments, dependency rules, Public API | When you first meet FSD, or when the rules feel unclear |
| [odday-fsd-guide.md](./odday-fsd-guide.md) | How FSD is applied in this project — layer-by-layer structure mapping, folder placement, path aliases | When you're unsure where to put a new folder/file |
| [adding-features.md](./adding-features.md) | The hands-on procedure and checklist for adding/changing features, with examples | When you actually start work |

## 30-second summary

FSD splits code into three levels.

```
Layer          →  Slice               →  Segment
"technical role"   "business domain"      "nature of the code"
app/pages/...      quest / feedback       ui / model / api / lib
```

There is really only one core rule.

> **A file may only import from slices in layers strictly *below* its own.**
> — [FSD official docs · Layers](https://feature-sliced.design/docs/reference/layers)

Layer order (top → bottom): **app → pages → widgets → features → entities → shared**

- Dependencies flow top → bottom only. (`pages` may use `features`, but `features` may not use `pages`.)
- Different slices within the same layer do not import each other. (`features/share` referencing `features/feedback` directly ✗)
- From outside a slice, access it only through its `index.ts` (Public API). Never reference its internal files directly.

## Adoption status

Odday MVP has **completed its migration to the FSD structure.** `src/` is now organized into the
`app / pages / features / entities / shared` layers, and the previous flat structure
(`screens/`, `components/`, `lib/`, `state/`, `data/`, `types/`) has been fully migrated and removed.
For layer placement, the mapping, and the reasoning behind migration decisions, see [odday-fsd-guide.md](./odday-fsd-guide.md).

Going forward, follow the procedure in [adding-features.md](./adding-features.md) when adding screens or features.

## Sources (web-based)

This guide is based on the following official FSD documents.

- [Overview](https://feature-sliced.design/docs/get-started/overview)
- [Reference · Layers](https://feature-sliced.design/docs/reference/layers)
- [Reference · Slices and segments](https://feature-sliced.design/docs/reference/slices-segments)
- [Reference · Public API](https://feature-sliced.design/docs/reference/public-api)
- [Tutorial](https://feature-sliced.design/docs/get-started/tutorial)
- [Migration guide](https://feature-sliced.design/docs/guides/migration/from-custom)
