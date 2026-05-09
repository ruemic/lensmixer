"use client";

import type { AGUIEvent } from "@ag-ui/core";
import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  aguiCustomEvent,
  aguiLaneTextEvent,
  aguiRunError,
  aguiRunFinished,
  aguiRunStarted,
  aguiStateDelta,
  aguiStateSnapshot
} from "@/lib/mixboard/agui-events";
import {
  type Card,
  createSeedCard,
  seedCardId
} from "@/lib/mixboard/kernel";
import {
  parseSSEFrames,
  type ExpandFrame,
  type ReduceFrame
} from "@/lib/gemini/sse";
import { BoardCanvas } from "./mixboard/BoardCanvas";
import { laneIdForLens } from "./mixboard/provider-lanes";
import {
  intersects,
  isInteractiveTarget,
  marqueeRect,
  type EventLogEntry,
  type MarqueeState
} from "./mixboard/ui";
import { FullscreenReader } from "./FullscreenReader";
import { ReduceFab } from "./ReduceFab";
import { SeedBreadcrumb } from "./SeedBreadcrumb";
import { SeedComposer } from "./SeedComposer";

type ActiveOp =
  | {
      kind: "expand";
      opId: string;
      parentCardId: string;
      childIds: string[];
      lensNames: string[];
    }
  | {
      kind: "reduce";
      opId: string;
      cardId: string;
      sourceCardIds: string[];
    };

type ReduceMotion =
  | {
      phase: "draining" | "streaming" | "promoting" | "settled";
      cardId: string;
      sourceCardIds: string[];
      progress: number;
    }
  | null;

const initialQuestion = "";
const initialDirective = "";
const lensCount = 3;
const fallbackModel = "LensMixer demo";
const reduceDrainDurationMs = 7600;

function nowLabel() {
  return new Intl.DateTimeFormat("en-HK", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date());
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function chunkText(text: string, size = 42) {
  const chunks: string[] = [];

  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }

  return chunks;
}

const fallbackLensTexts = [
  `LensMixer makes thinking visible

- A single question becomes parallel cards instead of one chat transcript.
- Each lens keeps its parent, model, directive, and status attached.
- The operator chooses which branches deserve synthesis.

---

The base case is that LensMixer wins by making inference feel spatial and inspectable. The user does not need to trust one blended response; they can watch alternative readings arrive as separate artifacts.

The board is also fast to understand in a live demo. Expansion creates breadth, selection expresses judgment, and reduction creates a new node with the source trail preserved.

That loop is small enough to ship today but strong enough to suggest a bigger research workbench. Multi-provider routing can come later without changing the core graph shape.`,
  `The real product is provenance

- The board is not just prettier chat; it stores how each claim was produced.
- Collapse is reversible because parents remain tucked behind the synthesis.
- Trust comes from inspecting lineage, not from adding more text.

---

The dissenting view is that cards alone are not enough. The memorable part is the provenance contract: every generated node knows what it saw, who produced it, and why it exists.

That makes LensMixer useful for messy decisions where disagreement matters. Instead of averaging away conflict, it lets the operator preserve tension until the reduce step explicitly reconciles it.

The risk is discoverability. Selection, branching, and tucked parents need to be obvious in the first thirty seconds or the audience will read it as a card UI rather than an inference graph.`,
  `A tiny loop can imply a huge system

- Lenses can become providers, people, tools, or saved research macros.
- Reduce can become an audit step, a brief, or a next experiment.
- The graph is the primitive; the current UI is just the first projection.

---

The wildcard path is that LensMixer becomes a general interface for steering many kinds of intelligence at once. A lens might be Gemini today, a domain expert tomorrow, and a database-backed tool next week.

The current hackathon version does not need that whole system. It only needs to prove that watching cards bloom and fold is more legible than scrolling through a chat answer.

If that lands, the roadmap is straightforward. Add stronger provenance views, richer lens presets, and server-side persistence without disturbing the basic map and reduce interaction.`
];

