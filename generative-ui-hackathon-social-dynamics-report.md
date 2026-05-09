---
title: "Generative UI Hackathon Social Dynamics Report"
date: 2026-05-07
scope: "Hong Kong Generative UI Global Hackathon: social game, incentives, key players, and strategic posture"
status: "research synthesis; public-source-only; inferential sections explicitly marked"
---

# Generative UI Hackathon Social Dynamics Report

This document is a social and strategic read of the **Generative UI Global Hackathon: Agentic Interfaces** in Hong Kong and the broader global event around **A2UI, AG-UI, CopilotKit, MCP Apps, Manufact, LangChain, and Daytona**.

It is not another technical primer. It asks:

- Why is this hackathon being hosted?
- What game is being played by each actor?
- Who are the live players?
- What social dynamics matter in the room?
- How should a builder use the event without becoming a passive participant in someone else’s protocol-adoption funnel?

## Executive read

This hackathon is simultaneously:

1. **A genuine builder event**: six hours, working code only, no slide decks, curated room, demo-first culture.
2. **A category-formation exercise**: make “Generative UI / Agentic Interfaces” feel like a real frontier category rather than a blog phrase.
3. **A protocol-distribution event**: get builders hands-on with A2UI, AG-UI, CopilotKit, MCP Apps, and related tooling.
4. **A social graph event**: identify high-signal builders, teams, demos, contributors, and future customers/partners.
5. **A standards-shaping event**: expose rough edges in young protocols by forcing them into live use.

The public event language says the quiet part pretty clearly. The event is framed as a synchronized global hackathon across cities, with one shared theme and one submission platform. The official handbook says the goals include learning one of the core protocols hands-on, trading patterns with other engineers, and submitting to a global winner pool. The page also says participants get direct contact with protocols sponsor companies are shipping right now.  
Source: <https://sf.aitinkerers.org/hackathons/h_FZX7ihFWcHA>

The deeper game: **the sponsors want a builder proof wave**. They need credible examples showing that agentic UI is not just “chatbot in a trench coat.” The builders need leverage, learning, social proof, and a chance to be early in a category. The organizers need to preserve room quality while giving sponsors access to real builders.

For Bitter: the opportunity is not to merely build a prettier generative UI demo. The opportunity is to show that **UI is a projection of work**, and that the missing layer is **intent → evidence → approval → action → receipt → next action**.

---

# 1. What is being hosted, exactly?

## Public framing

The Hong Kong event is a local node of a global hackathon held on **Saturday, May 9, 2026**, from **12:00 PM to 6:00 PM HKT**. The event page describes it as part of a global hackathon happening simultaneously across **18 cities on 4 continents**. It explicitly names **Google’s A2UI**, **CopilotKit’s AG-UI**, and **MCP Apps** as the frameworks in scope. It also says builders will be provided an optional starter repo with the relevant stack, MCP servers, and agent skills wired together.  
Source: <https://hong-kong.aitinkerers.org/p/generative-ui-global-hackathon-agentic-interfaces-hong-kong>

The global/virtual event page describes the same stack and notes that the hackathon will begin with a talk from the creators of A2UI, AG-UI, MCP Apps, Manufact, and LangChain. It lists prizes: **Mac Minis for the winning team** and **Meta Ray-Ban glasses for the runner-up team**.  
Source: <https://virtual-events.aitinkerers.org/p/the-generative-ui-hackathon-a2ui-ag-ui-mcp-apps>

The handbook’s strongest line is:

> “If your idea works as a chatbot, it does not belong here.”

And its central evaluation question is:

> “Would this have been impossible with a chat interface?”

Source: <https://sf.aitinkerers.org/hackathons/h_FZX7ihFWcHA>

## The stated event grammar

The public rules create a very particular room:

- **Six-hour build session**.
- **Working code only**.
- **No slide decks**.
- **Teams up to four**.
- **Pre-existing code allowed**, but transparency expected.
- **No recruiting pitches, product selling, or sponsor talks from the floor**.
- **Global results announced May 15**.

