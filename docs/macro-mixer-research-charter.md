# Macro Mixer Long-Horizon Research Charter

## Mission

Macro Mixer is a generative-UI workbench for long-horizon research, framed as a map / reduce operator surface. The MVP keeps the feature count small but the prototype should remain a strong learning artifact: inspectable, demonstrable, and clear about how AG-UI, A2UI, React, and Tailwind combine into a collaborative operator surface.

## Product Thesis

Macro Mixer helps an operator build contextual pyramids:

```text
research question -> parallel lens cards -> selected synthesis card -> repeat
```

The point is not summarization. The point is steerable structured inference: explore lenses, compare them, preserve dissent, synthesize, and keep provenance visible.

## Inference Boundary

The MVP calls the Gemini API directly through `@google/genai`. All inference plumbing lives in `src/lib/gemini/` and the `/api/expand` and `/api/reduce` route handlers. The client code never speaks to the SDK directly — it consumes a stable SSE frame contract.

If a future iteration needs multi-provider routing, receipts, or replay, the right move is to layer those concerns on top of the Gemini bridge or behind a thin authority adapter — not to scatter SDK calls across components.

## Framework Learning Goals

Use the sponsor frameworks deeply enough that the prototype can teach them back:

- **AG-UI**: project Gemini run lifecycle and lane streams into inspectable UI events.
- **A2UI**: project the active card, selection state, and live transcript through a generated component surface, including a custom `ProviderOutlet` catalog component for terminal-grade scrollback.
- **CopilotKit**: evaluate how an agent could operate or steer the surface without bypassing the inference contract.
- **Tailwind 4**: keep layout fast to iterate, dense, responsive, and visually legible.

Document what is real, what is mocked, and what framework affordance each slice demonstrates.

## MVP Scope

Keep the functional surface minimal:

- Expand (map) a card with a directive
- Reduce a selection of cards into one synthesis
- Marquee select / deselect
- Inspect provenance, transcript activity, and status
- Stop the active op

Avoid extra primitives until the basic loop feels excellent.

## Quality Bar

The prototype should be demonstrable when unattended:

- A new operator can run it locally and understand the loop.
- Live runs visibly stream and reach a terminal state.
- Failures are represented honestly (status flips to `failed`, error text in the control rail).
- Every generated card links back to its parents, the directive used, and the model.
- UI affordances are ergonomic: selection is obvious, synthesis collapse is visible, drill-down is accessible.
- Docs explain the framework lessons and known gaps without bloating.

## Working Rhythm

Prefer tight research-build-document loops:

1. Run the current UI against live Gemini.
2. Inspect cards, transcripts, AG-UI events.
3. Improve the smallest UX or plumbing issue.
4. Record findings in `AGENTS.md` if they generalize.
5. Re-run a focused smoke.

## Stop Conditions

Stop and reassess before adding complexity if:

- Direct provider calls leak outside `src/lib/gemini/`.
- Provenance becomes decorative instead of load-bearing.
- Framework code becomes demo theater instead of explaining a real interaction.
- Inference paths stop being abortable, observable, or reproducible.
