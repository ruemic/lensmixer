---
title: "Generative UI Global Hackathon — Hong Kong Context Primer"
date: 2026-05-07
event_date: 2026-05-09
timezone: Asia/Hong_Kong
status: "repo context primer"
scope: "Hackathon facts, constraints, public team intel, judging implications, and build strategy"
primary_sources:
  - https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM
  - https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams
  - https://sf.aitinkerers.org/p/generative-ui-global-hackathon-agentic-interfaces-sf
  - https://luma.com/29s9hkqd
---

# Generative UI Global Hackathon — Hong Kong Context Primer

This document captures the relevant public context for the **Generative UI Global Hackathon: Agentic Interfaces** in Hong Kong, plus strategic interpretation for a team building around **A2UI**, **AG-UI**, **CopilotKit**, **MCP Apps**, and a more custody-oriented / Bitter-style work-surface architecture.

Use this as the repo's first context packet for humans and agents before choosing the project.

## Read this first

The hackathon is explicitly not about making a prettier chatbot. The stated mission is to build an AI application where the agent generates interactive UI at runtime: forms, dashboards, approval flows, or whole applications generated natively from agent output.

The key test from the handbook is:

> Would this have been impossible with a chat interface?

So the right build target is not "chat plus cards." It is an interface where the agent creates or updates the actual control surface needed to complete work.

## Event facts

| Field | Current public information |
|---|---|
| Event | Generative UI Global Hackathon: Agentic Interfaces |
| Local city | Hong Kong |
| Date | Saturday, May 9, 2026 |
| Format | Synchronized global six-hour build session across AI Tinkerers cities |
| Local timezone | HKT / Asia-Hong_Kong |
| Presented by | AI Tinkerers, Google DeepMind, and CopilotKit |
| Local partners/sponsors listed | ASPIRE HOUSE, Regal Hotels, One Earth Alliance (OEA), Google Developer Group Cloud Hong Kong, Google Developer Group Hong Kong, Hack the East, HKU Data Science Association |
| Stack named by local page | A2UI, AG-UI, CopilotKit, MCP Apps |
| Status of prizes on Hong Kong page | Global prizes administered at global level; local page says more details to come |
| Additional global prize signal from SF / virtual pages | Mac Minis for winning team, Meta Ray-Ban glasses for runners-up |
| Results announcement | Friday, May 15, 2026 |
| Primary Hong Kong portal | https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM |

## Schedule

The Hong Kong page gives this detailed schedule:

| Time HKT | Activity |
|---:|---|
| 12:00–12:30 PM | Doors open; check-in, lunch, team formation |
| 12:30–1:00 PM | Global kickoff video; generative UI primer, stack tour, tracks |
| 1:00–5:00 PM | Build session; starter kits, credits, and mentors available |
| 5:00–5:45 PM | Show and tell; 2–3 minute demos, working code only |
| 5:45–6:00 PM | Submit projects to the global platform |
| 6:00 PM | Wrap |

Important deadline caveat: the portal's "Key Deadlines" block appears to list **Submission at 5:30 PM HKT**, while the schedule and handbook say submit by **6:00 PM local**. Treat **5:30 PM HKT** as the safe internal cutoff and **6:00 PM HKT** as the absolute external cutoff.

Recommended internal clock:

| Time HKT | Internal target |
|---:|---|
| 12:00 | Arrive, connect power/Wi-Fi, pull repo, verify keys |
| 12:30 | Listen for starter kits, credits, updated judging/prize info |
| 1:00 | Finalize project choice and division of labor |
| 2:00 | End architecture debate; demo path chosen |
| 3:00 | One vertical path working end-to-end, even ugly |
| 4:00 | Freeze scope; start demo polish |
| 4:45 | Record backup demo video if stable |
| 5:00 | Show-and-tell ready |
| 5:30 | Submission package ready |
| 5:45 | Submit if not already submitted |
| 6:00 | Absolute deadline / wrap |

## Tracks