Source: <https://sf.aitinkerers.org/hackathons/h_FZX7ihFWcHA>

This means the event is not a startup pitch competition. But it is also not socially neutral. It is a builder filter.

The visible game is “ship a prototype.”  
The invisible game is “show that you are a serious builder worth knowing.”

---

# 2. Why this hackathon exists

## 2.1 The category needs proof

“Generative UI” is still a contested phrase. It can mean at least four things:

1. Agent selects a prebuilt component.
2. Agent sends declarative UI JSON.
3. Agent controls/updates live application state.
4. Agent serves an embedded app/tool UI through a host.

CopilotKit’s own generative-ui repository frames the space as a spectrum:

- **Controlled Generative UI**: AG-UI / prebuilt components.
- **Declarative Generative UI**: A2UI / Open-JSON-UI.
- **Open-ended Generative UI**: MCP Apps / custom UIs.

It also says AG-UI acts as the bidirectional runtime interaction layer beneath these patterns.  
Source: <https://github.com/CopilotKit/generative-ui>

That is category-shaping language. The hackathon gives the category artifacts: videos, repos, demos, winners, screenshots, stories, and bugs.

## 2.2 The protocols need embodied usage

A2UI’s Google Developers Blog post says Google has been building A2UI for some products and wants the community to help refine the specifications, add transports, and add client renderers/integrations.  
Source: <https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/>

That is an explicit community-adoption and feedback loop.

AG-UI’s repo says it is an open, lightweight, event-based protocol standardizing how agents connect to user-facing applications. It positions itself as complementary to MCP and A2A: MCP gives agents tools, A2A lets agents communicate with agents, AG-UI brings agents into user-facing applications.  
Source: <https://github.com/ag-ui-protocol/ag-ui>

MCP Apps is in a similar formative stage. The MCP blog says MCP Apps standardizes support for interactive UIs in MCP, building on MCP-UI and OpenAI Apps SDK patterns, and invites the community to review the spec, give feedback, and test prototype implementations.  
Source: <https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/>

The hackathon is therefore a controlled stress test. Protocol teams get:

- Real projects built under time pressure.
- Evidence of which abstractions are understandable.
- Examples for docs and marketing.
- Integration bugs.
- Potential contributors.
- Potential enterprise design partners.

## 2.3 The sponsors need distribution into builders’ heads

The global event page says sponsors include **Google DeepMind**, **CopilotKit**, **Manufact**, **LangChain**, and **Daytona**. It describes Google DeepMind as connected to A2UI, CopilotKit as the company behind AG-UI, Manufact as the platform behind mcp-use/MCP Apps, LangChain as agent/RAG orchestration infrastructure, and Daytona as infrastructure for dynamic code execution environments.  
Source: <https://virtual-events.aitinkerers.org/p/the-generative-ui-hackathon-a2ui-ag-ui-mcp-apps>

This is not accidental. These companies occupy adjacent layers of the emerging agentic application stack:

| Layer | Player | Incentive |
|---|---|---|
| Agent-driven declarative UI | Google / A2UI | Make A2UI a credible open protocol; get renderer/transporter feedback. |
| Agent ↔ app event/runtime layer | CopilotKit / AG-UI | Establish AG-UI as default frontend-agent protocol. |
| Embedded app/tool surface | MCP Apps / Manufact | Make MCP Apps the distribution surface for agent-hosted applets. |
| Agent orchestration | LangChain | Stay central in the app-building mental model. |
| Agent code execution / sandboxes | Daytona | Be the infra primitive behind dynamic code and agent execution. |
| Builder distribution | AI Tinkerers | Preserve a high-signal global community and attract sponsor support. |

The event makes this stack feel coherent.

## 2.4 The timing matters

