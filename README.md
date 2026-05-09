# Macro Mixer MVP

Generative-UI workbench for the hackathon. Visual map / reduce over Gemini.

```text
question  →  Expand (N parallel lens streams)  →  select cards  →  Reduce (one synthesis)  →  repeat
```

The UI is intentionally minimalist: a centered question card on first load, a card grid afterwards, a contextual `Reduce N cards` pill when a selection has 2+ cards, and a per-card `Expand` chip on hover. Click any card to open it in a fullscreen markdown reader. State persists across reloads via a UUID in the URL.

## Setup

```bash
echo "GEMINI_API_KEY=your_key_here" > .env.local
npm install
npm run dev
```

Optional overrides:
- `GEMINI_MODEL` — defaults to `gemini-flash-latest`. For the demo we recommend `gemini-2.5-flash` (looser free quota).

## Commands

```bash
npm run dev        # Next.js prototype on localhost:3000
npm run typecheck  # tsc --noEmit
npm run build      # production build
```

## Architecture Map

**Inference**
- `src/lib/gemini/client.ts` — thin `@google/genai` wrapper. `streamGenerate({prompt, model?, signal?})` returns an async iterable of text chunks. Detects safety blocks, empty responses, and `finishReason !== STOP` and throws a typed `StreamGenerateError`.
- `src/lib/gemini/lenses.ts` — three default lenses (`base`, `dissent`, `wildcards`) plus `composeLensPrompt` / `composeReducePrompt`. Both prompts demand a structured output: headline + bullets + `---` separator + markdown body.
- `src/lib/gemini/rollup.ts` — `parseRollup(text)` extracts `{headline, bullets, body, trailing}` from a (potentially partial) streaming response. Robust to missing separators, markdown headers, and surrounding quotes.
- `src/lib/gemini/sse.ts` — shared SSE frame types, encoder, and `parseSSEFrames` reader (isomorphic; no `node:crypto` import).

**API routes**
- `src/app/api/expand/route.ts` — POST → SSE. Spawns N parallel Gemini streams, multiplexes chunks tagged by `lensIndex` over a single response. Categorizes errors into `safety` / `rate_limit` / `network` / `unknown`. Defensive `send` helper ignores writes after the controller closes (no more "Controller already closed" stack traces).
- `src/app/api/reduce/route.ts` — POST → SSE. Single Gemini stream composing the selected cards into one synthesis.

**Domain**
- `src/lib/mixboard/kernel.ts` — the `Card` type: `{id, kind: "seed"|"lens"|"synthesis", title, text, parentIds, directive?, lensId?, lensName?, provider?, model?, status, error?, opId?, collapsedIntoId?, createdAt}`.
- `src/lib/mixboard/agui-events.ts` — AG-UI event constructors (`RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR`, `TEXT_MESSAGE_*`, `STATE_DELTA`, `STATE_SNAPSHOT`, `CUSTOM`).

**UI**
- `src/components/MacroMixerPrototype.tsx` — workbench controller. State, selection, marquee, SSE consumers, AG-UI emission, URL-based persistence.
- `src/components/SeedComposer.tsx` — centered question textarea with `↵ to begin` hint, autofocused on first load.
- `src/components/SeedBreadcrumb.tsx` — quoted question chip pinned at the top once children exist.
- `src/components/mixboard/BoardCanvas.tsx` — card grid. Synthesis cards span the full row at bigger type. Each card renders headline + bullets through `parseRollup`. Click body opens reader; click corner circle toggles selection; hover reveals an `Expand` chip on complete cards.
- `src/components/FullscreenReader.tsx` — modal reader. 5xl headline, 2xl bullets, plus the markdown-rendered long-form body below a divider. Esc / backdrop / ✕ to close.
- `src/components/ReduceFab.tsx` — floating bottom-center pill, only visible when `selectedIds.length >= 2 && !activeOp`.
- `src/components/mixboard/ui.ts` — shared Tailwind class fragments, marquee math, AG-UI event labelers.
- `src/components/mixboard/provider-lanes.ts` — `laneIdForLens(index)` lane id helper for AG-UI text-message events.

## Provenance Model

Every generated card carries:

- `parentIds` — exact input cards the model saw
- `directive` — the operator directive at run time
- `lensId` / `lensName` — for expand children
- `provider`, `model` — `"Gemini"` and the resolved model alias
- `status` — `queued` → `streaming` → `complete` (or `failed`)
- `error?` — categorized error with `kind: "safety" | "rate_limit" | "network" | "unknown"` and a friendly message

After `Reduce`, source cards aren't deleted — they get a `collapsedIntoId` and render visually ghosted (opacity 30 + slight blur) below the new synthesis.

## Session Persistence

- On first visit, a `crypto.randomUUID()` is generated and pushed to `?s=<uuid>` via `history.replaceState`.
- Every change to `{question, cards, selectedIds, openCardId}` is debounced 500ms and saved to `localStorage` at `mixer:v1:<uuid>`.
- On reload, the URL's `?s=` is read, the snapshot is hydrated, and any cards that were `streaming` or `queued` at save time are sanitized to `failed` with an "interrupted" error message.
- Strip the `?s=` from the URL for a fresh session.

## SSE Frame Shapes

```ts
// /api/expand
{ type: "start"; opId; parentCardId; directive; lenses: {index, id, name, childCardId}[]; model }
{ type: "lens_start"; lensIndex }
{ type: "delta"; lensIndex; text }
{ type: "lens_done"; lensIndex; text }
{ type: "lens_error"; lensIndex; message; kind: "safety"|"rate_limit"|"network"|"unknown"; detail? }
{ type: "complete" }
{ type: "error"; message; kind; detail? }

// /api/reduce
{ type: "start"; opId; cardId; sourceCardIds; directive; model }
{ type: "delta"; text }
{ type: "done"; text }
{ type: "error"; message; kind; detail? }
```

## Accessibility

- Cards are `<article role="group" aria-labelledby aria-busy aria-pressed tabIndex={0}>`.
- Headlines are real `<h3>`; bullets are real `<ul><li>`. The reader uses `<h1>` for the focused headline.
- `aria-live="polite"` on streaming bodies, `aria-busy` toggles while in flight so screen readers wait until settled before announcing.
- Keyboard: `Tab` focuses cards, `Enter` opens reader, `Space` toggles selection.
- Root font sizing uses `%` so user accessibility settings and browser zoom both compound naturally.
