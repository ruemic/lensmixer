"use client";

import { type KeyboardEvent, useEffect, useRef } from "react";

type SeedComposerProps = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function SeedComposer({ value, disabled, onChange, onSubmit }: SeedComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (disabled || value.trim().length === 0) {
      return;
    }

    onSubmit();
  }

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-12">
      <div className="w-full max-w-[48rem] rounded-3xl border border-slate-200/80 bg-white p-10 shadow-[0_40px_120px_rgba(15,23,42,0.10)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <textarea
          ref={textareaRef}
          className="block w-full resize-none border-0 bg-transparent text-4xl font-medium leading-snug tracking-tight text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:opacity-60 dark:text-slate-50 dark:placeholder:text-slate-500"
          placeholder="What do you want to think about?"
          value={value}
          rows={4}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />
        <div className="mt-8 flex items-center justify-end gap-2 text-sm text-slate-400 dark:text-slate-500">
          <kbd className="inline-flex h-6 items-center rounded border border-slate-200 bg-slate-50 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950">
            ↵
          </kbd>
          <span>to begin</span>
        </div>
      </div>
    </div>
  );
}
