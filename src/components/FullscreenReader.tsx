"use client";

import MarkdownIt from "markdown-it";
import { AlertTriangle, X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import type { Card } from "@/lib/mixboard/kernel";
import { parseRollup } from "@/lib/gemini/rollup";
import { cx } from "./mixboard/ui";

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: false
});

type FullscreenReaderProps = {
  card: Card;
  onClose: () => void;
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

export function FullscreenReader({ card, onClose }: FullscreenReaderProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const rollup = parseRollup(card.text);
  const bodyHtml = useMemo(
    () => (rollup.body.trim() ? md.render(rollup.body) : ""),
    [rollup.body]
  );
  const inFlight = card.status === "queued" || card.status === "streaming";
  const label = card.kind === "synthesis" ? "Synthesis" : card.lensName ?? "Card";
  const showCaret = card.status === "streaming";
  const isFailed = card.status === "failed";
  const isSafety = isFailed && card.error?.kind === "safety";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/85 px-6 py-12 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reader-headline"
      aria-busy={inFlight}
      onClick={onClose}
    >
      <article
        className="relative my-auto w-full max-w-[60rem] rounded-3xl border border-slate-800 bg-slate-900 px-12 py-14 shadow-[0_60px_180px_rgba(0,0,0,0.6)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Close reader"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <span className="text-base font-semibold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </span>

        <h1
          id="reader-headline"
          className={cx(
            "mt-5 text-balance text-5xl font-bold leading-[1.1] tracking-tight",
            isFailed
              ? isSafety
                ? "text-amber-300"
                : "text-rose-400"
              : "text-slate-50"
          )}
        >
          {isFailed ? (
            <span className="inline-flex items-center gap-4">
              <AlertTriangle size={44} aria-hidden="true" className="shrink-0" />
              <span>{failedHeadline(card)}</span>
            </span>
          ) : rollup.headline ? (
            <>
              {rollup.headline}
              {showCaret && rollup.bullets.length === 0 && !rollup.trailing ? (
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block h-[0.85em] w-[4px] animate-pulse bg-current align-middle"
                />
              ) : null}
            </>
          ) : inFlight ? (
            <span className="text-slate-500">Streaming…</span>
          ) : (
            label
          )}
        </h1>

        {rollup.bullets.length > 0 ? (
          <ul
            className="mt-12 flex flex-col gap-6 text-2xl leading-relaxed text-slate-200"
            aria-live="polite"
          >
            {rollup.bullets.map((bullet, index) => (
              <li key={index} className="flex gap-5">
                <span
                  className="mt-[0.7em] size-2.5 shrink-0 rounded-full bg-current opacity-50"
                  aria-hidden="true"
                />
                <span>
                  {bullet}
                  {showCaret && index === rollup.bullets.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="ml-1 inline-block h-[0.85em] w-[3px] animate-pulse bg-current align-middle"
                    />
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {rollup.bullets.length === 0 && rollup.trailing ? (
          <p
            className="mt-12 text-2xl leading-relaxed text-slate-200"
            aria-live="polite"
          >
            {rollup.trailing}
          </p>
        ) : null}

        {bodyHtml ? (
          <div
            className="markdown-body mt-14 border-t border-slate-800 pt-10 text-xl leading-relaxed text-slate-300"
            aria-live="polite"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : inFlight && rollup.bullets.length > 0 ? (
          <p
            className="mt-14 border-t border-slate-800 pt-10 text-base text-slate-500"
            aria-live="polite"
          >
            Supporting reasoning streaming&hellip;
          </p>
        ) : null}

        {isFailed && card.error ? (
          <div className="mt-12 flex flex-col gap-4 text-2xl leading-relaxed text-slate-300">
            <p>{card.error.message}</p>
            {card.error.detail && card.error.detail !== card.error.message ? (
              <p className="text-base text-slate-500">{card.error.detail}</p>
            ) : null}
            {isSafety ? (
              <p className="text-base text-slate-500">
                Try rephrasing the question, or pick a different lens. Dissent often gets through where Base case won&rsquo;t.
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-14 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
          <kbd className="inline-flex h-6 items-center rounded border border-slate-700 bg-slate-950 px-2 font-mono text-xs">
            Esc
          </kbd>
          <span>to close</span>
        </div>
      </article>
    </div>
  );
}