The handbook names four challenge tracks. Teams may pick or remix them.

### 1. Kill the Dashboard

Agents generate the exact visualization, form, or control surface the user needs in the moment. No pre-built pages.

Good fit for:
- dynamic analytics
- one-off operational dashboards
- approval panels
- generated forms
- data exploration

### 2. The Copilot That Ships

Copilots do not just recommend. They render interactive UI for users to confirm, tweak, and execute inline.

Good fit for:
- launch/deploy workflows
- CRM next actions
- procurement approval
- marketing campaign editing
- code/test/QA flows

### 3. Agent App Store

MCP-powered apps where agents discover, compose, and present multi-tool experiences through generated UI.

Good fit for:
- MCP Apps
- composable tools
- agent-selected widgets
- app marketplace / plugin discovery
- multi-tool orchestration demos

### 4. No Designer, No Problem

The whole user-facing interface is generated at runtime. The agent is the frontend. The page calls this a moonshot.

Good fit for:
- ambitious demos
- runtime app generation
- generated multi-screen flows
- adaptive user interfaces

## Judging criteria

The public Hong Kong page says projects are evaluated globally after submissions close, focused on:

1. working code
2. originality
3. effective use of generative UI

The handbook reinforces:
- shipping beats polish
- no slide decks for show-and-tell
- show working code
- 2–3 minute demos
- if the idea works as a chatbot, it does not belong

Interpretation:

A strong demo should visibly prove all three:
- **working code**: user enters intent, agent emits UI/state/events, user interacts, system completes or records an action.
- **originality**: not another chatbot plus form; preferably shows a new interaction model.
- **effective generative UI**: the UI changes because of the agent's understanding of the task, not because a static dashboard was prebuilt.

## Submission requirements

A valid submission must include:

- Project name
- One-sentence pitch
- Short description of what was built and why it is generative UI, not a chatbot in a trench coat
- Public GitHub repo link
- 2–3 minute demo video link, such as Loom, YouTube, or direct upload
- List of protocols used: A2UI, AG-UI, CopilotKit, MCP Apps, other
- Team member names and roles

Recommended repo prep:

```text
README.md
docs/hackathon-context.md
docs/framework-context-primer.md
docs/demo-script.md
docs/submission.md
src/
```

Recommended `docs/submission.md` skeleton:

```markdown
# Submission Draft

## Project Name

## One-Sentence Pitch

## What We Built

## Why This Is Generative UI

## Protocols Used

- AG-UI:
- A2UI:
- CopilotKit:
- MCP Apps:
- Other:

## Public GitHub Repo

## Demo Video

## Team Members + Roles

## What Was Pre-Existing vs Built During the Six Hours
```

## Rules and constraints

Public rules from the handbook:

- In-person attendance is required at one of the participating cities.
- Teams may have up to 4 members.
- Solo teams are welcome.
- Teams own all IP created during the event.
- Pre-existing code is allowed, but teams must be transparent about what was built during the six hours.
- Judges weigh pre-existing code.
- Open-source tools, public APIs, and sponsor technologies are fair game.
- No recruiting pitches, product selling, or sponsor talks from the floor.
- Respect the focused nature of the event.
- Code of conduct: respect, professionalism, knowledge sharing, no harassment/discrimination/disruptive behavior, follow venue/organizer instructions.
- Photos/video may be captured for community/event media.

Practical interpretation:

- It is safe to create this repo ahead of time as a context/bootstrap repo.
- Be clear in the submission about what existed before 1 PM and what was built during the build window.
- A prebuilt primer, dependency scaffold, and hello-world integration are likely acceptable; the actual project/demo path should be built during the event.
- Do not try to win with strategy slides. Win with a working loop.

## Publicly visible teams

As of this primer, the teams page lists **6 teams**, all marked **Accepted**. Each individual team page shows:
- no project concept added yet
- entry status: Not Started
- team message board gated behind event registration

This means public project information is thin. The useful signal is the roster and background.

