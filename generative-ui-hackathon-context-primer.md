---
title: "Generative UI Hackathon Context Primer"
status: "initial repo context"
last_reviewed: "2026-05-07"
use_when: "bootstrapping agents and humans for the Hong Kong AI Tinkerers Generative UI hackathon"
not_for: "production security design, final protocol claims, or legal/compliance guidance"
---

# Generative UI Hackathon Context Primer

This file is meant to be dropped into the repo before the hackathon starts. Its job is to keep humans and coding agents from wasting the first two hours rediscovering the shape of the stack.

The short version:

```text
AG-UI      = runtime/event spine between agent backend and frontend
A2UI       = declarative UI payload format agents can emit
CopilotKit = pragmatic React/Next.js bridge for AG-UI + generative UI
MCP Apps   = open-ended iframe/app surface returned from MCP tools
Bitter lens = UI is projection; work surface + evidence + receipt is truth
```

The hackathon is nominally about Generative UI. The deeper opportunity is to show that generated UI is not just a prettier chatbot response. The strongest demo should make the interface change because the agent is doing real work: inspecting state, proposing actions, asking for approval, executing bounded methods, and leaving receipts.

---

## 1. Source map

Read these first. Prefer official docs and repo code over blog posts.

### AG-UI

- Docs overview: <https://docs.ag-ui.com/introduction>
- GitHub repo: <https://github.com/ag-ui-protocol/ag-ui>
- Events concept: <https://docs.ag-ui.com/concepts/events>
- State concept: <https://docs.ag-ui.com/concepts/state>
- Tools concept: <https://docs.ag-ui.com/concepts/tools>
- Interrupts concept: <https://docs.ag-ui.com/concepts/interrupts>
- Serialization concept: <https://docs.ag-ui.com/concepts/serialization>
- Capabilities concept: <https://docs.ag-ui.com/concepts/capabilities>
- TypeScript core overview: <https://docs.ag-ui.com/sdk/js/core/overview>
- App quickstart: <https://docs.ag-ui.com/quickstart/applications>
- Code path worth reading: `sdks/typescript/packages/core/src/events.ts`
- Code path worth reading: `sdks/typescript/packages/core/src/types.ts`

### A2UI

- Docs home: <https://a2ui.org/>
- GitHub repo: <https://github.com/google/A2UI>
- A2UI with AG-UI guide: <https://a2ui.org/guides/a2ui-with-any-agent-framework/>
- v0.8 protocol spec: <https://github.com/google/A2UI/blob/main/specification/v0_8/docs/a2ui_protocol.md>
- Agent SDK guide: <https://github.com/google/A2UI/blob/main/agent_sdks/agent_sdk_guide.md>
- Composer/playground: linked from the A2UI homepage.

### CopilotKit

- GitHub repo: <https://github.com/CopilotKit/CopilotKit>
- Generative UI examples repo: <https://github.com/CopilotKit/generative-ui>
- CopilotKit docs: <https://docs.copilotkit.ai/>

### MCP Apps

- Official MCP Apps overview: <https://modelcontextprotocol.io/extensions/apps/overview>
- Build an MCP App: <https://modelcontextprotocol.io/extensions/apps/build>
- Official repo: <https://github.com/modelcontextprotocol/ext-apps>
- MCP-UI docs: <https://mcpui.dev/guide/introduction>

---

## 2. Recommended repo bootstrap

Use this if starting from nothing. Do not over-engineer the first commit. The goal is to have a running app, one agent endpoint, one visible UI surface, and this primer in the repo.

```bash
# Option A: use the AG-UI scaffold first
npx create-ag-ui-app@latest generative-ui-hackathon
cd generative-ui-hackathon
npm run dev
```

AG-UI’s own quickstart says `npx create-ag-ui-app@latest`, then `npm run dev`. If the scaffold gives you a CopilotKit example, start there and keep it running before adding A2UI or MCP Apps.

If the scaffold is too opinionated or flaky, use a plain Next.js app:

```bash
# Option B: controlled Next.js baseline
npx create-next-app@latest generative-ui-hackathon \
  --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
cd generative-ui-hackathon

# CopilotKit is the fastest bridge for a visible React app.
npx copilotkit@latest init

# Core packages that are likely to be useful.
npm install @ag-ui/core @ag-ui/client zod
npm install @copilotkit/runtime @copilotkit/react-core @copilotkit/a2ui-renderer
```

Notes:

- Do not hard-pin versions in the primer. Let the team install latest at the start of the weekend, then commit the lockfile.
- Keep the first backend agent intentionally dumb: echo events, stream text, mutate shared state, call one fake tool, ask for one approval.
- The first milestone is not “cool demo.” It is “we can see AG-UI events, state updates, and a rendered UI surface end-to-end.”

Suggested first files:

```text
README.md
AGENTS.md
CONTEXT_PRIMER.md   # this file, or rename to docs/context/generative-ui-primer.md
src/app/page.tsx
src/app/api/copilotkit/route.ts
src/lib/work-surface/schema.ts
src/lib/work-surface/examples.ts
src/lib/a2ui/catalog.tsx
src/lib/agui/events.ts
```

Suggested first `AGENTS.md` instruction:

```md
# Agent Instructions

You are working on a Generative UI hackathon project. Read `CONTEXT_PRIMER.md` first.

Default architecture:
- AG-UI is the runtime/event spine.
- A2UI is one declarative renderer target.
- MCP Apps are an open-ended iframe/app target.
- The canonical project object is a work surface: intent, state, methods, evidence, approval, receipt, next action.

Do not make UI the source of truth. Treat UI as a projection of work state.

First working milestone:
1. Render a chat/agent app.
2. Stream AG-UI events.
3. Maintain shared state.
4. Render one generated/declarative UI surface.
5. Ask for approval before a fake side-effecting action.
6. Append a receipt after the approved action.
```

---

## 3. Mental model of the stack

### 3.1 AG-UI: event spine

AG-UI is an open, event-based protocol for connecting user-facing frontends to agentic backends. It is explicitly positioned as the Agent ↔ User Interaction layer, while MCP is Agent ↔ Tools/Data and A2A is Agent ↔ Agent.

AG-UI’s important primitives:

```text
RunAgentInput
Message
Context
Tool
State
BaseEvent
```

The event stream is the key abstraction. Important event families:

```text
RUN_STARTED / RUN_FINISHED / RUN_ERROR
STEP_STARTED / STEP_FINISHED
TEXT_MESSAGE_START / TEXT_MESSAGE_CONTENT / TEXT_MESSAGE_END
TOOL_CALL_START / TOOL_CALL_ARGS / TOOL_CALL_END / TOOL_CALL_RESULT
STATE_SNAPSHOT / STATE_DELTA
MESSAGES_SNAPSHOT
ACTIVITY_SNAPSHOT / ACTIVITY_DELTA
REASONING_*
RAW
CUSTOM
```

Code-level notes from the TypeScript core:

- `BaseEventSchema` is a Zod object with `type`, optional `timestamp`, optional `rawEvent`, and `.passthrough()`. That means standard events may carry extra fields without failing validation.
- `StateSchema = z.any()`. State is intentionally open-ended.
- `RunAgentInputSchema` includes `threadId`, `runId`, optional `parentRunId`, arbitrary `state`, `messages`, `tools`, `context`, `forwardedProps`, and optional `resume`.
- `ToolSchema` has `name`, `description`, `parameters`, and optional arbitrary `metadata`.
- `InterruptSchema` has `id`, `reason`, optional `message`, optional `toolCallId`, optional `responseSchema`, optional `expiresAt`, and optional `metadata`.
- `CUSTOM` events carry `name` and arbitrary `value`.

Why this matters for the hackathon: AG-UI can carry more than chat. It can carry state, activity, tool calls, approvals, and custom events. Use that.

### 3.2 A2UI: declarative UI payload

A2UI lets agents “speak UI” by sending declarative JSON that a client renders using trusted native components. It is designed to avoid arbitrary code execution: agents can only request components from a catalog the client supports.

