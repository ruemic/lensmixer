"use client";

import { AlertTriangle, Check, Search } from "lucide-react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { Card } from "@/lib/mixboard/kernel";
import { parseRollup, rollupCaretLocation } from "@/lib/gemini/rollup";
import { cx, marqueeRect, nodeTone, type MarqueeState } from "./ui";

type BoardCanvasProps = {
  cards: Card[];
  selectedIds: string[];
  marquee: MarqueeState | null;
  cardRefs: RefObject<Map<string, HTMLElement>>;
  suppressClickRef: RefObject<boolean>;
  onToggleSelection: (cardId: string) => void;
  onOpenCard: (card: Card) => void;
  onExpandCard: (card: Card) => void;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
};

function StreamingDots() {
  return (
    <span className="inline-flex items-end gap-1.5" aria-hidden="true">
      <span className="size-2 animate-bounce rounded-full bg-current opacity-60" />
      <span className="size-2 animate-bounce rounded-full bg-current opacity-60 [animation-delay:150ms]" />
      <span className="size-2 animate-bounce rounded-full bg-current opacity-60 [animation-delay:300ms]" />
    </span>
  );
}

function StreamingCaret() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-block h-[0.9em] w-[3px] animate-pulse bg-current align-middle"
    />
  );
}

type RollupContentProps = {
  card: Card;
  headlineId: string;
  prominent: boolean;
};

function failedHeadline(card: Card): string {
  if (card.error?.kind === "safety") {
    return "Gemini declined this lens";
  }

  if (card.error?.kind === "rate_limit") {
    return "Rate limit hit";
  }

  if (card.error?.kind === "network") {
    return "Network error";
  }

  return "Couldn't stream";
}