CopilotKit announced a **$27M Series A** on May 5, 2026, four days before the hackathon. In that announcement, CopilotKit says AG-UI has been adopted by Google, Microsoft, Amazon, Oracle, LangChain, Mastra, Pydantic AI, Agno, AG2, LlamaIndex, and more; it also states the company is investing in “AG-UI as the standard.”  
Source: <https://www.copilotkit.ai/blog/series-a>

TechCrunch’s coverage says AG-UI standardizes how AI agents connect to user interfaces and provides streaming chat, front-end tool calls, state sharing, and human-in-the-loop functionality. The same article quotes CopilotKit’s open-source strategy: open source should be the best path for the 95% of users who can build without paying or talking to anyone, while the company monetizes top enterprises.  
Source: <https://techcrunch.com/2026/05/05/copilotkit-raises-27m-to-help-devs-deploy-app-native-ai-agents/>

That matters socially. This hackathon is not happening in a vacuum. It is part of a **standardization and distribution push**.

---

# 3. The game theory

## 3.1 The organizer game: preserve room quality, earn sponsor trust

AI Tinkerers describes itself as a curated room for people shipping real AI systems, with live demos, hackathons, and technical meetups across cities. The global site says it has **220 active cities**.  
Source: <https://aitinkerers.org/>

The Hong Kong chapter says it is a monthly meetup for AI engineers and builders, with live code demos, no slides, no pitches, no fluff, and screened attendees. It also says the community spans 220 cities with 104,000+ members.  
Source: <https://hong-kong.aitinkerers.org/>

The sponsor page states the sponsor value proposition plainly: AI Tinkerers gives technical partners direct access to curated rooms of engineers, founders, and researchers actively shipping AI systems, and “protects the room so sponsors meet real builders, not spectators.”  
Source: <https://hong-kong.aitinkerers.org/sponsors>

So the organizer’s game is:

- Keep the room high-signal.
- Do not let it become a vendor booth or recruiter mixer.
- Deliver sponsors access to builders without poisoning the builder vibe.
- Produce enough demos and recap artifacts to strengthen the chapter.
- Build chapter prestige through association with global sponsors.

This explains the “no slides, no pitches, working code only” posture. It protects the commons.

## 3.2 The sponsor game: make your protocol the default mental model

For protocol companies, the competition is not just product competition. It is **mental-model competition**.

A developer can only hold so many abstractions in their head. A hackathon compresses the learning loop:

1. Global kickoff tells builders the stack shape.
2. Starter repo wires the stack together.
3. Mentors answer questions in terms of sponsor abstractions.
4. Teams build with those abstractions.
5. Submissions list which protocols were used.
6. Winners become examples.
7. Examples become docs, blog posts, and sales artifacts.

This is how a protocol moves from “some GitHub repo” to “the obvious thing people reach for.”

CopilotKit’s public strategy is especially clear. Their Series A post says they support the full spectrum of agent-driven UI: controlled UI through AG-UI, declarative UI through Google’s A2UI, and open-ended UI through Anthropic’s MCP Apps. It says “All of them, in one stack.”  
Source: <https://www.copilotkit.ai/blog/series-a>

That is not merely technical architecture. It is positioning.

## 3.3 The participant game: signal, learn, partner, maybe win

Participants have several payoffs:

- Learn the stack fast.
- Get close to protocol creators/mentors.
- Win prizes or global recognition.
- Produce a public repo/demo artifact.
- Find collaborators.
- Get noticed by sponsor companies or local organizers.
- Pressure-test an idea under artificial deadline.

But the rules prohibit floor selling/recruiting, so the right social strategy is not to pitch aggressively. It is to **demonstrate taste through useful work**.

The best builder posture is:

> “I am here to build, help, and learn. My project also reveals a deeper product thesis.”

## 3.4 The judging game: validate the category

Judges will likely reward projects that make the core thesis undeniable:

> “This could not have been a normal chatbot.”

The handbook repeats this theme. It says shipping beats polish, but it also says the project must push past the chat bubble.  
Source: <https://sf.aitinkerers.org/hackathons/h_FZX7ihFWcHA>

That creates a scoring pressure:

- A project must work.
- It must visibly use generative UI.
- It must be explainable in 2–3 minutes.
- It must have a strong “why UI?” moment.
- It must make the sponsor frameworks look useful.

This is why a subtle backend architecture alone will not win. The proof has to appear on screen.

---

# 4. Key players and live players

“Live player” here means: an actor with agency, incentives, and the ability to change the game rather than merely attend it.

## 4.1 AI Tinkerers global

**Role:** network owner, room-quality guarantor, global coordination layer.  
**Incentive:** prove AI Tinkerers can mobilize high-quality builders globally on short notice; strengthen sponsor value; produce category-defining demos.  
**Power:** controls access, attention, legitimacy, distribution, recap channels, and event infrastructure.

Uli Barkai’s public LinkedIn post says this global hackathon across 15+ cities was only possible because AI Tinkerers has a scrappy, high-quality group of builders ready to gather on short notice. It also names AI Tinkerers’ Joe Heitzeberg and Jake Laes.  
Source: <https://www.linkedin.com/posts/ulib_i-cant-believe-we-actually-pulled-this-off-activity-7457154498013315072-Bxna>

## 4.2 AI Tinkerers Hong Kong / Timothy Chau

**Role:** local host, room shaper, community node.  
**Incentive:** make Hong Kong a credible AI builder hub inside a global event; strengthen local AI Tinkerers brand; connect builders, sponsors, and partners.  
**Power:** knows the room; controls local social graph; can introduce, amplify, invite, and contextualize.

The Hong Kong organizers page lists **Timothy Chau** as Lead Organizer and Chapter Founder of AI Tinkerers Hong Kong. His profile emphasizes marketing/community experience and genuine community-building.  
Source: <https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/organizers>

The AI Tinkerers Hong Kong LinkedIn post says the event is happening in Tsim Sha Tsui as part of a global event across 18 cities and 4 continents, with local sponsors and community partners including Aspire House, Regal Hotels, One Earth Alliance, GDG Cloud Hong Kong, GDG Hong Kong, HackTheEast, and the Data Science Association at HKU.  
Source: <https://www.linkedin.com/posts/activity-7457241647043584000-WTlA>

## 4.3 CopilotKit / AG-UI / Atai and Uli Barkai

**Role:** most commercially motivated protocol/company player.  
**Incentive:** establish AG-UI as the default agent-user interaction standard; distribute CopilotKit as the fastest implementation path; harvest demos, feedback, adoption, and enterprise leads.  
**Power:** starter kits, docs, protocol narrative, sponsor visibility, freshly raised funding, active ecosystem push.

CopilotKit’s Series A post frames AG-UI as the open protocol connecting AI agents to user-facing applications and says the company is investing in AG-UI as the standard.  
Source: <https://www.copilotkit.ai/blog/series-a>

The global hackathon page describes CopilotKit as the Agentic Frontend Stack and the company behind AG-UI, with React and Angular SDKs for building agentic applications using AG-UI, A2UI, and MCP Apps.  
Source: <https://virtual-events.aitinkerers.org/p/the-generative-ui-hackathon-a2ui-ag-ui-mcp-apps>

## 4.4 Google DeepMind / A2UI / Alan Blount

**Role:** legitimacy anchor and declarative UI protocol sponsor.  
**Incentive:** seed A2UI adoption, validate the schema/rendering approach, recruit feedback on transports/renderers/integrations, associate Google with an open agent-interface standard.  
**Power:** brand authority, Gemini credits, creator talk, protocol legitimacy.

The A2UI launch post says Google has been building A2UI for some products and wants to engage the community to refine specifications, add transports, and add renderers/integrations.  
Source: <https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/>

Uli Barkai’s post says the opening webinar will include **Alan Blount**, co-creator of A2UI.  
Source: <https://www.linkedin.com/posts/ulib_i-cant-believe-we-actually-pulled-this-off-activity-7457154498013315072-Bxna>

## 4.5 MCP Apps / Manufact / Ido & Liad

