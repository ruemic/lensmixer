# Mixboard Concept: A Visual Map/Reduce Work Surface for AI Research

Status: hackathon concept memo  
Audience: Gemini / coding agents / hackathon teammates  
Goal: align the build around the simplest high-impact version

---

## 1. One-Sentence Concept

**Mixboard is a visual map/reduce board for AI research: expand one idea into multiple lens-based research cards, then reduce selected cards into a synthesis card with visible provenance.**

Short tagline:

> **Expand ideas. Reduce noise.**

---

## 2. Why This Exists

Power users already do a version of this manually.

A common workflow is:

1. Ask a question to one or more AI models.
2. Ask for different perspectives, critiques, or implementation plans.
3. Copy the best outputs into another thread.
4. Ask for synthesis.
5. Repeat until the result becomes clear.

That workflow is powerful, but it is labor-intensive and scattered across tabs, chats, and documents.

Mixboard turns that ritual into a simple visual surface.

Instead of a chatbot conversation, the user gets a board where ideas can:

- expand into multiple perspectives,
- be selected spatially,
- collapse into a synthesis,
- preserve their provenance,
- and be expanded again.

The core insight:

> AI produces too much information. The hard part is not generation. The hard part is expansion, comparison, compression, and keeping track of where the judgment came from.

---

## 3. The Hackathon Cut

Earlier versions explored richer multi-agent council mechanics: persistent provider threads, braid/cross-review, ranked rapporteur election, clean-room synthesis, capstone folding, and Bitter CLI integration.

For hackathon purposes, we are stripping that down to the smallest shape that can win:

```text
Card → Expand → 3 lens cards → Select → Reduce → synthesis card with provenance
```

That is the whole product loop.

The current build should not try to prove the entire future architecture. It should make this one interaction feel obvious, fast, visual, and useful.

---

## 4. Core Interaction Loop

### 4.1 Seed

The user starts with a card or prompt.

Example:

```text
What should we build to win this generative UI hackathon?
```

This creates a seed card.

### 4.2 Expand

The user clicks **Expand** on a card.

The system runs multiple Gemini calls in parallel, one per lens.

Default lenses:

1. **Builder**  
   Turn the input into the most concrete implementation path. Prefer steps, architecture, and tradeoffs.

2. **Skeptic**  
   Challenge assumptions, identify risks, contradictions, missing evidence, and failure modes.

3. **Wildcards**  
   Look for non-obvious angles, surprising opportunities, alternate framings, and high-upside ideas.

The important UX detail:

> Child cards should appear immediately as streaming placeholders, not only after each call completes.

The board should visibly “bloom” from one parent card into three lens cards.

### 4.3 Select

The user selects cards on the board.

Selection may be by checkbox, click, or marquee drag. The exact mechanism is less important than making it obvious that the user can choose a set of cards as inputs to the next operation.

### 4.4 Reduce

The user clicks **Reduce**.

The system sends the selected cards to Gemini and asks it to produce a high-signal synthesis.

The synthesis should not merely summarize. It should preserve:

- the strongest shared claims,
- important disagreements,
- useful minority ideas,
- concrete next actions,
- and source attribution where helpful.

The synthesis card should appear immediately as a streaming card.

The selected cards should feel like they are collapsing into one higher-order artifact.

### 4.5 Provenance

Every reduced card must make its inputs visible.

A synthesis card should show:

```text
Reduced from:
- Builder · Card 2
- Skeptic · Card 3
- Wildcards · Card 4

Directive:
“Find the hackathon-winning version.”
```

Hovering or opening the card should highlight / link to parent cards.

This is not just decorative. Provenance is what makes the board feel like a work surface instead of a random note canvas.

### 4.6 Repeat

The synthesis card is just another card.

The user can expand it again:

```text
Synthesis → Expand → more lens cards → Reduce → better synthesis
```

This gives the product its recursive promise without needing to implement a complex recipe system.

---

## 5. What Makes It Different From Chat

A chatbot is linear.

Mixboard is spatial and transformational.

The board exposes operations:

```text
Expand = map
Reduce = compression
Provenance = lineage
```