### Lok Lok

Source: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_Sz7d3m_9kdI

Public summary:
- Team lead: Lok Wong
- Business owner at EffectNode.com
- Creative developer, Webby/Anthem/Telly awards
- Three.js since 2014, WebGL/WebGPU, JavaScript
- Building a metaverse for humans and "open claw agents"
- Portfolio and EffectNode links listed

Likely strength:
- Best visual / creative / 3D demo risk.
- Could produce a memorable spatial or WebGPU-heavy agent interface.

Likely build direction:
- 3D/metaverse generative UI
- agent-generated spatial controls
- visual interface around agents/devices
- runtime-generated web effects

Competitive read:
- Highest "wow factor" risk.
- Probably less likely to emphasize operational custody, receipts, or evidence.
- If our demo is visually plain, the story has to be crisp and obviously more profound than visual spectacle.

### Team Pearl

Source: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_4FNzvXW4QV4

Public summary:
- Team lead: Gassyr Bakubay
- Applied AI and full-stack engineer at Pyramid AI
- Interested in Telegram-based agents, tool calling, Claude Code, CLI workflows
- Works on full-stack apps
- Currently working on a procurement solution for the construction industry
- Has done frontier LLM model testing and edtech freelance work

Likely strength:
- Agent/full-stack pragmatism.
- Tool-calling and CLI instincts.
- Procurement/construction is naturally workflow-heavy.

Likely build direction:
- procurement copilot
- construction quote/vendor comparison
- approval dashboard
- Telegram/agent bridge
- quote review workflow

Competitive read:
- Most likely to accidentally overlap with a Bitter-style work-surface idea, because procurement has vendors, documents, comparisons, approvals, and receipts.
- If they build procurement + approval flow well, they could be strong.
- Differentiation: do not merely generate approval cards; show method custody, evidence, side effects, and receipts.

### Polaris Gate

Source: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_G8ZM0BLmELg

Public summary:
- Team lead: Ginni Vishal
- Student at HKBU
- Founder/worker on NorthStar, an interview practice platform
- User pastes a job posting; system extracts requirements
- A voice agent runs tailored mock interviews
- System analyzes transcript and gives performance feedback

Likely strength:
- Clear vertical product.
- Voice + feedback + rubric naturally maps to multi-panel generated UI.

Likely build direction:
- generated interview coaching interface
- job-specific mock interview
- dynamic rubric and feedback UI
- voice-agent UI

Competitive read:
- Strong "useful app" potential.
- May be good at demonstrating why chat alone is insufficient: interview feedback wants generated scorecards, timelines, rubrics, and next-step coaching.
- Less likely to be protocol/system-layer differentiated.

### 0dates

Source: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_XXmIaJka0PE

Public summary:
- Team lead: Cedric Mutesa
- Software Engineer at Zenx
- HKUST AI student
- Background in software engineering and embedded systems
- Fine-tuning/pretraining/SFT/DAPT open-source models for Kinyarwanda
- Teammate: Dhairya Shah
- Embedded systems, hardware projects for human presence detection

Likely strength:
- ML/language + embedded systems + hardware.
- Unusual combination; could produce a distinctive demo.

Likely build direction:
- multilingual / low-resource language generative UI
- hardware/presence-aware interface
- generated sensor/control dashboard
- physical-world agent UI

Competitive read:
- Wildcard.
- If they connect real sensor state to generated UI, they could stand out.
- Public product signal is less clear than the CRM/procurement/interview teams.

### Testing

Source: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_mqMoNYw2D5c

Public summary:
- Team lead: Sam Chiu
- System Analyst at HKR International Ltd
- 4+ years full-stack development
- React.js, TypeScript
- GitHub Copilot Pro
- Public tagline: "How to not get fired"

Likely strength:
- Practical enterprise/full-stack build ability.
- React/TypeScript is directly useful for the event stack.

Likely build direction:
- QA/testing copilot
- internal enterprise workflow
- generated debug/test interface
- "how not to get fired" workplace assistant