Core flow:

```text
user asks agent
agent emits A2UI messages
client buffers component/data updates
agent sends beginRendering
client renders native components
user acts
client sends userAction back
agent emits updates
```

Important A2UI messages:

```text
surfaceUpdate      # defines/updates component instances
dataModelUpdate    # updates bound data
beginRendering     # tells client which root to render
deleteSurface      # removes a surface
userAction         # client -> server action payload
```

A2UI’s component model is intentionally flat. Components have IDs; parent/child relationships are reconstructed by ID references. This adjacency-list model lets components stream in any order, as long as everything needed exists by `beginRendering`.

Catalogs are the trust boundary:

```text
catalogId
component definitions
component prop schemas
styles
renderer mapping
```

A2UI’s own docs recommend giving the LLM a resolved schema that includes the target catalog. The Agent SDK guide also says SDKs generate prompts by injecting schemas and few-shot examples, parse tagged `<a2ui-json>` blocks, try to fix common formatting errors, and validate payloads.

This is both useful and a warning: A2UI is powerful, but generation quality depends on prompt/schema/examples. Do not make the model invent huge bespoke UI trees under time pressure unless you have examples and validation.

### 3.3 CopilotKit: pragmatic React bridge

CopilotKit is the shortest path to visible generative UI in a React/Next.js app. Its own README positions it as a frontend stack for agents, generative UI, shared state, and human-in-the-loop workflows.

Practical hooks/patterns likely relevant:

```text
CopilotKitProvider
CopilotSidebar
useAgent
useCoAgent
useFrontendTool / useCopilotAction style patterns
renderActivityMessages
createA2UIMessageRenderer
CopilotRuntime
BuiltInAgent
MCPAppsMiddleware
```

Use CopilotKit if the team wants to show something this weekend. Use raw AG-UI only if the team specifically wants to demonstrate protocol-level mastery.

### 3.4 MCP Apps: open-ended iframe/app surface

MCP Apps extend MCP so tools can return interactive UI resources. A tool declares a `ui://` resource in metadata; the host fetches the resource and renders it in a sandboxed iframe. The app communicates with the host through a postMessage/JSON-RPC style bridge and can call MCP tools subject to host permissions.

Use MCP Apps when:

- You need a rich editor/canvas/viewer.
- A2UI’s component catalog is too constrained.
- You can accept iframe/web-specific tradeoffs.
- You want to demonstrate “app inside the agent conversation.”

Do not use MCP Apps for the core work-state truth. Treat the iframe as another projection.

---

## 4. The Bitter-pilled architecture stance

The hackathon will tempt teams into this architecture:

```text
chat prompt -> agent emits UI -> user clicks UI -> agent replies
```

That is fine, but shallow.

A stronger architecture:

```text
operator intent
  -> work surface
  -> state + methods + evidence
  -> generated projection
  -> approval interrupt
  -> bounded method call
  -> receipt
  -> next action
```

The central object should not be a chat message or UI tree. It should be a work surface.

```ts
type WorkSurface = {
  schema: "hackathon.work_surface.v0";

  intent: {
    id: string;
    summary: string;
    raw_user_message?: string;
    constraints: string[];
  };

  run: {
    thread_id: string;
    run_id: string;
    parent_run_id?: string;
    status: "idle" | "running" | "waiting_for_approval" | "done" | "error";
  };

  state: Record<string, unknown>;

  methods: Array<{
    id: string;
    label: string;
    description: string;
    parameters_schema: Record<string, unknown>;
    side_effects: string[];
    requires_approval: boolean;
    expected_receipt_schema: string;
  }>;

  evidence: Array<{
    id: string;
    kind: string;
    summary: string;
    source?: string;
    created_at: string;
  }>;

  approvals: Array<{
    id: string;
    method_id: string;
    status: "pending" | "approved" | "rejected";
    prompt: string;
  }>;

  receipts: Array<{
    id: string;
    method_id: string;
    status: "succeeded" | "failed" | "cancelled";
    summary: string;
    artifacts?: string[];
    created_at: string;
  }>;

  next_actions: Array<{
    id: string;
    label: string;
    method_id?: string;
    reason: string;
  }>;

  projections: {
    a2ui_surface_ids?: string[];
    mcp_app_resource_uris?: string[];
    markdown_summary?: string;
  };
};
```