const fallbackReduceText = `Synthesis turns alternatives into an inspectable claim

- LensMixer works because expansion and reduction are both visible operations.
- The winning demo moment is cards blooming, then folding into one accountable synthesis.
- Provenance makes the result feel engineered rather than merely generated.
- The narrow scope is a strength because every interaction serves the core loop.

---

LensMixer should be framed as an inference graph, not a brainstorming app. The operator starts with one question, creates multiple lens-specific branches, and then chooses which branches deserve to become the next node.

That makes the system feel controlled without slowing it down. The board gives immediate breadth, while the synthesis card gives the audience a clean artifact to inspect.

The important detail is that reduction does not destroy evidence. Source cards tuck behind the synthesis, so the answer can be read quickly while its lineage remains available.

For a hackathon demo, this is the right cut. The product shows a compelling primitive, avoids orchestration bloat, and leaves an obvious path toward multi-provider councils later.`;

const SESSION_PARAM = "s";
const STORAGE_PREFIX = "mixer:v1:";

type PersistedSnapshot = {
  question: string;
  cards: Card[];
  selectedIds: string[];
  openCardId: string | null;
};

function generateSessionId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

function sanitizeRestoredCards(cards: Card[]): Card[] {
  return cards.map((card) => {
    if (card.status === "streaming" || card.status === "queued") {
      return {
        ...card,
        status: "failed",
        error: card.error ?? {
          kind: "unknown",
          message: "Stream was interrupted by a page reload."
        }
      };
    }

    return card;
  });
}