Competitive read:
- Could be very practical if they pick testing or enterprise workflow.
- Potentially overlaps with BitterVerify if they build generated test/QA surfaces.
- Public information is thin.

### Signal Eight

Source: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_scPWgOBnnUw

Public summary:
- Team lead: Alexander Payne
- Founder at Signal Eight
- 15 years enterprise/strategic account leadership across FinTech and RegTech
- Bloomberg background leading GTM for AI-powered analytics/data products
- Building AI Native SaaS products and AI consulting/training
- Interested in CRM, GTM automation, B2B SaaS, AI-native productivity, novel human-AI interfaces, game mechanics
- Building an AI-native Sales CRM for solopreneurs and small teams
- Stack: Next.js, TypeScript, Tailwind, Supabase, Drizzle ORM, Vercel AI SDK, Clerk, Stripe, Vercel
- Uses OpenAI o3/Codex, Claude Code, Cursor, Windsurf

Likely strength:
- Best product/GTM story.
- Clear vertical product and commercial framing.
- Modern web stack aligned with hackathon build speed.

Likely build direction:
- sales CRM copilot
- generated pipeline view
- task/interaction logging
- dynamic CRM dashboard
- natural-language next actions
- game mechanics for workflow tools

Competitive read:
- Most likely to produce a polished, commercially legible product demo.
- Could win if judges reward usefulness and presentation.
- Likely weakness: may still be "chat-first SaaS with dynamic cards."
- Differentiation: show that our UI is not just a CRM card, but a live work surface with intent, methods, authority, evidence, approvals, receipts, and next actions.

## Organizers and local context

Organizer page source: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/organizers

Visible organizers include:

- Timothy Chau — Lead Organizer and AI Tinkerers Hong Kong Chapter Founder; marketing/media/community background; interested in emerging tech, ComfyUI, Stable Diffusion, TouchDesigner.
- Iulian Arcus — Senior Embedded Software Engineer; software safety, autonomous vehicles, embedded software; interested in local LLMs and privacy.
- William Gazeley — CTO at IRAI Labs; building AI for over a decade; crypto exchanges and AI researchers; "Google Search 2.0."
- Marcus Leiwe — Founder at Leiwe & Partners; data/AI consultancy; life sciences, health, fintech, crypto, bot detection, data science, ML, Python/SQL/MATLAB/data viz.
- Alexander Payne — also listed as organizer and Signal Eight team lead.

Strategic implications:
- Safety, local/privacy, data/AI consulting, visual/creative, and product/GTM perspectives may all be in the room.
- A demo that includes human oversight, action safety, and transparent evidence may resonate with the safety/local-LLM/privacy organizer context.
- A demo with crisp business usefulness may resonate with product/GTM participants.
- The event is builder-first; avoid overexplaining theory before showing the loop working.

## Judges, mentors, sponsors visibility

Public pages currently show:

- Judges: not registered or configured yet.
- Mentors: must be signed in participant to view.
- Sponsors page: thanks sponsors and mentions Regal Kowloon Hotel; sponsor representatives not registered or configured yet.
- Hong Kong homepage lists broader local sponsors/partners: ASPIRE HOUSE, Regal Hotels, OEA, GDG Cloud Hong Kong, GDG Hong Kong, Hack the East, HKU Data Science Association.

Open questions to resolve on event day:
- venue address / room
- local judges, if any
- actual global judging rubric if more detailed than public page
- exact submission cutoff: 5:30 vs 6:00 HKT
- sponsor credits and keys
- starter kit link
- whether the message center has additional boilerplate, tracks, or examples
- whether any track-specific prizes exist
- whether global prize information from SF/virtual pages applies to Hong Kong participants

## Relevant global context beyond Hong Kong page

Other public pages add useful context:

- The San Francisco page says the event is happening across 18 cities on 4 continents.
- The San Francisco page says builders will get an optional starter repo connecting the stack with relevant MCP servers and agent skills.
- The San Francisco page says the kickoff includes creators of A2UI, AG-UI, MCP Apps, Manufact, and LangChain walking through the generative UI spectrum.
- The San Francisco and virtual pages mention prizes: Mac Minis for the winning team, Meta Ray-Ban glasses for runners-up.
- The virtual Luma page says the hackathon includes AI Tinkerers, Google DeepMind, CopilotKit, Manufact, and LangChain, and that there are in-person hackathons happening simultaneously across 18 cities.

Treat Hong Kong's official page as primary for local timing/rules; treat SF/virtual pages as useful global context that may or may not be fully reflected in the Hong Kong portal.

## Framework stack relevance

This document is not the full framework primer. See the companion primer for deeper framework study. For hackathon planning, the relevant stack shape is:

### A2UI

Use when you need the agent to produce a declarative interactive UI payload that can be rendered by a trusted component catalog.

Hackathon meaning:
- good for generated forms/cards/approval panels
- good for "agent speaks UI"
- risky if the model is asked to invent complex UI dialects from scratch
- best treated as a projection layer, not canonical truth

Primary links:
- https://github.com/google/A2UI
- https://a2ui.org/

### AG-UI

Use as the event/state/interaction spine between agent runtime and frontend.

Hackathon meaning:
- good for streaming runs
- good for state updates
- good for tool calls
- good for interrupts / human-in-the-loop approval
- best place to carry live work-surface state

Primary links:
- https://github.com/ag-ui-protocol/ag-ui
- https://docs.ag-ui.com/

### CopilotKit

Use when you want the fastest React/Next integration path.

Hackathon meaning:
- probably best pragmatic frontend bridge
- can connect React app to agent runtime
- useful for quick demos and starter kits

Primary links:
- https://docs.copilotkit.ai/
- https://github.com/CopilotKit/CopilotKit

### MCP Apps / Apps SDK

Use when the interface should be an embedded app/tool surface discoverable or invoked by an agent, often via an iframe-like hosted widget model.

Hackathon meaning:
- good for "Agent App Store"
- good for composed tools/apps
- more open-ended than A2UI
- more deployment/sandbox/app-shell thinking

Primary links:
- https://developers.openai.com/apps-sdk
- https://modelcontextprotocol.io/

## Strategic project map

The room will probably produce many versions of:

```text
chat prompt -> generated card/form/dashboard -> user clicks -> agent responds
```

The stronger move is:

```text
operator intent -> live work surface -> generated UI projection -> approval interrupt -> governed method call -> evidence/receipt -> next action
```

The hackathon's own language gives permission to attack "chatbot in a trench coat." Use that. The pitch should be:

> Generative UI is not just the agent drawing widgets. It is the agent generating the right work surface for the moment: intent, evidence, controls, approval, execution, receipt, and next action.

## Candidate build directions

### Option A — Launch Workbench

One-sentence pitch:
> An agent turns a rough product launch intent into a live launch workbench: repo checks, domain/Stripe/deploy tasks, approval gates, and receipts.

Why it fits:
- strong "Copilot That Ships"
- concrete side-effecting workflow
- demonstrates approval and receipts
- maps to Bitter / Factory / launch-offer thinking
- not just a chatbot because the user needs editable controls, gates, evidence, and status rails

Demo flow:
1. User says: "Prepare a launch checklist for a tiny SaaS at example.com."
2. Agent creates a generated work surface:
   - intent rail
   - evidence rail
   - action rail
   - receipt rail
3. Agent checks mocked domain/repo/Stripe/deploy readiness.
4. UI updates dynamically with tasks and evidence.
5. Agent proposes a side-effecting action.
6. User approves via AG-UI interrupt / A2UI approval card.
7. System writes a receipt and updates next action.

Best if:
- you want to align with Bitter's future
- you can keep side effects mocked/deterministic
- you can demo "safe agent action" clearly in 2 minutes

### Option B — Procurement Approval Desk