AG-UI should stream this work surface. A2UI should render parts of it. MCP Apps can render rich canvases. The work surface remains the canonical context.

---

## 5. Target “hello world”

Build this before any ambitious domain demo.

### User story

> “Prepare a launch checklist for a tiny SaaS property. Show what you know, ask before the fake deploy, and leave a receipt.”

### UI should show four rails

```text
Intent rail       What did the operator ask for?
Evidence rail     What has the agent inspected or established?
Action rail       What method is proposed, with side effects and approval?
Receipt rail      What happened after approval?
```

### Event flow

```text
1. RUN_STARTED
2. STATE_SNAPSHOT with empty WorkSurface
3. TEXT_MESSAGE_* saying the agent is preparing the surface
4. STEP_STARTED "collect_context"
5. ACTIVITY_DELTA "Checking repo assumptions..."
6. STATE_DELTA add evidence item
7. STEP_FINISHED "collect_context"
8. STATE_DELTA add proposed method fake.deploy_preview
9. A2UI surface renders approval card/checklist
10. RUN_FINISHED outcome interrupt asking for approval
11. User resumes with approval payload
12. TOOL_CALL_START fake.deploy_preview
13. TOOL_CALL_RESULT success
14. CUSTOM "receipt.created"
15. STATE_DELTA append receipt and next action
16. RUN_FINISHED success
```

This demonstrates the frameworks better than a static generated dashboard because it uses runtime state, generated projection, human-in-the-loop, tool/action lifecycle, and durable-looking output.

---

## 6. Implementation patterns

### Pattern A: controlled AG-UI component rendering

Best for speed and reliability.

- Prebuild React components.
- Register frontend tools/actions.
- Agent chooses which tool/component to invoke.
- Render progress, result, and error states.

Use when the demo needs to work no matter what.

Example tool metadata idea:

```ts
const approveLaunchTool = {
  name: "approve_launch_action",
  description: "Ask the operator to approve a proposed side-effecting launch action.",
  parameters: {
    type: "object",
    properties: {
      action_id: { type: "string" },
      summary: { type: "string" },
      side_effects: { type: "array", items: { type: "string" } },
    },
    required: ["action_id", "summary", "side_effects"],
  },
  metadata: {
    work_surface: {
      requires_receipt: true,
      approval_kind: "operator_explicit",
    },
  },
};
```

### Pattern B: A2UI declarative cards/forms

Best for showing the actual A2UI premise.

- Keep the catalog small.
- Use basic components first: Text, Card, Button, Row/Column/List, inputs if supported.
- Give the agent one or two known-good examples.
- Validate output.
- Avoid asking the LLM to invent a huge custom design system live.

A2UI output shape to keep in the prompt:

```jsonl
{"surfaceUpdate":{"surfaceId":"launch-surface","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","approve_card"]}}}}]}}
{"surfaceUpdate":{"surfaceId":"launch-surface","components":[{"id":"title","component":{"Text":{"text":{"literalString":"Launch approval"}}}}]}}
{"dataModelUpdate":{"surfaceId":"launch-surface","contents":{}}}
{"beginRendering":{"surfaceId":"launch-surface","root":"root"}}
```

### Pattern C: MCP App for rich canvas

Best for wow factor.

- Use when the demo involves a diagram, map, editor, simulation, or dashboard too rich for A2UI.
- Keep the MCP App bounded: it displays or edits a specific artifact.
- Do not put core truth only inside iframe state.
- Make the iframe write back to the work surface through events/tool calls.

Possible MCP App demo surfaces:

```text
launch plan graph
vendor comparison board
agent work timeline
interactive evidence map
receipt explorer
```

---