**Role:** open-ended UI and MCP-app distribution player.  
**Incentive:** show that rich UI belongs inside MCP tools/apps; drive builders toward MCP Apps and mcp-use/Manufact deployment; turn MCP app creation from arcane infra into hackathon-fast scaffolding.  
**Power:** official-ish MCP Apps ecosystem energy, YC credibility, starter templates, deployment story.

The MCP blog says MCP Apps standardizes UI resources linked to tools and bidirectional communication between embedded interfaces and hosts. It credits Ido Salomon and Liad Yosef through MCP-UI and the UI working group with incubating many patterns now standardized by MCP Apps.  
Source: <https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/>

Manufact’s YC profile says it provides open-source dev tools and cloud infrastructure for MCP Servers and ChatGPT Apps, with mcp-use SDK adoption metrics and a cloud deployment story.  
Source: <https://www.ycombinator.com/companies/manufact>

## 4.6 LangChain

**Role:** agent orchestration incumbent and ecosystem glue.  
**Incentive:** remain the recognizable agent-building framework as UI layers evolve; ensure LangChain remains part of the “build agents that do real things” stack.  
**Power:** developer mindshare, agents/RAG/tool-calling primitives, partner legitimacy.

The global event page lists LangChain as a global sponsor and frames it as a production LLM framework for orchestration, tool-calling, retrieval, memory, chains, and agents.  
Source: <https://virtual-events.aitinkerers.org/p/the-generative-ui-hackathon-a2ui-ag-ui-mcp-apps>

## 4.7 Daytona

**Role:** dynamic code execution / sandbox infrastructure.  
**Incentive:** associate itself with agent workflows that write/run code and require ephemeral execution environments.  
**Power:** useful when demos require safe execution, generated apps, dynamic previews, or sandboxed tools.

The global event page describes Daytona as infrastructure for running code dynamically: ephemeral environments that spin up, execute, and disappear.  
Source: <https://virtual-events.aitinkerers.org/p/the-generative-ui-hackathon-a2ui-ag-ui-mcp-apps>

## 4.8 Local sponsors and partners

Visible Hong Kong local sponsors/partners include **ASPIRE HOUSE**, **Regal Hotels**, **One Earth Alliance**, **GDG Cloud Hong Kong**, **GDG Hong Kong**, **HackTheEast**, and the **Data Science Association, HKU**.  
Source: <https://www.linkedin.com/posts/activity-7457241647043584000-WTlA>

Their likely incentives:

- Brand association with high-quality builders.
- Local ecosystem relevance.
- Community goodwill.
- Talent visibility.
- Venue/community activation.

The local sponsors are probably not deciding the technical direction, but they matter for local social graph and post-event relationships.

## 4.9 Visible teams

The public team list shows six accepted teams:

- **Lok Lok**: creative/3D/WebGPU/metaverse/OpenClaw profile.
- **Team Pearl**: RAG, agentic architecture, FastAPI, Telegram bot, applied AI.
- **Polaris Gate**: HKBU student/NorthStar founder, TypeScript/Python/RAG/voice agents.
- **0dates**: HKUST AI student / SWE + AWS Cloud Club lead, Rust, Kinyarwanda LLM fine-tuning, full-stack.
- **Testing**: enterprise full-stack React/Next.js/.NET profile.
- **Signal Eight**: AI-native CRM, enterprise GTM, Next.js/Supabase/Stripe/etc.

Source: <https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams>

No public team project descriptions were visible at research time. This means the competitive field is still underdetermined.

---

# 5. The hidden social map of the room

## 5.1 Builder caste signals

AI Tinkerers culture rewards:

- Live code.
- Technical specificity.
- Useful unfinished work.
- Clear taste.
- Helping others unblock.
- Real demos over claims.

It punishes:

- Pitching without shipping.
- Generic AI enthusiasm.
- Sales behavior.
- “Chatbot with a fancy skin.”
- Overbuilt architecture with no visible demo.