function RollupContent({ card, headlineId, prominent }: RollupContentProps) {
  const rollup = parseRollup(card.text);
  const caretLocation = rollupCaretLocation(rollup);
  const inFlight = card.status === "queued" || card.status === "streaming";
  const showCaret = card.status === "streaming";
  const label = card.kind === "synthesis" ? "Synthesis" : card.lensName;
  const isFailed = card.status === "failed";
  const isSafety = isFailed && card.error?.kind === "safety";
  const failedTone = isSafety
    ? "text-amber-600 dark:text-amber-300"
    : "text-rose-500 dark:text-rose-400";

  return (
    <>
      {label ? (
        <span
          className={cx(
            "self-start font-semibold uppercase tracking-[0.1em]",
            prominent
              ? "text-base text-violet-700 dark:text-violet-300"
              : "text-sm text-slate-500 dark:text-slate-400"
          )}
        >
          {label}
        </span>
      ) : null}

      <h3
        id={headlineId}
        className={cx(
          "text-balance font-bold leading-snug tracking-tight",
          isFailed ? failedTone : "text-slate-900 dark:text-slate-50",
          prominent ? "text-3xl" : "text-2xl"
        )}
      >
        {isFailed ? (
          <span className="inline-flex items-center gap-3">
            <AlertTriangle
              size={prominent ? 28 : 22}
              aria-hidden="true"
              className="shrink-0"
            />
            <span>{failedHeadline(card)}</span>
          </span>
        ) : rollup.headline ? (
          <>
            {rollup.headline}
            {showCaret && caretLocation === "headline" ? <StreamingCaret /> : null}
          </>
        ) : inFlight ? (
          <>
            <span aria-hidden="true">
              <StreamingDots />
            </span>
            <span className="sr-only">{label ?? "Card"} streaming</span>
          </>
        ) : null}
      </h3>

      {isFailed ? (
        card.error ? (
          <p
            className={cx(
              "leading-relaxed text-slate-500 dark:text-slate-400",
              prominent ? "text-xl" : "text-base"
            )}
          >
            {card.error.message}
          </p>
        ) : null
      ) : rollup.bullets.length > 0 ? (
        <ul
          className={cx(
            "flex flex-col leading-relaxed text-slate-700 dark:text-slate-200",
            prominent ? "gap-3.5 text-xl" : "gap-2.5 text-lg"
          )}
          aria-live="polite"
        >
          {rollup.bullets.map((bullet, index) => (
            <li key={index} className="flex gap-3">
              <span
                className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-current opacity-50"
                aria-hidden="true"
              />
              <span>
                {bullet}
                {showCaret && caretLocation === "bullets" && index === rollup.bullets.length - 1 ? (
                  <StreamingCaret />
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : rollup.trailing ? (
        <p
          className={cx(
            "leading-relaxed text-slate-700 dark:text-slate-200",
            prominent ? "text-xl" : "text-lg"
          )}
          aria-live="polite"
        >
          {rollup.trailing}
          {showCaret && caretLocation === "trailing" ? <StreamingCaret /> : null}
        </p>
      ) : null}
    </>
  );
}

export function BoardCanvas({
  cards,
  selectedIds,
  marquee,
  cardRefs,
  suppressClickRef,
  onToggleSelection,
  onOpenCard,
  onExpandCard,
  onPointerDown,
  onPointerMove,
  onPointerUp
}: BoardCanvasProps) {
  return (
    <>
      <div
        className="relative min-h-full cursor-crosshair touch-none select-none px-6 pb-32 pt-2"
        title="Click a card to read it. Drag to select multiple."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="mx-auto grid w-full max-w-[80rem] grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-5">
          {cards.map((card) => {
            const selected = selectedIds.includes(card.id);
            const ghosted = Boolean(card.collapsedIntoId);
            const inFlight = card.status === "queued" || card.status === "streaming";
            const headlineId = `card-${card.id}-headline`;
            const isSynthesis = card.kind === "synthesis" && !ghosted;

            return (
              <article
                ref={(element) => {
                  if (element) {
                    cardRefs.current.set(card.id, element);
                  } else {
                    cardRefs.current.delete(card.id);
                  }
                }}
                role="group"
                aria-labelledby={headlineId}
                aria-busy={inFlight}
                aria-pressed={selected}
                tabIndex={ghosted ? -1 : 0}
                style={isSynthesis ? { gridColumn: "1 / -1" } : undefined}
                className={cx(
                  "group relative flex min-w-0 cursor-pointer flex-col gap-4 rounded-2xl border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)] outline-none transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)] dark:focus-visible:ring-offset-slate-950",
                  isSynthesis ? "min-h-[16rem] p-10" : "min-h-[14rem] p-7",
                  isSynthesis &&
                    "border-violet-200/80 ring-1 ring-violet-300/40 dark:border-violet-500/30 dark:ring-violet-400/20",
                  nodeTone(card.kind),
                  selected && "ring-2 ring-blue-500/60 dark:ring-blue-400/70",
                  ghosted && "pointer-events-none scale-[0.97] opacity-30 blur-[1px]"
                )}
                key={card.id}
                onClick={() => {
                  if (suppressClickRef.current) {
                    return;
                  }

                  onOpenCard(card);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    onOpenCard(card);
                  } else if (event.key === " ") {
                    event.preventDefault();
                    onToggleSelection(card.id);
                  }
                }}
              >
                <button
                  type="button"
                  className={cx(
                    "absolute left-3 top-3 z-10 inline-flex size-7 items-center justify-center rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    selected
                      ? "border-blue-500 bg-blue-500 text-white opacity-100 dark:border-blue-400 dark:bg-blue-400"
                      : "border-slate-300 bg-white/80 opacity-30 hover:opacity-100 group-hover:opacity-70 group-focus-within:opacity-70 dark:border-slate-600 dark:bg-slate-900/80"
                  )}
                  aria-label={selected ? "Deselect card" : "Select card"}
                  aria-pressed={selected}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleSelection(card.id);
                  }}
                >
                  {selected ? <Check size={14} aria-hidden="true" /> : null}
                </button>

                <div className={cx("flex flex-col gap-4", isSynthesis ? "pl-10" : "pl-8")}>
                  <RollupContent card={card} headlineId={headlineId} prominent={isSynthesis} />
                </div>

                {card.status === "complete" ? (
                  <button
                    className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 opacity-0 shadow-sm outline-none transition-opacity hover:bg-white focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-blue-500 group-hover:opacity-100 group-focus-within:opacity-100 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-900"
                    type="button"
                    title="Branch from this card"
                    aria-label={`Branch from ${card.lensName ?? "card"}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onExpandCard(card);
                    }}
                  >
                    <Search size={16} aria-hidden="true" />
                  </button>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>

      {marquee ? (
        <div
          className="pointer-events-none fixed z-50 rounded-md border border-blue-600 bg-blue-500/10 shadow-[0_0_0_1px_rgba(37,99,235,0.15)] dark:border-blue-300 dark:bg-blue-300/10"
          style={{
            left: marqueeRect(marquee).left,
            top: marqueeRect(marquee).top,
            width: marqueeRect(marquee).width,
            height: marqueeRect(marquee).height
          }}
        />
      ) : null}
    </>
  );
}
