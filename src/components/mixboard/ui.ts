import { EventType, type AGUIEvent } from "@ag-ui/core";
import type { CardKind } from "@/lib/mixboard/kernel";

export type EventLogEntry = {
  id: string;
  label: string;
  event: AGUIEvent;
};

export type MarqueeState = {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  additive: boolean;
};

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export const panelClass =
  "rounded-lg border border-slate-200 bg-white shadow-[0_18px_50px_rgba(29,36,48,0.08)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)]";
export const labelClass =
  "text-[11px] font-bold uppercase tracking-normal text-slate-500 dark:text-slate-400";
export const textareaClass =
  "min-h-28 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm leading-relaxed text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";
export const secondaryButtonClass =
  "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800";
export const neutralPillClass =
  "rounded-full bg-slate-100 px-2 py-1 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300";

export function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function marqueeRect(marquee: MarqueeState) {
  const left = Math.min(marquee.startX, marquee.currentX);
  const top = Math.min(marquee.startY, marquee.currentY);
  const width = Math.abs(marquee.currentX - marquee.startX);
  const height = Math.abs(marquee.currentY - marquee.startY);

  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height
  };
}

export function intersects(a: Rect, b: Rect) {
  return a.left <= b.right && a.right >= b.left && a.top <= b.bottom && a.bottom >= b.top;
}

// Marquee should not start when the pointer-down lands on a card or interactive
// element. If it does, setPointerCapture on the canvas redirects the subsequent
// click away from the card, so onClick never fires.
export function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest("article, button, input, textarea, select, a"))
  );
}

export function nodeTone(kind: CardKind) {
  switch (kind) {
    case "seed":
      return "bg-gradient-to-b from-white to-orange-50 dark:from-slate-900 dark:to-slate-950";
    case "lens":
      return "bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/45";
    case "synthesis":
      return "bg-gradient-to-b from-white to-violet-50 dark:from-slate-900 dark:to-violet-950/45";
  }
}

export function aguiEventTitle(event: AGUIEvent) {
  if (event.type === EventType.CUSTOM) {
    return String(event.name);
  }

  if (event.type === EventType.TEXT_MESSAGE_START || event.type === EventType.TEXT_MESSAGE_END) {
    return String(event.name ?? event.messageId);
  }

  if (event.type === EventType.TEXT_MESSAGE_CONTENT) {
    return String(event.messageId);
  }

  if (event.type === EventType.RUN_STARTED || event.type === EventType.RUN_FINISHED) {
    return String(event.runId);
  }

  return String(event.type);
}

export function aguiEventDetail(event: AGUIEvent) {
  if (event.type === EventType.TEXT_MESSAGE_CONTENT) {
    return String(event.delta);
  }

  if (event.type === EventType.RUN_ERROR) {
    return String(event.message);
  }

  if (event.type === EventType.STATE_DELTA) {
    return `${event.delta.length} operation${event.delta.length === 1 ? "" : "s"}`;
  }

  if (event.type === EventType.CUSTOM && event.value && typeof event.value === "object") {
    const keys = Object.keys(event.value).slice(0, 3);
    return keys.join(", ");
  }

  return "";
}