## 7. Design rules for the hackathon

### Rule 1: State before surface

Before building UI, define the state object the UI is projecting.

Good:

```text
WorkSurface.evidence[0].summary -> EvidenceCard
WorkSurface.approvals[0] -> ApprovalPanel
WorkSurface.receipts[0] -> ReceiptCard
```

Bad:

```text
Agent emits arbitrary card with pretty text and a button.
```

### Rule 2: Every button should correspond to a method or state transition

A button should not just say “Continue.” It should map to something inspectable:

```text
method_id
parameters
side effects
approval requirement
receipt expectation
```

### Rule 3: Activity is not truth

Use `ACTIVITY_*` for progress UX. Put durable facts in `STATE_*`, artifacts, evidence, or receipts.

### Rule 4: Generated UI should be constrained

Give the model a narrow catalog and examples. Let humans/agents iterate inside known rails.

### Rule 5: Interrupts are stronger than fake confirmation dialogs

If possible, use AG-UI’s interrupt/resume lifecycle for human approval. A modal button is UI. An interrupt is protocol-level control flow.

### Rule 6: Custom events are your escape hatch

Use `CUSTOM` events for hackathon-specific events:

```json
{
  "type": "CUSTOM",
  "name": "work_surface.evidence.attached",
  "value": {
    "evidence_id": "ev_repo_001",
    "summary": "Repo initialized and dev server running"
  }
}
```

### Rule 7: Do not leak secrets into shared state

AG-UI shared state is designed to be visible to frontend and agent. Do not store secrets, credentials, raw tokens, or private data there.

---

## 8. Known limits and risk areas

### A2UI limits

- A2UI is still evolving. The docs currently present v0.8 as stable and v0.9 as draft.
- The model needs catalog schemas and examples to generate reliable payloads.
- The Agent SDK guide explicitly includes payload fixing and validation, which means malformed model output is expected in practice.
- Catalog versioning matters. If the agent and client disagree on catalog shape, generated UI can fail.
- A2UI is not the place for arbitrary rich web apps. Use MCP Apps or custom iframe rendering for that.

### AG-UI limits

- AG-UI standardizes events and state flow; it is not itself an authorization system.
- Capability discovery is “discovery only,” optional, dynamic, and not negotiation. Do not treat declared capabilities as enforcement.
- Filtering or rendering events is not the same as blocking upstream tool execution. Enforce dangerous actions in the backend/runtime.
- `state: any` is powerful but easy to abuse. Define a local schema.
- Cancellation semantics depend on the backend/transport implementation. Do not assume UI detach means backend execution stopped.

### CopilotKit limits

- Fastest path, but it can hide protocol details. Keep an event log panel or dev console visible if the demo is about protocol mastery.
- Docs are moving quickly. Prefer installed examples and source code once the scaffold is created.

### MCP Apps limits

- Iframes are powerful but can become “just a web app in chat.” Make the app part of a larger work surface.
- Host support varies.
- Security model depends on sandbox, CSP, permissions, and host mediation.

---

## 9. Concrete demo ideas ranked by risk

### 9.1 Low risk: Launch Approval Workbench

User asks to prepare a launch. Agent creates a checklist, evidence cards, one fake deployment action, asks approval, writes receipt.

Why it fits:

- Shows AG-UI state, activity, tools, interrupts.
- A2UI can render approval/checklist cards.
- Easy to fake side effects honestly.
- Strong Bitter story.

### 9.2 Medium risk: Procurement Decision Surface

User asks to choose a vendor or purchase option. Agent compares options, cites evidence, asks approval, generates receipt.

Why it fits:

- Real-world workflow.
- Natural tables/cards/forms.
- Approval and evidence matter.

### 9.3 Medium risk: CRM Next Action Cockpit

User asks what to do with a lead/opportunity. Agent renders account summary, next actions, draft email, approval before send, receipt after action.

Why it fits:

- Commercially legible.
- Easy for judges to understand.
- Could compete with CRM-oriented teams.

### 9.4 Higher risk: Agent Work Timeline / Run Inspector

