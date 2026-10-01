# Rundown Studio

A live-show rundown builder for broadcast directors — drag broadcast segments onto a canvas,
auto-compute cumulative timings, detect schedule conflicts, and export a printable show sheet.

## Features

- **Drag-and-drop rundown** — place broadcast segments (open / host / news / interview / VCR /
  commercial / interactive / performance / closing) and connect them into a broadcast order.
- **Timeline engine** — cumulative start/end times, overtime detection against a target length,
  and wall-clock anchor conflict detection (e.g. "the 19:00 news must start at 19:00").
- **Broadcast templates** — talk show, evening news, gala, and livestream commerce, one click each.
- **Rundown table** — live show sheet with cumulative start times and segment chips.
- **CSV export** — UTF-8 (BOM) export that opens cleanly in Excel.
- **Local auto-save** — state persists to `localStorage` across reloads.

## Architecture

The scheduling logic is a pure, dependency-free module in [`src/engine/`](src/engine) — fully
unit-tested and portable:

| Module | Responsibility |
| --- | --- |
| `engine/timeline.ts` | cumulative timing, overtime check, wall-clock parse/format, anchor conflict detection |
| `engine/graph.ts` | topological ordering (Kahn's algorithm) to resolve broadcast order from the canvas graph |

State lives in a Zustand store ([`src/store/rundownStore.ts`](src/store/rundownStore.ts)) that
enforces a **linear-chain invariant** — each node has at most one incoming and one outgoing edge,
matching how a real rundown flows.

## Tech stack

- React 19 · TypeScript (strict) · Vite 8
- [React Flow](https://reactflow.dev) (`@xyflow/react`) — canvas
- Zustand — state + persistence
- Tailwind CSS v4 — shared design system
- Vitest — unit tests for the engine

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm test         # run engine unit tests
npm run build    # type-check + production build
```

## Design notes

- The engine has **no React/UI imports**, so it stays unit-testable and could be reused outside
  the browser.
- `parseWallClock` treats `"19:10"` as wall-clock (7:10 PM), not as a duration — a subtle bug
  class that the unit tests pin down explicitly.