The Hong Kong chapter explicitly says its demos must show running code and that “no slides” is part of the culture.  
Source: <https://hong-kong.aitinkerers.org/>

## 5.2 Sponsor attention dynamics

Sponsors will pay attention to teams that:

- Use their framework in a nontrivial way.
- Find good bugs or gaps.
- Produce a demo that could become a case study.
- Explain the protocol tradeoff clearly.
- Contribute reusable examples.
- Ask sharp questions.

This is especially true for early protocols. A sponsor wants adoption, but a sponsor also wants evidence that their abstraction survives contact with real builders.

A builder who says “your docs are confusing” is less useful than a builder who says:

> “We hit a specific boundary between AG-UI state and A2UI rendering. We solved it by treating AG-UI as the event spine and A2UI as a projection. Here is the repo.”

That creates relationship capital.

## 5.3 The default project shape will be shallow

Most teams will likely build one of these:

- Agent-generated dashboard.
- Agent-generated form.
- Agent-generated approval card.
- Chat assistant that swaps in components.
- MCP tool with embedded UI.
- Vertical copilot with a dynamic panel.

That may be enough to be competitive if polished. But it will not necessarily be conceptually deep.

The field’s likely failure mode is:

> “The agent made a UI.”

The stronger version is:

> “The agent made a UI because the task produced state, evidence, options, approval gates, and executable next actions.”

## 5.4 Your advantage

Your advantage is that you are already thinking at the **work-surface** level:

- Human and agent should see the same surface.
- Methods should stack.
- UI should project state, authority, and action.
- Operator intent should be preserved.
- Evidence and receipts should be durable.
- The next run should improve from the last one.

This maps extremely well to the event’s stated “not a chatbot” requirement, while also going beyond the sponsor framing.

But it only helps if it is made visible in the demo.

---

# 6. Social strategy for the day

## 6.1 Do not posture as anti-framework

Your critique of A2UI/AG-UI is useful internally, but socially you should avoid sounding like:

> “These frameworks are naïve.”

A better room-safe framing:

> “AG-UI is a strong event spine. A2UI is a useful projection format. We wanted to test what happens when the generated UI is not the source of truth, but a projection of a shared work surface with evidence, approvals, and receipts.”

This lets you be differentiated without insulting the host stack.

## 6.2 Be legible to each sponsor

Translate the same project differently depending on who is listening:

| Listener | What to emphasize |
|---|---|
| CopilotKit / AG-UI | “We use AG-UI as the run/event/state spine for human-agent work.” |
| Google / A2UI | “We use A2UI to safely render declarative controls generated from work state.” |
| MCP Apps / Manufact | “This could become an MCP App surface where tools expose rich UI plus receipts.” |
| LangChain | “The agent workflow/orchestration produces structured state transitions, not just text.” |
| Daytona | “Side-effecting or code-running steps need ephemeral/sandboxed execution and receipts.” |
| AI Tinkerers organizers | “This is working code that turns the theme into a deeper builder pattern.” |
| Other participants | “Here is a repo pattern you can steal: event spine + UI projection + receipts.” |

## 6.3 Ask high-leverage questions

Good questions to ask mentors/sponsors:

1. **AG-UI:** “Where should durable work evidence live — state, custom events, or external backend receipts?”
2. **A2UI:** “How much can the client safely advertise custom components before the model becomes unreliable?”
3. **MCP Apps:** “What is the best pattern for a tool result that returns both text fallback and an embedded approval UI?”
4. **CopilotKit:** “What is the intended boundary between frontend tool calls and backend side effects?”
5. **All:** “How do you expect approval, auditability, and replay to work when generated UI triggers real actions?”

These questions are not adversarial; they show you are building at the next layer.

## 6.4 Help others strategically

If you help other teams unblock boilerplate or explain the stack, you gain social capital. But do not let helping consume your build window.

The ideal contribution:

- Share a tiny context primer or starter repo.
- Explain one protocol distinction clearly.
- Offer one reusable snippet.
- Return to your build.

