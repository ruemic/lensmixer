# Repository Guidelines

## Project Structure & Module Organization

This repository contains Generative UI hackathon planning material and the Macro Mixer MVP prototype.

- `generative-ui-hackathon-*.md`: event context, stack notes, social dynamics, and submission constraints.
- `macro-mixer-concept-brief.md`: original concept pitch (kept for historical context — the live prototype is narrower).
- `docs/`: current MVP notes and the long-horizon research charter.
- `src/app/`: Next.js App Router pages, global styles, and streaming API routes (`/api/expand`, `/api/reduce`).
- `src/components/`: React work-surface and projection components.
- `src/components/mixboard/`: lean board projection components — controls, activity rail, board canvas, node detail rail, plus the SSE-to-`ProviderOutletLane` adapter.
- `src/lib/mixboard/`: the `Card` type and AG-UI event constructors.
- `src/lib/gemini/`: `@google/genai` client wrapper, lens prompt helpers, and shared SSE frame types.

## Build, Test, and Development Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

`npm run dev` starts the Next.js preview at `localhost:3000`. `npm run typecheck` runs TypeScript without emit. `npm run build` verifies the production build. There is no automated test suite in the MVP — verify behavior in the browser.

Before running anything that calls Gemini, make sure `GEMINI_API_KEY` is set in `.env.local`. Override the model with `GEMINI_MODEL` (defaults to `gemini-flash-latest`).

## Coding Style & Naming Conventions

Use TypeScript and React. Follow Next.js App Router names: `page.tsx`, `layout.tsx`, and `route.ts`. PascalCase for components, camelCase for functions and variables, kebab-case for non-component files.

Use Tailwind 4 for layout and styling. Keep components small, projection-friendly, and explicit about provenance. Pure transforms live in `src/lib/`. The controller in `MacroMixerPrototype.tsx` owns state, selection, and SSE consumption; presentational React stays in `src/components/mixboard/*`.

## Inference Architecture

The MVP calls the Gemini API directly from server-side route handlers. The two operations are:

- **Expand (map)**: `POST /api/expand` opens N parallel `streamGenerate` calls, one per lens, and multiplexes the chunks back to the client over a single SSE response. Each lens becomes a child card whose `parentIds = [parentCardId]`.
- **Reduce**: `POST /api/reduce` opens one `streamGenerate` call composing the selected cards plus the directive into a synthesis. The new card carries `parentIds = sourceCardIds`; the inputs collapse behind it via `collapsedIntoId`.

SSE frame shapes live in `src/lib/gemini/sse.ts`. The client reads them with `parseSSEFrames` and dispatches into React state.

## Provenance Rules

Every generated card must record:

- `parentIds`: the ids of cards the model saw as input.
- `directive`: the operator's directive string at the time of the run.
- `lensName` / `lensId` (expand only): which lens prompt produced this card.
- `provider` and `model`: at minimum `"Gemini"` and the model alias used.
- `status`: `queued` → `streaming` → `complete` (or `failed`).

When a reduce runs, the source cards keep their data — only `collapsedIntoId` is set so they hide behind the synthesis. The detail rail surfaces the parents, the directive, and the tucked children. Do not break that link.

## Hackathon Context

This prototype originally shelled out to a separate Bitter CLI at `/Users/c3po/co/bitter` to mediate inference through a Council Synthesis macro (research → braid → ballot → reduce → fold). It was pivoted to direct Gemini calls for hackathon expediency: the council mechanic added 1,400+ LOC of plumbing for a feature the demo does not require. The map / reduce shape preserves the demo story (cards bloom, cards collapse, provenance survives) without the orchestration overhead.

If a future iteration brings back multi-provider councils, build it on top of this Gemini layer rather than reverting; or wire it back through Bitter if the authority story matters again.

## Don'ts

- Do not introduce direct provider SDK calls outside `src/lib/gemini/`. Keep the client surface narrow and replaceable.
- Do not log or persist the API key; it lives only in process env.
- Do not break provenance: every generated card needs `parentIds` and a `directive`.
- Do not reintroduce ballots, braid packets, or capstone fold without lifting the corresponding UI affordances.
