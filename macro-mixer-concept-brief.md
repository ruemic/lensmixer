# Macro Mixer Concept Brief

## One-Liner

**Macro Mixer** is a generative UI for structured, scaled inference, letting operators compose multi-model research cascades with adjustable lenses, budgets, votes, and receipts.

## Concept

Macro Mixer turns a complex research question into an interactive inference workbench. Instead of asking one model for one answer, the operator shapes a macro: which lenses to explore, which models to involve, how much budget to spend, how much disagreement to preserve, and what evidence or receipt standard the final answer must meet.

The sample domain is macroeconomics, giving the project a memorable double meaning: a macro engine for macro questions. A user might ask, "What are the biggest macro risks for AI infrastructure over the next 12 months?" Macro Mixer then generates a live control surface for exploring rates, energy, semiconductors, AI capex, FX, geopolitics, and demand as separate facets.

## Why This Is Generative UI

This should not be a chatbot with cards. The interface is generated because each research problem needs a different operating surface. A question about AI infrastructure should produce different lenses, model lanes, vote controls, and evidence checks than a question about consumer inflation or Hong Kong's position in the AI economy.

The generated UI lets the operator do things chat handles poorly:

- adjust research breadth and depth before spending inference
- select or mute provider lanes
- add, remove, or weight analytical lenses
- watch research, review, and synthesis phases progress
- compare model disagreement visually
- approve budget or scope changes
- inspect receipts, traces, and replay metadata

## Interaction Model

The operator acts like a conductor or mixer. Models are sections, analytical lenses are tracks, prompt fragments are clips, and the macro contract is the score. The live run is the performance; the receipt is the recording.

Core controls:

- **Lens grid**: rates, inflation, labor, energy, semis, FX, policy, AI capex, demand.
- **Provider lanes**: compact icons for Codex, Claude, Gemini, local, or fake providers.
- **Budget dial**: max children, token estimate, dollar estimate, and wall-clock target.
- **Kaleidoscope slider**: increases independent perspectives before convergence.
- **Quorum meter**: shows how many reviewers agree, challenge, or remain uncertain.
- **Dissent toggle**: preserve disagreement in the final synthesis.
- **Receipt rail**: macro run id, child traces, verifier status, replay packet, selected output.

## Bitter Fit

Bitter already has the right substrate:

```text
MacroDefinition -> phases, fanout, quorum, permissions, budget, skills
MacroRuntime    -> plans child runs and selects output
macro_run.json  -> receipt
replay_packet   -> replay input
macro verify    -> proof checker
```

Macro Mixer is a new operator projection over that substrate. Ratatui is one interface; Macro Mixer is a web-native generative interface built with hackathon primitives.

## Demo Flow

1. User enters a macroeconomic research question.
2. The agent generates a proposed macro surface: lenses, provider lanes, budget, quorum, and output policy.
3. User drags the kaleidoscope slider from narrow to broad and approves the budget.
4. The app runs or simulates a Bitter macro cascade.
5. Provider lanes stream research and review states.
6. A vote matrix highlights agreement, dissent, and uncertainty.
7. Final synthesis appears with base, bull, and bear cases.
8. Receipt panel shows the macro run, selected output, verifier status, and replay handle.

## MVP Scope

For the hackathon, keep the first build focused:

- generated macro configuration UI
- live simulated or real macro execution states
- provider icons, lens grid, vote matrix, and receipt rail
- one polished macroeconomic demo prompt
- clear explanation of what is real Bitter substrate versus hackathon projection

## Pitch

Macro Mixer makes inference orchestration visible and steerable. It shows that the future of agent interfaces is not longer chat transcripts; it is generated control surfaces for structured work, with evidence and receipts built in.