This is consistent with the event’s builder culture and will make you memorable.

## 6.5 Optimize the demo for the room, not the architecture

The architecture can be deep. The demo must be obvious.

Your 2–3 minute demo should show:

1. User intent arrives.
2. Agent generates/updates a live work surface.
3. UI appears because the work requires structured interaction.
4. Evidence is attached.
5. User approves or edits through generated UI.
6. A method/action executes.
7. A receipt appears.
8. The next action becomes clear.

That is the story.

---

# 7. Recommended build posture

## Primary thesis

> The future is not agents generating arbitrary UI. The future is agents and humans sharing a live work surface where UI is generated as a projection of task state, evidence, authority, and next actions.

## Hackathon-safe title options

- **Work Surface for Agentic Interfaces**
- **Receiptful UI**
- **Agent Workbench**
- **Generative UI With Receipts**
- **Beyond the Chatbot: Action Surfaces for Agents**
- **Intent → Evidence → Approval → Receipt**

## Strongest demo domain

Pick a domain where UI is obviously necessary:

1. **Launch checklist / tiny SaaS provisioning**
   - Intent: “Launch this property.”
   - UI: domain, repo, deploy, Stripe, QA, approval gates.
   - Receipt: deploy preview, config diff, test result.

2. **Procurement approval**
   - Intent: “Choose a vendor.”
   - UI: comparison cards, risk flags, evidence docs, approval action.
   - Receipt: selected vendor, rationale, purchase request.

3. **CRM next action**
   - Intent: “Move this lead forward.”
   - UI: account summary, suggested next actions, editable email/task, approval.
   - Receipt: logged action, next follow-up.

The first is most aligned with Bitter. The second is most legible to non-Bitter judges. The third is most commercially obvious but may overlap Signal Eight.

## Core demo artifact

Build around a canonical object:

```ts
type WorkSurface = {
  intent: IntentRef;
  state: Record<string, unknown>;
  evidence: EvidenceRef[];
  methods: MethodDescriptor[];
  approvals: ApprovalGate[];
  receipts: ReceiptRef[];
  nextActions: NextAction[];
  projections: ProjectionHint[];
};
```

Then project it through AG-UI/A2UI.

The language:

> “AG-UI streams the work. A2UI renders the generated controls. The Work Surface keeps custody.”

---

# 8. Risks and traps

## Trap 1: Building a philosophy demo

The judges need to see working code. Avoid explaining Bitter doctrine unless the UI makes it obvious.

Bad:

> “Let me explain receipt-bearing custody.”

Good:

> “The agent wants to deploy. Before it can, it shows the evidence it checked, asks for approval, then produces a receipt.”

## Trap 2: Competing on visual polish with creative teams

Lok Lok may have strong visual/3D instincts. Do not compete on spectacle unless you can win. Compete on **operational depth made visible**.

## Trap 3: Getting swallowed by framework debugging

The starter repo exists because wiring is a time sink. Your repo primer was a good move. Enter with dependencies installed and one or two known-good paths.

## Trap 4: Being too anti-chatbot in a way that becomes vague

Everyone will say “not a chatbot.” You need a concrete test:

> If the user must compare, approve, edit, inspect evidence, and execute a side-effecting action, a chat bubble is the wrong substrate.

## Trap 5: Selling Bitter too directly

The event rules say no product selling from the floor. You can still embody Bitter’s thesis through the build.

Say:

> “This is a small experiment in generated work surfaces.”

Not:

> “I’m building a company and you should use it.”

---

# 9. Competitive social read of visible teams

Public data is thin, but the team list gives directional clues.

## Signal Eight

Likely high commercial/product clarity. The team lead is building an AI-native CRM and has enterprise GTM background. This could produce a polished, useful CRM copilot with dynamic UI.  
Source: <https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams>

**Threat:** strong demo clarity.  
**Counter:** go deeper on evidence/approval/receipt, not just dashboard/cards.

## Team Pearl