export function MacroMixerPrototype() {
  const [question, setQuestion] = useState(initialQuestion);
  const [directive] = useState(initialDirective);
  const [cards, setCards] = useState<Card[]>(() => [
    createSeedCard(initialQuestion, nowLabel())
  ]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [marquee, setMarquee] = useState<MarqueeState | null>(null);
  const [, setEvents] = useState<EventLogEntry[]>([
    {
      id: "event_boot",
      label: "State snapshot initialized",
      event: aguiStateSnapshot({
        cards: [{ id: seedCardId, kind: "seed" }],
        selectedIds: []
      })
    }
  ]);
  const [activeOp, setActiveOp] = useState<ActiveOp | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState<ReduceMotion>(null);

  const cardRefs = useRef(new Map<string, HTMLElement>());
  const selectionBaseRef = useRef<string[]>([]);
  const didDragRef = useRef(false);
  const suppressClickRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const activeOpRef = useRef<ActiveOp | null>(null);
  const reduceMotionRef = useRef<ReduceMotion>(null);
  const sessionIdRef = useRef<string | null>(null);
  const hydratedRef = useRef(false);
  const drainTimerRef = useRef<number | null>(null);

  const updateActiveOp = useCallback((op: ActiveOp | null) => {
    activeOpRef.current = op;
    setActiveOp(op);
  }, []);

  useEffect(() => {
    reduceMotionRef.current = reduceMotion;
  }, [reduceMotion]);

  const clearDrainTimer = useCallback(() => {
    if (drainTimerRef.current !== null) {
      window.clearInterval(drainTimerRef.current);
      drainTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearDrainTimer, [clearDrainTimer]);

  const startReduceDrain = useCallback(
    (cardId: string, sourceCardIds: string[]) =>
      new Promise<void>((resolve) => {
        clearDrainTimer();
        const startedAt = performance.now();

        const initialMotion = {
          phase: "draining",
          cardId,
          sourceCardIds,
          progress: 0
        } satisfies NonNullable<ReduceMotion>;
        reduceMotionRef.current = initialMotion;
        setReduceMotion(initialMotion);

        drainTimerRef.current = window.setInterval(() => {
          const progress = Math.min((performance.now() - startedAt) / reduceDrainDurationMs, 1);
          setReduceMotion((current) => {
            if (current?.cardId !== cardId) {
              return current;
            }

            const next = {
                  ...current,
                  progress,
                  phase: progress >= 1 ? "streaming" : "draining"
                } satisfies NonNullable<ReduceMotion>;
            reduceMotionRef.current = next;
            return next;
          });

          if (progress >= 1) {
            clearDrainTimer();
            resolve();
          }
        }, 32);
      }),
    [clearDrainTimer]
  );

  useEffect(() => {
    setCards((current) =>
      current.map((card) => (card.id === seedCardId ? { ...card, text: question } : card))
    );
  }, [question]);

  // Hydrate from URL ?s=<uuid> on first mount. Generates a fresh session id if
  // none is present and pushes it back into the URL via history.replaceState.
  useEffect(() => {
    if (hydratedRef.current) {
      return;
    }
    hydratedRef.current = true;

    const url = new URL(window.location.href);
    let sid = url.searchParams.get(SESSION_PARAM);

    if (!sid) {
      sid = generateSessionId();
      url.searchParams.set(SESSION_PARAM, sid);
      window.history.replaceState({}, "", url.toString());
    }

    sessionIdRef.current = sid;

    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(`${STORAGE_PREFIX}${sid}`);
    } catch {
      // localStorage may be unavailable (private browsing, quota); proceed with defaults.
    }

    if (!raw) {
      return;
    }

    try {
      const data = JSON.parse(raw) as Partial<PersistedSnapshot>;

      if (typeof data.question === "string") {
        setQuestion(data.question);
      }

      if (Array.isArray(data.cards) && data.cards.length > 0) {
        setCards(sanitizeRestoredCards(data.cards as Card[]));
      }

      if (Array.isArray(data.selectedIds)) {
        setSelectedIds(data.selectedIds.filter((id): id is string => typeof id === "string"));
      }

      if (typeof data.openCardId === "string") {
        setOpenCardId(data.openCardId);
      }
    } catch {
      // Stored snapshot was corrupt; ignore and start fresh.
    }
  }, []);

  // Persist on state change. Debounced so streaming deltas don't churn
  // localStorage on every chunk.
  useEffect(() => {
    const sid = sessionIdRef.current;

    if (!sid || !hydratedRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      const snapshot: PersistedSnapshot = {
        question,
        cards,
        selectedIds,
        openCardId
      };

      try {
        window.localStorage.setItem(`${STORAGE_PREFIX}${sid}`, JSON.stringify(snapshot));
      } catch {
        // Quota or storage disabled — silently drop the write.
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [cards, openCardId, question, selectedIds]);

  const seedCard = useMemo(
    () => cards.find((card) => card.id === seedCardId) ?? null,
    [cards]
  );

  const nonSeedCards = useMemo(
    () => cards.filter((card) => card.kind !== "seed"),
    [cards]
  );

  // Synthesis cards lead the canvas (full-width hero), then alive lenses, then
  // ghosted parents. Keeps the freshly-produced result above the fold.
  const orderedCards = useMemo(() => {
    const synthesisAlive = nonSeedCards.filter(
      (card) => card.kind === "synthesis" && !card.collapsedIntoId
    );
    const lensAlive = nonSeedCards.filter(
      (card) => card.kind !== "synthesis" && !card.collapsedIntoId
    );
    const ghosted = nonSeedCards.filter((card) => Boolean(card.collapsedIntoId));
    return [...synthesisAlive, ...lensAlive, ...ghosted];
  }, [nonSeedCards]);

  const selectableCards = useMemo(
    () => nonSeedCards.filter((card) => !card.collapsedIntoId),
    [nonSeedCards]
  );

  const openCard = useMemo(
    () => (openCardId ? cards.find((card) => card.id === openCardId) ?? null : null),
    [cards, openCardId]
  );

  const selectedCards = useMemo(
    () => cards.filter((card) => selectedIds.includes(card.id) && !card.collapsedIntoId),
    [cards, selectedIds]
  );

  const hasChildren = nonSeedCards.length > 0;
  const showReduceFab = hasChildren && selectedIds.length >= 2 && !activeOp;

  const appendAguiEvent = useCallback((label: string, event: AGUIEvent) => {
    setEvents((current) =>
      [{ id: makeId("event"), label, event }, ...current].slice(0, 120)
    );
  }, []);

  const appendCustomEvent = useCallback(
    (label: string, name: string, value: Record<string, unknown>) => {
      appendAguiEvent(label, aguiCustomEvent(name, value));
    },
    [appendAguiEvent]
  );

  function toggleSelection(cardId: string) {
    setSelectedIds((current) =>
      current.includes(cardId) ? current.filter((id) => id !== cardId) : [...current, cardId]
    );
  }

  function updateMarqueeSelection(nextMarquee: MarqueeState) {
    const rect = marqueeRect(nextMarquee);
    const hitIds = selectableCards
      .filter((card) => {
        const element = cardRefs.current.get(card.id);

        if (!element) {
          return false;
        }

        const bounds = element.getBoundingClientRect();
        return intersects(rect, {
          left: bounds.left,
          top: bounds.top,
          right: bounds.right,
          bottom: bounds.bottom
        });
      })
      .map((card) => card.id);

    if (nextMarquee.additive) {
      setSelectedIds(Array.from(new Set([...selectionBaseRef.current, ...hitIds])));
    } else {
      setSelectedIds(hitIds);
    }
  }

  function handleSelectionPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || isInteractiveTarget(event.target)) {
      return;
    }

    const additive = event.shiftKey || event.metaKey || event.ctrlKey;
    const nextMarquee = {
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      additive
    };

    selectionBaseRef.current = selectedIds;
    didDragRef.current = false;
    setMarquee(nextMarquee);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleSelectionPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!marquee) {
      return;
    }

    const nextMarquee = {
      ...marquee,
      currentX: event.clientX,
      currentY: event.clientY
    };
    const rect = marqueeRect(nextMarquee);

    if (rect.width > 5 || rect.height > 5) {
      didDragRef.current = true;
      updateMarqueeSelection(nextMarquee);
    }

    setMarquee(nextMarquee);
  }

  function handleSelectionPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!marquee) {
      return;
    }

    if (didDragRef.current) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setMarquee(null);
  }

  const handleExpandFrame = useCallback(
    (frame: ExpandFrame) => {
      if (frame.type === "start") {
        const childIds = frame.lenses.map((lens) => lens.childCardId);
        const lensNames = frame.lenses.map((lens) => lens.name);
        const op: ActiveOp = {
          kind: "expand",
          opId: frame.opId,
          parentCardId: frame.parentCardId,
          childIds,
          lensNames
        };
        const created = nowLabel();
        const newCards: Card[] = frame.lenses.map((lens) => ({
          id: lens.childCardId,
          kind: "lens",
          title: lens.name,
          text: "",
          parentIds: [frame.parentCardId],
          directive: frame.directive,
          lensId: lens.id,
          lensName: lens.name,
          provider: "Gemini",
          model: frame.model,
          status: "queued",
          opId: frame.opId,
          createdAt: created
        }));

        updateActiveOp(op);
        setCards((current) => [...current, ...newCards]);
        setSelectedIds([]);
        appendAguiEvent("Expand run started", aguiRunStarted(frame.opId));
        appendCustomEvent("Expand started", "gemini.expand.started", {
          op_id: frame.opId,
          parent_card_id: frame.parentCardId,
          lens_count: frame.lenses.length,
          model: frame.model
        });
        appendAguiEvent(
          "Cards added",
          aguiStateDelta([
            {
              op: "add",
              path: "/cards",
              value: newCards.map((card) => ({
                id: card.id,
                kind: card.kind,
                lensName: card.lensName,
                parentIds: card.parentIds
              }))
            }
          ])
        );
        return;
      }

      const op = activeOpRef.current;

      if (frame.type === "complete") {
        appendAguiEvent("Expand run finished", aguiRunFinished(op?.opId ?? "expand", {}));
        updateActiveOp(null);
        return;
      }

      if (frame.type === "error") {
        appendAguiEvent("Expand run error", aguiRunError(frame.message));
        setLastError(frame.message);
        updateActiveOp(null);
        return;
      }

      if (!op || op.kind !== "expand") {
        return;
      }

      const cardId = op.childIds[frame.lensIndex];

      if (!cardId) {
        return;
      }

      if (frame.type === "lens_start") {
        setCards((current) =>
          current.map((card) =>
            card.id === cardId ? { ...card, status: "streaming" } : card
          )
        );
        appendAguiEvent(
          `${op.lensNames[frame.lensIndex] ?? "Lens"} started`,
          aguiLaneTextEvent({
            opId: op.opId,
            laneId: laneIdForLens(frame.lensIndex),
            kind: "lens_start",
            name: op.lensNames[frame.lensIndex]
          })
        );
        return;
      }

      if (frame.type === "delta") {
        setCards((current) =>
          current.map((card) =>
            card.id === cardId ? { ...card, text: card.text + frame.text } : card
          )
        );
        appendAguiEvent(
          "Lens delta",
          aguiLaneTextEvent({
            opId: op.opId,
            laneId: laneIdForLens(frame.lensIndex),
            kind: "delta",
            text: frame.text
          })
        );
        return;
      }

      if (frame.type === "lens_done") {
        setCards((current) =>
          current.map((card) =>
            card.id === cardId
              ? { ...card, text: frame.text, status: "complete" }
              : card
          )
        );
        appendAguiEvent(
          `${op.lensNames[frame.lensIndex] ?? "Lens"} settled`,
          aguiLaneTextEvent({
            opId: op.opId,
            laneId: laneIdForLens(frame.lensIndex),
            kind: "lens_done"
          })
        );
        return;
      }

      if (frame.type === "lens_error") {
        setCards((current) =>
          current.map((card) =>
            card.id === cardId
              ? {
                  ...card,
                  status: "failed",
                  error: {
                    kind: frame.kind,
                    message: frame.message,
                    detail: frame.detail
                  }
                }
              : card
          )
        );
        appendCustomEvent("Lens failed", "gemini.lens.failed", {
          op_id: op.opId,
          lens_index: frame.lensIndex,
          kind: frame.kind,
          message: frame.message
        });
      }
    },
    [appendAguiEvent, appendCustomEvent, updateActiveOp]
  );

  const handleReduceFrame = useCallback(
    (frame: ReduceFrame) => {
      if (frame.type === "start") {
        const op: ActiveOp = {
          kind: "reduce",
          opId: frame.opId,
          cardId: frame.cardId,
          sourceCardIds: frame.sourceCardIds
        };
        const created = nowLabel();
        const synthesisCard: Card = {
          id: frame.cardId,
          kind: "synthesis",
          title: "Synthesis",
          text: "",
          parentIds: frame.sourceCardIds,
          directive: frame.directive,
          provider: "Gemini",
          model: frame.model,
          status: "streaming",
          opId: frame.opId,
          createdAt: created
        };

        updateActiveOp(op);
        setReduceMotion((current) =>
          current?.cardId === frame.cardId
            ? current
            : {
                phase: "draining",
                cardId: frame.cardId,
                sourceCardIds: frame.sourceCardIds,
                progress: 0
              }
        );
        setCards((current) =>
          current.some((card) => card.id === frame.cardId)
            ? current.map((card) =>
                card.id === frame.cardId
                  ? {
                      ...card,
                      directive: frame.directive,
                      provider: "Gemini",
                      model: frame.model,
                      status: "streaming",
                      opId: frame.opId
                    }
                  : card
              )
            : [...current, synthesisCard]
        );
        setSelectedIds([]);
        appendAguiEvent("Reduce run started", aguiRunStarted(frame.opId));
        appendCustomEvent("Reduce started", "gemini.reduce.started", {
          op_id: frame.opId,
          card_id: frame.cardId,
          source_card_ids: frame.sourceCardIds,
          model: frame.model
        });
        appendAguiEvent(
          "Synthesis card added",
          aguiStateDelta([
            {
              op: "add",
              path: "/cards",
              value: {
                id: synthesisCard.id,
                kind: synthesisCard.kind,
                parentIds: synthesisCard.parentIds
              }
            }
          ])
        );
        appendAguiEvent(
          "Synthesis stream started",
          aguiLaneTextEvent({
            opId: frame.opId,
            laneId: "reduce",
            kind: "reduce_start",
            name: "Synthesis"
          })
        );
        return;
      }

      const op = activeOpRef.current;

      if (frame.type === "delta") {
        if (op?.kind === "reduce") {
          setCards((current) =>
            current.map((card) =>
              card.id === op.cardId ? { ...card, text: card.text + frame.text } : card
            )
          );
          appendAguiEvent(
            "Synthesis delta",
            aguiLaneTextEvent({
              opId: op.opId,
              laneId: "reduce",
              kind: "delta",
              text: frame.text
            })
          );
        }

        return;
      }

      if (frame.type === "done") {
        if (op?.kind === "reduce") {
          setCards((current) =>
            current.map((card) =>
              card.id === op.cardId
                ? { ...card, text: frame.text, status: "complete" }
                : card
            )
          );
          appendAguiEvent(
            "Synthesis settled",
            aguiLaneTextEvent({
              opId: op.opId,
              laneId: "reduce",
              kind: "reduce_done"
            })
          );
          appendAguiEvent("Reduce run finished", aguiRunFinished(op.opId, {}));
          const promote = () => {
            clearDrainTimer();
            const promotingMotion = {
              phase: "promoting",
              cardId: op.cardId,
              sourceCardIds: op.sourceCardIds,
              progress: 1
            } satisfies NonNullable<ReduceMotion>;
            reduceMotionRef.current = promotingMotion;
            setReduceMotion(promotingMotion);
            setCards((current) =>
              current.map((card) =>
                op.sourceCardIds.includes(card.id)
                  ? { ...card, collapsedIntoId: op.cardId }
                  : card
              )
            );

            window.setTimeout(() => {
              const settledMotion = {
                phase: "settled",
                cardId: op.cardId,
                sourceCardIds: op.sourceCardIds,
                progress: 1
              } satisfies NonNullable<ReduceMotion>;
              reduceMotionRef.current = settledMotion;
              setReduceMotion(settledMotion);
              updateActiveOp(null);
            }, 240);
          };
          promote();
        }
        return;
      }

      if (frame.type === "error") {
        if (op?.kind === "reduce") {
          setCards((current) =>
            current.map((card) =>
              card.id === op.cardId
                ? {
                    ...card,
                    status: "failed",
                    error: {
                      kind: frame.kind,
                      message: frame.message,
                      detail: frame.detail
                    }
                  }
                : card
            )
          );
        }

        appendAguiEvent("Reduce run error", aguiRunError(frame.message));
        setLastError(frame.message);
        clearDrainTimer();
        setReduceMotion(null);
        updateActiveOp(null);
      }
    },
    [appendAguiEvent, appendCustomEvent, clearDrainTimer, updateActiveOp]
  );

  const runFallbackExpand = useCallback(
    async (target: Card) => {
      const opId = makeId("op_demo_expand");
      const lenses = ["Base case", "Dissent", "Wildcards"].map((name, index) => ({
        index,
        id: name.toLowerCase().replace(/\s+/g, "_"),
        name,
        childCardId: makeId(`card_demo_${index}`)
      }));

      handleExpandFrame({
        type: "start",
        opId,
        parentCardId: target.id,
        directive,
        lenses,
        model: fallbackModel
      });

      await Promise.all(
        lenses.map(async (lens, lensIndex) => {
          handleExpandFrame({ type: "lens_start", lensIndex });

          for (const chunk of chunkText(fallbackLensTexts[lensIndex] ?? fallbackLensTexts[0])) {
            await sleep(42 + lensIndex * 18);
            handleExpandFrame({ type: "delta", lensIndex, text: chunk });
          }

          handleExpandFrame({
            type: "lens_done",
            lensIndex,
            text: fallbackLensTexts[lensIndex] ?? fallbackLensTexts[0]
          });
        })
      );

      handleExpandFrame({ type: "complete" });
    },
    [directive, handleExpandFrame]
  );

  const runFallbackReduce = useCallback(
    async (inputs: Card[], stagedCardId?: string) => {
      const opId = makeId("op_demo_reduce");
      const cardId = stagedCardId ?? makeId("card_demo_reduced");

      handleReduceFrame({
        type: "start",
        opId,
        cardId,
        sourceCardIds: inputs.map((card) => card.id),
        directive,
        model: fallbackModel
      });

      for (const chunk of chunkText(fallbackReduceText, 48)) {
        await sleep(36);
        handleReduceFrame({ type: "delta", text: chunk });
      }

      handleReduceFrame({ type: "done", text: fallbackReduceText });
    },
    [directive, handleReduceFrame]
  );

  const requestExpand = useCallback(
    async (target: Card) => {
      if (activeOp) {
        return;
      }

      setLastError(null);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/expand", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parentCardId: target.id,
            parentText: target.text,
            directive,
            lensCount
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          if (response.status === 404 || response.status === 405) {
            await runFallbackExpand(target);
            return;
          }

          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(payload.error ?? `Expand failed: ${response.status}`);
        }

        for await (const frame of parseSSEFrames<ExpandFrame>(response)) {
          handleExpandFrame(frame);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          appendCustomEvent("Expand cancelled", "gemini.expand.cancelled", {});
        } else {
          await runFallbackExpand(target);
        }
        updateActiveOp(null);
      } finally {
        abortRef.current = null;
      }
    },
    [activeOp, appendCustomEvent, directive, handleExpandFrame, runFallbackExpand, updateActiveOp]
  );

  const requestReduce = useCallback(
    async (targets?: Card[]) => {
      if (activeOp) {
        return;
      }

      const inputs = (targets ?? selectedCards).filter(
        (card) => card.text.trim().length > 0 && card.status === "complete"
      );

      if (inputs.length < 2) {
        setLastError("Select at least two complete cards before reducing.");
        return;
      }

      setLastError(null);
      const cardId = makeId("card_reduced");
      const sourceCardIds = inputs.map((card) => card.id);
      const synthesisCard: Card = {
        id: cardId,
        kind: "synthesis",
        title: "Synthesis",
        text: "",
        parentIds: sourceCardIds,
        directive,
        provider: "Gemini",
        model: fallbackModel,
        status: "queued",
        opId: makeId("op_reduce_pending"),
        createdAt: nowLabel()
      };
      setCards((current) => [...current, synthesisCard]);
      setSelectedIds([]);
      void startReduceDrain(cardId, sourceCardIds);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/reduce", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cards: inputs.map((card) => ({
              id: card.id,
              title: card.title,
              lensName: card.lensName,
              text: card.text
            })),
            directive,
            cardId
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          if (response.status === 404 || response.status === 405) {
            await runFallbackReduce(inputs, cardId);
            return;
          }

          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(payload.error ?? `Reduce failed: ${response.status}`);
        }

        for await (const frame of parseSSEFrames<ReduceFrame>(response)) {
          handleReduceFrame(frame);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          appendCustomEvent("Reduce cancelled", "gemini.reduce.cancelled", {});
        } else {
          await runFallbackReduce(inputs, cardId);
        }
        updateActiveOp(null);
      } finally {
        abortRef.current = null;
      }
    },
    [activeOp, appendCustomEvent, directive, handleReduceFrame, runFallbackReduce, selectedCards, startReduceDrain, updateActiveOp]
  );

  return (
    <main className="relative flex min-h-screen flex-col bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      {hasChildren ? <SeedBreadcrumb question={question} /> : null}

      <div className="relative flex-1">
        {hasChildren ? (
          <BoardCanvas
            cards={orderedCards}
            selectedIds={selectedIds}
            marquee={marquee}
            cardRefs={cardRefs}
            suppressClickRef={suppressClickRef}
            onToggleSelection={toggleSelection}
            onOpenCard={(card) => setOpenCardId(card.id)}
            onExpandCard={(card) => void requestExpand(card)}
            reduceMotion={reduceMotion}
            onPointerDown={handleSelectionPointerDown}
            onPointerMove={handleSelectionPointerMove}
            onPointerUp={handleSelectionPointerUp}
          />
        ) : (
          <SeedComposer
            value={question}
            disabled={Boolean(activeOp)}
            onChange={setQuestion}
            onSubmit={() => {
              if (!seedCard) {
                return;
              }

              void requestExpand({ ...seedCard, text: question });
            }}
          />
        )}
      </div>

      {showReduceFab ? (
        <ReduceFab
          count={selectedIds.length}
          disabled={Boolean(activeOp)}
          onClick={() => void requestReduce()}
        />
      ) : null}

      {openCard ? (
        <FullscreenReader card={openCard} onClose={() => setOpenCardId(null)} />
      ) : null}

      {lastError ? (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center">
          <div className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-rose-200 bg-rose-50 px-5 py-2.5 text-base font-bold text-rose-800 shadow-md dark:border-rose-500/40 dark:bg-rose-950/80 dark:text-rose-200">
            <span className="max-w-[36rem] truncate">{lastError}</span>
            <button
              type="button"
              className="text-rose-700/70 hover:text-rose-800 dark:text-rose-200/70 dark:hover:text-rose-100"
              onClick={() => setLastError(null)}
            >
              dismiss
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