The user does not just ask and receive. The user shapes the research process by selecting, recombining, compressing, and expanding.

The simplest comparison:

```text
Chat:
prompt → answer → follow-up → answer

Mixboard:
prompt → multiple lens cards → selected subset → synthesis card → expansion → synthesis
```

The board gives the user a way to think with AI outputs without drowning in them.

---

## 6. What Makes It a Generative UI Demo

The hackathon is about generative UI, but the goal is not to let the model generate an arbitrary UI kit.

The stronger framing:

> The UI is a work surface for AI-generated thought transformations.

Recommended framework roles:

### AG-UI

Use AG-UI-style events as the live event/state stream:

- run started,
- text deltas,
- state deltas,
- run finished,
- errors.

AG-UI proves that the app is not just a static form. It is a live streaming agent interaction surface.

### A2UI

Use A2UI selectively for side panels, generated inspectors, action panels, or provider outlet surfaces.

Do **not** let A2UI own the whole board.

The board should be deterministic React state. A2UI should enhance specific surfaces.

### Gemini

For hackathon speed, the app should call Gemini directly.

We are deliberately stripping out the Bitter CLI bridge and multi-provider council mechanics.

The goal is to get the map/reduce interaction working, then make it juicy.

---

## 7. Data Model

Keep the data model simple but honest.

Do not collapse everything to anonymous text blobs. The app needs just enough structure to preserve map/reduce lineage.

Recommended minimum:

```ts
type Card = {
  id: string
  kind: "seed" | "child" | "synthesis"

  title: string
  text: string

  directive?: string
  lensName?: string

  parentIds: string[]
  operationId?: string

  provider: "gemini"
  model: string

  status: "streaming" | "complete" | "error"

  createdAt: string
}

type Operation = {
  id: string
  kind: "expand" | "reduce"

  directive?: string

  inputCardIds: string[]
  outputCardIds: string[]

  lenses?: string[]

  status: "streaming" | "complete" | "error"

  createdAt: string
  completedAt?: string
}
```

Why keep `Operation`?

Because parent IDs alone are not enough for good provenance. An operation records:

- what the user did,
- what inputs were used,
- what directive shaped the call,
- what outputs were created,
- and which lenses/models were involved.

This is not the old Bitter/council architecture. It is just honest map/reduce state.

---

## 8. Gemini API Shape

For the hackathon version, use direct Gemini calls.

### `/api/expand`

Input:

```ts
{
  parentCardId: string
  parentText: string
  directive?: string
  lensCount?: number
}
```

Behavior:

- create one expand operation,
- create N child placeholder cards immediately,
- run N parallel Gemini streaming calls,
- one call per lens,
- multiplex all streams back to the client over one SSE response.

SSE frame shape:

```ts
type ExpandFrame =
  | {
      type: "start"
      opId: string
      cards: Array<{
        cardId: string
        lensIndex: number
        lensName: string
        model: string
      }>
    }
  | {
      type: "delta"
      opId: string
      cardId: string
      lensIndex: number
      text: string
    }
  | {
      type: "done"
      opId: string
      cardId: string
      lensIndex: number
    }
  | {
      type: "error"
      opId: string
      cardId?: string
      message: string
    }
```

### `/api/reduce`

Input:

```ts
{
  cardIds: string[]
  cardTexts: Array<{
    id: string
    title: string
    text: string
    lensName?: string
  }>
  directive?: string
}
```

Behavior:

- create one reduce operation,
- create one synthesis placeholder card immediately,
- stream Gemini output into it,
- preserve input card IDs and directive as provenance.

SSE frame shape:

```ts
type ReduceFrame =
  | {
      type: "start"
      opId: string
      cardId: string
      model: string
    }
  | {
      type: "delta"
      opId: string
      cardId: string
      text: string
    }
  | {
      type: "done"
      opId: string
      cardId: string
    }
  | {
      type: "error"
      opId: string
      cardId?: string
      message: string
    }
```

---

## 9. Prompting

### Expand Prompt Template

The expand prompt should combine:

- parent card text,
- user directive,
- lens instruction,
- output formatting guidance.

Example:

```text
You are one lens in a visual map/reduce AI research board.

Parent card:
{{parentText}}

User directive:
{{directive}}

Your lens:
{{lensName}}

Lens instruction:
{{lensInstruction}}

Produce a focused research card from this lens.
Be concrete.
Avoid generic filler.
Use headings and bullets where helpful.
End with 2-4 useful next questions or follow-up directions.
```

### Reduce Prompt Template

Example:

```text
You are reducing selected research cards into one high-signal synthesis card.

User directive:
{{directive}}

Selected cards:
{{cards}}

Your job:
- Identify the strongest shared claims.
- Preserve important disagreements.
- Keep useful minority ideas.
- Remove duplication.
- Produce a crisp synthesis that is better than any single input.
- Include concrete next actions where appropriate.
- Mention source lenses by name where that improves trust.
- Do not invent fake consensus.

Output:
- Title
- Synthesis
- Consensus
- Disagreements / tensions
- Recommended next step
```

---

## 10. UX Priorities

The product should feel good before it feels complete.

Hackathon priority is “juice.”

### Expand should feel like bloom

When the user clicks Expand:

- three child cards appear immediately,
- each has a clear lens badge,
- each streams text live,
- the parent-child relationship is visually obvious,
- the board feels like it is splitting a thought into perspectives.

### Reduce should feel like compression

When the user selects cards and clicks Reduce:

- selected cards subtly glow,
- a synthesis card appears immediately,
- text streams into it,
- parent provenance is visible,
- the relationship should feel like many-to-one compression.

### Provenance should feel tangible

On a synthesis card:

- show parent chips,
- show directive,
- show lens names,
- show model,
- hover should highlight parents if possible.

### Avoid overbuilding

Do not add during the hackathon unless the core loop is already polished:

- ranked voting,
- braid/cross-review,
- council language,
- multi-provider routing,
- recursive recipes,
- complex graph layout,
- Bitter CLI integration,
- autonomous loops.

---

## 11. Demo Script

The ideal demo is self-referential.

Prompt:

```text
What should we build to win this generative UI hackathon?
```

Click **Expand**.

Three streaming cards appear:

```text
Builder
Skeptic
Wildcards
```

The presenter says:

> “This is usually where AI research starts to sprawl. Instead of one answer, we deliberately expand into lenses.”

Select all three cards.

Click **Reduce**.

One synthesis card streams in.

The presenter says:

> “Now we compress the spread back into judgment. The synthesis preserves provenance, so you can see exactly what it reduced from.”

Then optionally expand the synthesis card again.

The presenter says:

> “The result is recursive. Any synthesis can become the seed for the next round.”

That is the whole story.

---

## 12. What We Are Deliberately Not Building Now

The future architecture may include:

- living provider threads,
- braid / cross-review,
- imported packets,
- local syntheses,
- ranked rapporteur election,
- clean-room reduce,
- capstone folding,
- multi-provider routing,
- Bitter CLI / BitterLog integration,
- reusable recipe graphs.

Those are valid future directions.

But for the hackathon, they are distractions unless the core map/reduce surface already feels great.

The winning version is:

```text
one prompt
three streaming lens cards
one reduction
beautiful provenance
```

---

## 13. Questions for Gemini

Please critique this concept with emphasis on hackathon execution.

Questions:

1. Is the core loop clear enough to demo in under two minutes?
2. Are the three default lenses right, or should they be changed?
3. What would make the Expand moment more visually impressive?
4. What would make the Reduce moment feel more satisfying?
5. How should provenance be shown without cluttering the board?
6. What are the biggest implementation risks in a Next.js / React / Gemini streaming app?
7. What should be cut if time gets tight?
8. What would make this feel like a strong generative UI hackathon entry rather than a generic AI canvas?
9. How can A2UI and AG-UI be used just enough to satisfy the theme without overcomplicating the build?
10. What is the shortest winning demo script?

---

## 14. Final Positioning

Mixboard is not a chatbot and not a generic card canvas.

It is a visual map/reduce surface for AI research.

It gives the user two powerful operations:

```text
Expand: split an idea into useful perspectives.
Reduce: compress selected perspectives into judgment.
```

The hackathon build should make those two operations feel immediate, visual, and inevitable.