One-sentence pitch:
> An agent turns messy vendor quotes into an interactive procurement approval desk with comparisons, risk flags, approvals, and purchase receipts.

Why it fits:
- strong "Kill the Dashboard" and "Copilot That Ships"
- close to real business pain
- naturally shows documents/evidence/approval
- could compete with Team Pearl territory but can go deeper

Demo flow:
1. User drops a purchase request / quotes.
2. Agent extracts vendors, price, delivery, risk, missing info.
3. UI renders comparison table/cards.
4. User adjusts weights or constraints.
5. Agent proposes vendor choice.
6. User approves.
7. Receipt records decision basis.

Best if:
- you want a non-Bitter-branded, broadly understandable vertical
- you want judges to immediately understand business value

### Option C — QA / Release Gate Work Surface

One-sentence pitch:
> An agent watches a release candidate and generates the exact QA control surface needed: failed checks, screenshots, logs, risk flags, approval, and release receipt.

Why it fits:
- concrete developer workflow
- good fit for AG-UI streaming and evidence
- naturally demoable
- maps to BitterVerify

Demo flow:
1. User asks if a build is ready to ship.
2. Agent inspects mocked test results / screenshots / logs.
3. UI generates status, failures, fix recommendations, approval gate.
4. User approves release or requests fix.
5. System writes receipt.

Best if:
- you want developer judges to appreciate it
- you can produce visible evidence quickly

### Option D — CRM Next-Action Cockpit

One-sentence pitch:
> An agent turns a messy customer conversation history into a generated CRM cockpit with next actions, editable follow-up, approval, and logged receipts.

Why it fits:
- commercially legible
- matches Signal Eight's likely territory
- easy to understand in 2 minutes

Risk:
- may look like "chat-first CRM with cards" unless the work-surface/receipt angle is strong.

## Recommended build stance

Build for one deep loop, not a broad product.

The minimum winning loop should have:

1. **Intent capture**
   - User asks for something operational.
   - System summarizes intent as a visible object.

2. **Generated work surface**
   - Agent generates or updates UI that did not exist beforehand.
   - UI is task-specific, not a static dashboard.

3. **Evidence attachment**
   - At least two pieces of evidence appear.
   - Example: repo check, quote comparison, screenshot, test result, domain status, extracted requirement.

4. **Approval gate**
   - A proposed action requires user confirmation.
   - Prefer AG-UI interrupt/resume semantics if feasible.

5. **Method call**
   - The action is represented as a typed method/tool call.
   - The UI shows side effects and parameters.

6. **Receipt**
   - The result is recorded visibly.
   - Receipt includes action, time, parameters, evidence, and result.

7. **Next action**
   - The UI does not just finish; it shows the next best step.

If these seven elements work, the project will feel more serious than generated widgets.

## Demo script template

```text
0:00 — Problem
"Most AI apps still answer in chat. But real work needs controls, evidence, approvals, and receipts."

0:20 — Intent
"I ask the agent to prepare X."

0:35 — Generated work surface
"Instead of replying with text, it generates the exact interface needed for this task."

0:55 — Evidence
"Notice the evidence rail: the agent inspected A and B, and the UI changed around those facts."

1:20 — Approval
"Before a side effect, it pauses and asks for explicit approval."

1:45 — Execution
"When I approve, the action runs as a typed method, not an arbitrary click."

2:05 — Receipt
"The result is recorded as a receipt with evidence and next action."

2:25 — Close
"This is why generative UI matters: the agent is not just drawing components. It is shaping a safe work surface for real action."
```

## Suggested repo structure

```text
.
├── README.md
├── docs/
│   ├── hackathon-context.md
│   ├── framework-context-primer.md
│   ├── architecture.md
│   ├── demo-script.md
│   └── submission.md
├── app/
│   ├── page.tsx
│   ├── api/
│   │   └── agent/
│   └── components/
├── lib/
│   ├── work-surface.ts
│   ├── events.ts
│   ├── tools.ts
│   └── receipts.ts
├── data/
│   ├── sample-intents/
│   ├── sample-evidence/
│   └── sample-receipts/
└── scripts/
    ├── smoke-test.sh
    └── record-demo-notes.md
```