Applied AI/RAG/agentic architecture/FastAPI/Telegram. Possible procurement/construction workflow background from public profile details.  
Source: <https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams>

**Threat:** may build a real workflow with approvals.  
**Counter:** make the work-surface abstraction explicit and reusable.

## Lok Lok

Creative developer profile with Three.js/WebGPU/metaverse/OpenClaw agents.  
Source: <https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams>

**Threat:** visual wow factor.  
**Counter:** do not chase spectacle; show the UI doing real operational work.

## Polaris Gate

Voice/interview-practice founder profile.  
Source: <https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams>

**Threat:** clear vertical use case, easy to understand.  
**Counter:** demo a higher-leverage builder/operator use case.

## 0dates

AI student/SWE plus AWS Cloud Club lead; low-resource language/model fine-tuning and systems/full-stack signals.  
Source: <https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams>

**Threat:** unusual technical angle.  
**Counter:** remain flexible; collaborate if their idea complements yours.

## Testing

Enterprise full-stack profile.  
Source: <https://hong-kong.aitinkerers.org/hackathons/h_jFxflFkVBWM/teams>

**Threat:** could build a practical QA/testing UI, which maps well to generated dashboards and approvals.  
**Counter:** if you do launch/checklist/verification, make receipts the differentiator.

---

# 10. What winning probably looks like

A winning project likely has five properties:

1. **Works live** in 2–3 minutes.
2. **Clearly impossible as plain chat**.
3. **Uses at least one sponsor protocol visibly**.
4. **Shows an agent generating or controlling UI at runtime**.
5. **Feels like a reusable pattern**, not just a one-off toy.

The strongest possible Bitter-inflected win condition:

> Judges see that generated UI is not just a presentation trick. It is the missing interaction layer for agent actions that need human judgment, evidence, and approval.

---

# 11. Suggested social operating plan

## Before arrival

- Have repo booting.
- Have one working AG-UI path.
- Have one working A2UI or A2UI-like projection path.
- Have a simple demo domain selected.
- Have a one-sentence thesis.
- Have a fallback demo that does not depend on every framework working.

## During kickoff

Listen for:

- Which framework creators are present / in the video.
- What examples they emphasize.
- Whether judges care more about use of stack or product outcome.
- Whether starter repo has rough edges you can exploit or avoid.

## During build

- Build visible loop first.
- Do not overbuild backend truth.
- Keep a “receipts rail” on screen early.
- Use generated UI for a real decision/action, not decoration.

## During mentor interactions

Ask targeted questions; do not ask for generic help.

Example:

> “We’re using AG-UI state as a work-surface spine and A2UI as a generated projection. Where would you put approval/resume semantics so the UI action is replayable?”

That is a memorable question.

## During demo

Open with:

> “Most generative UI demos show a better card. We wanted to show a safer action surface.”

Then show the loop.

## After demo

Do not hard-sell. Ask:

- “Who else here is thinking about approval/evidence/replay?”
- “Where does this fit or conflict with your protocol model?”
- “Would this be useful as an example repo?”

That invites collaboration.

---

# 12. Bottom-line interpretation

This hackathon is not just about code. It is a small theater where several actors are trying to make the next interface stack visible.

- **AI Tinkerers** wants to prove it can convene real builders globally.
- **CopilotKit** wants AG-UI to become the default interaction layer.
- **Google/A2UI** wants community validation of declarative agent-rendered UI.
- **MCP Apps/Manufact** wants rich embedded app surfaces inside agent hosts to become normal.
- **LangChain/Daytona** want to remain part of the agentic app-building stack.
- **Participants** want learning, signal, collaborators, prizes, and future leverage.
- **You** can use the event to test a sharper thesis: generated UI is only powerful when tied to real work state, authority, evidence, approval, receipts, and next action.

The move is not to reject the frameworks. The move is to **complete them**.

One sentence to carry into the weekend:

> “AG-UI streams the work, A2UI renders the controls, but the real object is the shared work surface.”

