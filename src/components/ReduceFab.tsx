"use client";

import { Sparkles } from "lucide-react";

type ReduceFabProps = {
  count: number;
  disabled: boolean;
  onClick: () => void;
};

export function ReduceFab({ count, disabled, onClick }: ReduceFabProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex justify-center">
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 text-lg font-bold text-white shadow-[0_24px_60px_rgba(124,58,237,0.45)] outline-none transition-transform hover:-translate-y-0.5 hover:bg-violet-500 focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
      >
        <Sparkles size={20} aria-hidden="true" />
        Reduce {count} cards
      </button>
    </div>
  );
}
