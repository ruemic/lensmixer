"use client";

import { AlertTriangle, Check, GitMerge, Search } from "lucide-react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { Card } from "@/lib/mixboard/kernel";
import { parseRollup, rollupCaretLocation } from "@/lib/gemini/rollup";
import { cx, marqueeRect, nodeTone, type MarqueeState } from "./ui";

type BoardCanvasProps = {
  cards: Card[];
  selectedIds: string[];
  marquee: MarqueeState | null;
  reduceMotion: {
    phase: "draining" | "streaming" | "promoting" | "settled";
    cardId: string;
    sourceCardIds: string[];
    progress: number;
  } | null;
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
  textOverride?: string;
  literalText?: boolean;
  drainFullText?: string;
  drainProgress?: number;
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

function LiteralDrainText({
  fullText,
  visibleText,
  progress,
  headlineId,
  prominent
}: {
  fullText: string;
  visibleText: string;
  progress: number;
  headlineId: string;
  prominent: boolean;
}) {
  const deletedCount = Math.max(0, fullText.length - visibleText.length);
  const fallingText =
    progress < 0.995
      ? fullText.slice(visibleText.length, visibleText.length + 28).replace(/\s/g, "·")
      : "";
  const fallingChars = Array.from(fallingText).filter(Boolean).slice(0, 18);

  return (
    <div className="relative h-[10rem] overflow-hidden">
      <p
        id={headlineId}
        className={cx(
          "whitespace-pre-wrap break-words font-mono leading-relaxed text-slate-800 dark:text-slate-100",
          prominent ? "text-lg" : "text-[0.95rem]"
        )}
        aria-live="polite"
      >
        {visibleText}
        {visibleText ? (
          <span
            className="ml-0.5 inline-block w-[0.6em] animate-[delete-caret_420ms_steps(2,end)_infinite] text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.9)] dark:text-violet-200"
            aria-hidden="true"
          >
            ▌
          </span>
        ) : null}
      </p>

      {fallingChars.length > 0 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-wrap justify-end gap-1.5" aria-hidden="true">
          {fallingChars.map((char, index) => (
            <span
              className="inline-block font-mono text-base font-bold text-blue-200 opacity-0 drop-shadow-[0_0_10px_rgba(191,219,254,0.95)] animate-[glyph-fall_900ms_cubic-bezier(.35,0,.25,1)_both]"
              key={`${deletedCount}-${index}-${char}`}
              style={{
                animationDelay: `${index * 28}ms`,
                marginLeft: `${(index % 5) * 0.08}rem`
              }}
            >
              {char}
            </span>
          ))}
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-blue-400 via-violet-300 to-transparent shadow-[0_0_18px_rgba(167,139,250,0.7)]"
        style={{ transform: `scaleX(${Math.max(0.06, 1 - progress)})`, transformOrigin: "left" }}
        aria-hidden="true"
      />
    </div>
  );
}

function RollupContent({
  card,
  headlineId,
  prominent,
  textOverride,
  literalText,
  drainFullText,
  drainProgress = 0
}: RollupContentProps) {
  const visibleText = textOverride ?? card.text;
  const literalFullText = drainFullText ?? visibleText;
  const rollup = parseRollup(visibleText);
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
      {label && !literalText ? (
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

      {literalText ? (
        <LiteralDrainText
          fullText={literalFullText}
          visibleText={visibleText}
          progress={drainProgress}
          headlineId={headlineId}
          prominent={prominent}
        />
      ) : isFailed ? (
        <>
          <h3
            id={headlineId}
            className={cx(
              "text-balance font-bold leading-snug tracking-tight",
              isFailed ? failedTone : "text-slate-900 dark:text-slate-50",
              prominent ? "text-3xl" : "text-2xl"
            )}
          >
            <span className="inline-flex items-center gap-3">
              <AlertTriangle
                size={prominent ? 28 : 22}
                aria-hidden="true"
                className="shrink-0"
              />
              <span>{failedHeadline(card)}</span>
            </span>
          </h3>
          {card.error ? (
            <p
              className={cx(
                "leading-relaxed text-slate-500 dark:text-slate-400",
                prominent ? "text-xl" : "text-base"
              )}
            >
              {card.error.message}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <h3
            id={headlineId}
            className={cx(
              "text-balance font-bold leading-snug tracking-tight",
              "text-slate-900 dark:text-slate-50",
              prominent ? "text-3xl" : "text-2xl"
            )}
          >
            {rollup.headline ? (
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

          {rollup.bullets.length > 0 ? (
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
      )}
    </>
  );
}

type CardArticleProps = {
  card: Card;
  selected: boolean;
  staged: boolean;
  draining: boolean;
  promoteOut: boolean;
  prominent: boolean;
  provenanceCards?: Card[];
  displayText?: string;
  literalText?: boolean;
  drainFullText?: string;
  drainProgress?: number;
  intakeText?: string;
  cardRefs?: RefObject<Map<string, HTMLElement>>;
  suppressClickRef: RefObject<boolean>;
  onToggleSelection: (cardId: string) => void;
  onOpenCard: (card: Card) => void;
  onExpandCard: (card: Card) => void;
};

function SynthesisBadge({ count }: { count: number }) {
  if (count < 1) {
    return null;
  }

  return (
    <span className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-bold text-violet-800 shadow-sm dark:border-violet-400/30 dark:bg-violet-500/15 dark:text-violet-100">
      <GitMerge size={15} aria-hidden="true" />
      {count} folded
    </span>
  );
}

function sourceLabel(card: Card) {
  if (card.lensName) {
    return card.lensName;
  }

  if (card.title && card.title !== "Synthesis") {
    return card.title;
  }

  const rollup = parseRollup(card.text);
  return rollup.headline || card.kind;
}

function ProvenanceTrail({ sources }: { sources: Card[] }) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-slate-400 dark:text-slate-500">
      <span className="inline-flex items-center gap-1.5 text-violet-300">
        <GitMerge size={14} aria-hidden="true" />
        {sources.length} folded from
      </span>
      {sources.slice(0, 4).map((source, index) => (
        <span className="inline-flex items-center gap-2" key={source.id}>
          {index > 0 ? <span className="text-slate-600">/</span> : null}
          <span className="text-slate-300">{sourceLabel(source)}</span>
        </span>
      ))}
    </div>
  );
}

const tagStopWords = new Set([
  "about",
  "after",
  "again",
  "also",
  "and",
  "are",
  "because",
  "been",
  "being",
  "but",
  "can",
  "could",
  "from",
  "have",
  "into",
  "its",
  "may",
  "more",
  "not",
  "one",
  "only",
  "our",
  "out",
  "over",
  "soon",
  "than",
  "that",
  "the",
  "their",
  "then",
  "these",
  "this",
  "through",
  "will",
  "with",
  "would"
]);

function cleanTagWord(word: string) {
  return word.replace(/^[^\w$]+|[^\w).%]+$/g, "");
}

function tagFragments(text: string, compact: boolean) {
  const lines = text
    .replace(/^[\s\-•]+/gm, "")
    .replace(/[—–]/g, " ")
    .split(/[\n.;:]+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const phrases: string[] = [];
  const seen = new Set<string>();
  const maxPhrases = compact ? 8 : 20;

  for (const line of lines) {
    const words = line
      .split(/\s+/)
      .map(cleanTagWord)
      .filter((word) => word.length > 1);
    const salient = words.filter((word) => {
      const normalized = word.toLowerCase();
      return word.length > 2 && !tagStopWords.has(normalized);
    });
    const source = salient.length >= 2 ? salient : words;

    for (let index = 0; index < source.length && phrases.length < maxPhrases; ) {
      const size = compact ? 2 : 2 + ((phrases.length + index) % 2);
      const phrase = source.slice(index, index + size).join(" ");
      const key = phrase.toLowerCase();

      if (phrase.length > 5 && !seen.has(key)) {
        phrases.push(phrase);
        seen.add(key);
      }

      index += size;
    }

    if (phrases.length >= maxPhrases) {
      break;
    }
  }

  if (phrases.length > 0) {
    return phrases;
  }

  const words = text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map(cleanTagWord)
    .filter((word) => word.length > 0);

  for (let index = 0; index < words.length && phrases.length < maxPhrases; ) {
    const size = compact ? 2 : 3;
    const phrase = words.slice(index, index + size).join(" ");

    if (phrase.length > 6) {
      phrases.push(phrase);
    }

    index += size;
  }

  return phrases;
}

function SourceTagField({ text, compact = false }: { text: string; compact?: boolean }) {
  const phrases = tagFragments(text, compact);

  if (phrases.length === 0) {
    return null;
  }

  return (
    <div
      className={cx(
        "pointer-events-none relative isolate w-full overflow-hidden text-left",
        compact ? "min-h-28" : "min-h-[20rem]"
      )}
      aria-hidden="true"
    >
      <div
        className={cx(
          "grid h-full content-around",
          compact ? "grid-cols-2 gap-x-5 gap-y-3" : "grid-cols-4 gap-x-7 gap-y-5"
        )}
      >
        {phrases.map((phrase, index) => (
          <span
            className={cx(
              "inline-block text-balance font-medium leading-tight text-slate-100/80 drop-shadow-[0_0_14px_rgba(167,139,250,0.28)]",
              compact
                ? "text-sm"
                : index % 6 === 0
                  ? "text-2xl"
                  : index % 3 === 0
                    ? "text-xl"
                    : "text-lg",
              index % 4 === 1 && "self-end text-violet-100/80",
              index % 4 === 2 && "justify-self-center text-blue-100/75",
              index % 4 === 3 && "justify-self-end text-slate-200/70"
            )}
            key={`${index}-${phrase}`}
            style={{
              animation: `source-word-settle 520ms ease-out both, source-word-drift ${
                compact ? 7.2 : 9.2 + (index % 5) * 0.9
              }s ease-in-out ${index * 120}ms infinite`
            }}
          >
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScrambleGlyphs({ text, compact = false }: { text: string; compact?: boolean }) {
  return <SourceTagField text={text} compact={compact} />;
}

function SynthesisPlaceholder({
  headlineId,
  intakeText
}: {
  headlineId: string;
  intakeText: string;
}) {
  return (
    <div
      className="relative z-10 flex min-h-[20rem] flex-col items-center justify-center px-4 py-5 text-left"
      aria-live="polite"
    >
      <h3 id={headlineId} className="sr-only">Synthesizing</h3>
      <div className="relative z-10 w-full max-w-[72rem]">
        {intakeText ? (
          <ScrambleGlyphs text={intakeText} />
        ) : (
          <div className="flex justify-center text-slate-400">
            <StreamingDots />
          </div>
        )}
      </div>
    </div>
  );
}

function CardArticle({
  card,
  selected,
  staged,
  draining,
  promoteOut,
  prominent,
  provenanceCards = [],
  displayText,
  literalText,
  drainFullText,
  drainProgress,
  intakeText = "",
  cardRefs,
  suppressClickRef,
  onToggleSelection,
  onOpenCard,
  onExpandCard
}: CardArticleProps) {
  const ghosted = Boolean(card.collapsedIntoId);
  const inFlight = card.status === "queued" || card.status === "streaming";
  const headlineId = `card-${card.id}-headline`;
  const isSynthesis = card.kind === "synthesis" && !ghosted;

  return (
    <article
      ref={(element) => {
        if (!cardRefs) {
          return;
        }

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
      tabIndex={ghosted || draining ? -1 : 0}
      style={!staged && isSynthesis ? { gridColumn: "1 / -1" } : undefined}
      className={cx(
        "group relative flex min-w-0 cursor-pointer flex-col gap-4 rounded-2xl border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)] outline-none transition-all duration-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-800 dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)] dark:focus-visible:ring-offset-slate-950",
        prominent ? "min-h-[16rem] p-10" : "min-h-[14rem] p-7",
        draining && "min-h-[16rem] p-6",
        staged &&
          "mx-auto min-h-[17rem] w-full max-w-[64rem] animate-[synthesis-rise_720ms_cubic-bezier(.2,.8,.2,1)_both] !border-transparent !bg-transparent !shadow-none !ring-0 dark:!border-transparent dark:!bg-transparent dark:!shadow-none",
        isSynthesis &&
          !staged &&
          "border-violet-200/80 ring-1 ring-violet-300/40 dark:border-violet-500/30 dark:ring-violet-400/20",
        !staged && !draining && nodeTone(card.kind),
        selected && !draining && "ring-2 ring-blue-500/60 dark:ring-blue-400/70",
        draining &&
          "pointer-events-none !border-transparent !bg-transparent !shadow-none !ring-0 dark:!border-transparent dark:!bg-transparent dark:!shadow-none",
        promoteOut && "scale-[0.94] opacity-0 blur-sm",
        ghosted && "pointer-events-none scale-[0.97] opacity-30 blur-[1px]"
      )}
      key={card.id}
      onClick={() => {
        if (suppressClickRef.current || draining) {
          return;
        }

        onOpenCard(card);
      }}
      onKeyDown={(event) => {
        if (draining) {
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          onOpenCard(card);
        } else if (event.key === " ") {
          event.preventDefault();
          onToggleSelection(card.id);
        }
      }}
    >
      {card.kind === "synthesis" && !draining ? <SynthesisBadge count={card.parentIds.length} /> : null}

      {staged && card.text.trim() && intakeText ? (
        <div className="pointer-events-none absolute inset-0 z-0 px-6 py-8 opacity-25" aria-hidden="true">
          <ScrambleGlyphs text={intakeText} compact />
        </div>
      ) : null}

      {!staged && !draining ? (
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
      ) : null}

      <div
        className={cx(
          "relative z-10 flex flex-col gap-4 transition-all duration-700",
          staged || draining ? "" : prominent ? "pl-10" : "pl-8",
          draining && "opacity-100",
          promoteOut && "translate-y-14 opacity-0"
        )}
      >
        {isSynthesis && provenanceCards.length > 0 ? (
          <ProvenanceTrail sources={provenanceCards} />
        ) : null}

        {staged && !card.text.trim() ? (
          <SynthesisPlaceholder headlineId={headlineId} intakeText={intakeText} />
        ) : (
          <RollupContent
            card={card}
            headlineId={headlineId}
            prominent={prominent}
            textOverride={displayText}
            literalText={literalText}
            drainFullText={drainFullText}
            drainProgress={drainProgress}
          />
        )}
      </div>

      {card.status === "complete" && !draining ? (
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
}

export function BoardCanvas({
  cards,
  selectedIds,
  marquee,
  reduceMotion,
  cardRefs,
  suppressClickRef,
  onToggleSelection,
  onOpenCard,
  onExpandCard,
  onPointerDown,
  onPointerMove,
  onPointerUp
}: BoardCanvasProps) {
  const stagedSynthesis = reduceMotion
    ? cards.find((card) => card.id === reduceMotion.cardId) ?? null
    : null;
  const visibleCards = stagedSynthesis
    ? cards.filter((card) => card.id !== stagedSynthesis.id)
    : cards;
  const drainingIds = new Set(reduceMotion?.sourceCardIds ?? []);
  const sourceCards = reduceMotion
    ? visibleCards.filter((card) => reduceMotion.sourceCardIds.includes(card.id))
    : visibleCards;
  const otherCards = reduceMotion
    ? visibleCards.filter((card) => !reduceMotion.sourceCardIds.includes(card.id))
    : [];
  const sourceLaneCollapseStart = 0.82;
  const sourceLaneCollapseProgress = reduceMotion
    ? reduceMotion.phase === "draining"
      ? Math.min(
          1,
          Math.max(
            0,
            (reduceMotion.progress - sourceLaneCollapseStart) / (1 - sourceLaneCollapseStart)
          )
        )
      : 1
    : 0;
  const sourceLaneStyle = reduceMotion
    ? ({
        gridTemplateRows: `${Math.max(0, 1 - sourceLaneCollapseProgress)}fr`,
        opacity: Math.max(0, 1 - sourceLaneCollapseProgress * 1.2),
        transform: `translateY(${-sourceLaneCollapseProgress * 0.8}rem)`
      } satisfies CSSProperties)
    : undefined;

  function drainTextFor(card: Card) {
    const rollup = parseRollup(card.text);
    const parts = [
      rollup.headline,
      ...rollup.bullets.map((bullet) => `- ${bullet}`),
      rollup.trailing
    ].filter((part) => part.trim().length > 0);

    return parts.join("\n");
  }

  function displayTextFor(card: Card) {
    if (!reduceMotion) {
      return undefined;
    }

    if (reduceMotion.sourceCardIds.includes(card.id)) {
      if (reduceMotion.phase === "draining") {
        const drainText = drainTextFor(card);
        const keep = Math.max(0, Math.ceil(drainText.length * (1 - reduceMotion.progress)));
        return drainText.slice(0, keep);
      }

      return "";
    }

    return undefined;
  }

  function drainedTextFor(card: Card) {
    if (!reduceMotion || !reduceMotion.sourceCardIds.includes(card.id)) {
      return "";
    }

    const drainText = drainTextFor(card);

    if (!drainText || reduceMotion.phase !== "draining") {
      return "";
    }

    const keep = Math.max(0, Math.ceil(drainText.length * (1 - reduceMotion.progress)));
    return drainText.slice(keep);
  }

  function intakeTextForSynthesis() {
    if (!reduceMotion) {
      return "";
    }

    if (reduceMotion.phase === "settled") {
      return "";
    }

    if (reduceMotion.phase === "draining") {
      const drainedText = reduceMotion.sourceCardIds
        .map((id) => cards.find((card) => card.id === id))
        .filter((card): card is Card => Boolean(card))
        .map((card) => drainedTextFor(card))
        .filter((text) => text.length > 0)
        .join(" ");

      return drainedText.slice(-1200);
    }

    const combined = reduceMotion.sourceCardIds
      .map((id) => cards.find((card) => card.id === id))
      .filter((card): card is Card => Boolean(card))
      .map((card) => drainTextFor(card))
      .join(" ");

    if (!combined) {
      return "";
    }

    return combined.slice(-1200);
  }

  function renderCard(card: Card) {
    const selected = selectedIds.includes(card.id);
    const draining = drainingIds.has(card.id);

    return (
      <CardArticle
        key={card.id}
        card={card}
        selected={selected}
        staged={false}
        draining={draining}
        promoteOut={reduceMotion?.phase === "promoting" && draining}
        prominent={card.kind === "synthesis" && !card.collapsedIntoId}
        provenanceCards={card.parentIds
          .map((id) => cards.find((source) => source.id === id))
          .filter((source): source is Card => Boolean(source))}
        displayText={displayTextFor(card)}
        literalText={draining}
        drainFullText={draining ? drainTextFor(card) : undefined}
        drainProgress={draining ? reduceMotion?.progress ?? 0 : 0}
        cardRefs={cardRefs}
        suppressClickRef={suppressClickRef}
        onToggleSelection={onToggleSelection}
        onOpenCard={onOpenCard}
        onExpandCard={onExpandCard}
      />
    );
  }

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
        <div
          className={cx(
            "mx-auto grid w-full max-w-[80rem] transition-[grid-template-rows,opacity,transform] duration-700 ease-[cubic-bezier(.2,.8,.2,1)]",
            reduceMotion ? "overflow-hidden" : ""
          )}
          style={sourceLaneStyle}
          aria-hidden={sourceLaneCollapseProgress > 0.98 ? true : undefined}
        >
          <div className={cx("min-h-0", reduceMotion ? "overflow-hidden" : "")}>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4">
              {sourceCards.map(renderCard)}
            </div>
          </div>
        </div>

        {stagedSynthesis ? (
          <div className="mx-auto mt-2 flex w-full max-w-[80rem] justify-center px-2">
            <CardArticle
              card={stagedSynthesis}
              selected={false}
              staged
              draining={false}
              promoteOut={false}
              prominent
              provenanceCards={stagedSynthesis.parentIds
                .map((id) => cards.find((source) => source.id === id))
                .filter((source): source is Card => Boolean(source))}
              displayText={displayTextFor(stagedSynthesis)}
              literalText={false}
              intakeText={intakeTextForSynthesis()}
              suppressClickRef={suppressClickRef}
              onToggleSelection={onToggleSelection}
              onOpenCard={onOpenCard}
              onExpandCard={onExpandCard}
            />
          </div>
        ) : null}

        {otherCards.length > 0 ? (
          <div className="mx-auto mt-8 grid w-full max-w-[80rem] grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-5 opacity-65">
            {otherCards.map(renderCard)}
          </div>
        ) : null}
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