Use AG-UI to visualize an agent run itself: steps, events, state deltas, tool calls, approvals, receipts.

Why it fits:

- Most protocol-native.
- Strong “Bitter as work surface” positioning.
- Less obvious consumer use case unless framed well.

### 9.5 Highest risk: MCP App Rich Canvas

Agent generates an interactive diagram/editor/simulation inside an MCP App, synchronized back to the work surface.

Why it fits:

- Highest visual wow.
- More moving pieces.
- Can consume the whole weekend if not tightly scoped.

---

## 10. Suggested architecture for the first commit

```text
Browser / React / Next.js
  CopilotKitProvider
    Chat or custom workbench UI
    Event log panel
    WorkSurface projection panel
    A2UI renderer panel

Next.js API route
  CopilotRuntime or simple AG-UI-compatible endpoint
  Tiny agent loop
  Fake tools/methods
  Emits AG-UI events

Local schema
  WorkSurface zod schema
  MethodDescriptor schema
  Evidence schema
  Receipt schema

Optional
  MCP App iframe proof only after core loop works
```

A very small fake agent is acceptable. The point is not model cleverness. The point is runtime interaction.

---

## 11. Prompt seed for the agent

Use this as the initial system/developer prompt for the hackathon agent.

```text
You are a Generative UI workbench agent.

Your job is not merely to chat. Your job is to maintain a work surface:
- intent
- current state
- proposed methods
- evidence
- approvals
- receipts
- next actions

Use AG-UI state updates to keep the frontend synchronized.
Use activity events for progress, not durable truth.
Use A2UI only to render clear UI projections of the work surface.
Before any side-effecting action, ask for operator approval.
After an action, append a receipt.
Never put secrets in shared state.
Keep generated UI small, valid, and based on known examples.
```

If using A2UI, add:

```text
When emitting A2UI, use JSONL message envelopes only.
Prefer these envelopes:
- surfaceUpdate
- dataModelUpdate
- beginRendering
Keep component trees shallow.
Use the provided catalog only.
Do not invent component names.
Do not include markdown fences inside A2UI JSON.
```

---

## 12. Judging narrative

Use this pitch shape:

```text
Most generative UI demos stop at “the agent made a card.”
We wanted to push the protocols toward real collaborative work.

AG-UI gives us the event/state spine.
A2UI gives us declarative, trusted UI projection.
MCP Apps can provide richer canvases when needed.

But the canonical object in our app is the work surface:
intent, evidence, method, approval, receipt, next action.

The UI is generated because the work demands it.
The human stays in control because side effects require approval.
The session compounds because every action leaves a receipt.
```

One-line version:

```text
Generated UI should not just display agent output; it should let humans safely operate agent work.
```

---

## 13. Open questions for the team

Answer these before building anything ambitious:

1. Are we building with the scaffold (`create-ag-ui-app`) or a controlled Next.js + CopilotKit setup?
2. Do we want A2UI visible in the demo, or is AG-UI controlled UI enough?
3. What is the concrete domain? Launch, procurement, CRM, testing, or run inspector?
4. What is the one side-effecting method we will fake or safely execute?
5. What is the receipt object?
6. What is the approval moment?
7. What can be mocked without weakening the demo?
8. What is the fallback if A2UI generation is unreliable?
9. What is the simplest screen that proves the idea?
10. What will judges remember in one sentence?

---

## 14. Fallback plan

If the frameworks fight back, ship this:

- A CopilotKit chat/workbench.
- A local WorkSurface JSON object rendered in React.
- AG-UI-like event log displayed in the UI.
- One frontend tool that renders a custom approval card.
- One fake backend method that appends a receipt.
- Optional A2UI sample rendered from a hardcoded valid payload.

This still tells the right story. Do not lose the weekend trying to make arbitrary generated UI perfect.

---

## 15. Working definition of success

The demo succeeds if a judge can say:

> “I see why this could not just be a chatbot. The UI changes as the agent works, the human has control at the approval point, and the final state records what happened.”

That is the bar.

