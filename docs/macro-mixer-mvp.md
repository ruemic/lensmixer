# Macro Mixer MVP

## Purpose

Macro Mixer is a generative-UI workbench for **map / reduce research**. The operator shapes a structured inference graph: each card has a parent, a directive, and a model-attributable origin. This is not chat; it is a board.

## Core Loop

```text
question or card -> Expand (N parallel lens streams) -> select cards -> Reduce (one synthesis) -> repeat
```

Expand fans a card out into N children, each driven by a different lens prompt running as its own streaming Gemini call. Reduce takes the selection and folds it into one synthesis card with full provenance.

## Operation 1: Expand

Inputs:

- `parentCardId` and `parentText`
- operator `directive` (free-form text shaping every lens)
- `lensCount` (default 3, max 6)

Behavior:

- Spawn `lensCount` parallel `streamGenerate` calls, one per lens (`base`, `dissent`, `wildcards`, plus generic lenses for higher counts).
- Multiplex chunks over a single SSE response tagged by `lensIndex`.
- Each child card's `parentIds = [parentCardId]`, with `lensId`, `lensName`, `directive`, `provider = "Gemini"`, and the active model recorded.

## Operation 2: Reduce

Inputs:

- `cards`: the selected cards (must contain text and be `complete`).
- `directive`: the operator's directive for the synthesis.

Behavior:

- One streaming Gemini call composing the selected cards and directive.
- New card has `parentIds = sourceCardIds`; inputs hide via `collapsedIntoId`.
- Detail rail still surfaces tucked children — provenance is preserved, not destroyed.

## Minimal UX

One screen:

- Question textarea (drives the seed card)
- Directive textarea (applies to next op)
- Lens count selector (2 / 3 / 4)
- `Expand` button (runs against the active card) and per-card `Expand` chip
- `Reduce` button (runs over the selection)
- Stop button (aborts the active op)
- Card grid with marquee selection
- Activity rail with provider transcripts (custom A2UI catalog component) and an A2UI projection of the active card
- Detail rail showing the active card text, provenance, tucked children, and AG-UI event log

## Card Shape

```ts
type Card = {
  id: string;
  kind: "seed" | "lens" | "synthesis";
  title: string;
  text: string;
  parentIds: string[];
  directive?: string;
  lensId?: string;
  lensName?: string;
  provider?: string;
  model?: string;
  status: "queued" | "streaming" | "complete" | "failed";
  opId?: string;
  collapsedIntoId?: string;
  createdAt: string;
};
```

Selection is UI state. Provenance is durable.

## Framework Projection

- **AG-UI** is the event contract. Run lifecycle maps to `RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR`. Per-lens stream chunks map to `TEXT_MESSAGE_START` / `_CONTENT` / `_END` keyed by `${opId}:${laneId}`. Card additions and selection changes map to `STATE_DELTA`. App-level controls remain `CUSTOM`.
- **A2UI** is the generated inspectable surface. The prototype uses v0.9 `createSurface`, `updateDataModel`, and `updateComponents` to render the active card, selection count, status, parent count, and latest activity. It also registers a custom `ProviderOutlet` catalog component: A2UI declares the outlet lane ids; React owns terminal-grade scrollback, follow-latest, copy, and counters.

## Non-Goals

- No council mechanic (no braid, no ballots, no capstone fold).
- No multi-provider routing (Gemini only).
- No background batch jobs or persistent run state.
- No auto-loop runner.

## Demo Story

Operator types a question, hits `Expand`, watches three lenses stream into three cards. Selects two, hits `Reduce`, watches a synthesis card appear with its parents tucked behind it. Drills into the synthesis to inspect provenance: the directive used, the parent cards, the AG-UI event log, the streaming transcript that produced it.