## Decision prompts for agents

Use these prompts when delegating repo work:

### Project choice agent

```text
Given the hackathon constraints and team landscape in docs/hackathon-context.md, choose the strongest project concept for a 6-hour build. Optimize for working code, originality, and effective generative UI. Avoid chatbot-with-cards demos. Return one recommended concept, two backups, and a ruthless scope cut.
```

### Architecture agent

```text
Design the minimum architecture for a generative UI hackathon app using AG-UI as the event/state spine, A2UI as optional projection, and a typed work-surface object as canonical state. Keep it demoable in 6 hours. Return interfaces, file plan, and an end-to-end event flow.
```

### UI agent

```text
Design a 2-minute demo UI for a generated work surface. It must show intent, evidence, proposed action, approval gate, receipt, and next action. Favor clarity over visual polish. Return component layout, states, and copy.
```

### Integration agent

```text
Set up or verify the fastest working hello-world integration for AG-UI/CopilotKit/A2UI in this repo. Keep changes minimal. Add a smoke test and document exact run commands.
```

### Submission agent

```text
Prepare docs/submission.md and docs/demo-script.md from the current project. Ensure it answers why this is generative UI and not a chatbot in a trench coat. Keep the pitch tight and demo-focused.
```

## Risk register

| Risk | Why it matters | Mitigation |
|---|---|---|
| Framework setup consumes build time | The stack is new and moving | Preinstall dependencies and preserve a working hello-world before the event |
| A2UI schema generation gets brittle | Prompting a model to produce unfamiliar JSON can fail | Keep A2UI projections small and template-like; make canonical state separate |
| Demo becomes static dashboard | Judges are explicitly looking beyond dashboards/chat | Show agent-generated surface changes from task state |
| Too much Bitter theory | Hackathon judges need working code | Say "work surface" once; then show it |
| Side effects are unsafe/unreliable | Real deploy/DNS/Stripe can fail | Mock side-effecting methods but preserve typed method + receipt shape |
| Deadline ambiguity | Portal shows 5:30 and 6:00 in different places | Submit by 5:30 if possible |
| Team overlap | Signal Eight/Team Pearl may build similar verticals | Differentiate by custody/evidence/receipt, not vertical category |
| Visual spectacle competitor | Lok Lok may create a more visually impressive demo | Make the interaction model obviously deeper and safer |

## Sources

Primary Hong Kong event sources:
- Event homepage / handbook: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM
- Teams index: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams
- Lok Lok team page: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_Sz7d3m_9kdI
- Team Pearl team page: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_4FNzvXW4QV4
- Polaris Gate team page: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_G8ZM0BLmELg
- 0dates team page: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_XXmIaJka0PE
- Testing team page: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_mqMoNYw2D5c
- Signal Eight team page: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams/ht_scPWgOBnnUw
- Organizers: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/organizers
- Judges: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/judges
- Mentors: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/mentors
- Sponsors: https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/sponsors

Global context:
- San Francisco event page: https://sf.aitinkerers.org/p/generative-ui-global-hackathon-agentic-interfaces-sf
- Virtual Luma page: https://luma.com/29s9hkqd
- AI Tinkerers hackathons page: https://nyc.aitinkerers.org/hackathons

Framework references:
- A2UI repo: https://github.com/google/A2UI
- A2UI site: https://a2ui.org/
- AG-UI repo: https://github.com/ag-ui-protocol/ag-ui
- AG-UI docs: https://docs.ag-ui.com/
- CopilotKit docs: https://docs.copilotkit.ai/
- CopilotKit repo: https://github.com/CopilotKit/CopilotKit
- OpenAI Apps SDK: https://developers.openai.com/apps-sdk
- Model Context Protocol: https://modelcontextprotocol.io/
