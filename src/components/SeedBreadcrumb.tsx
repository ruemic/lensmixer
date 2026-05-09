"use client";

type SeedBreadcrumbProps = {
  question: string;
};

export function SeedBreadcrumb({ question }: SeedBreadcrumbProps) {
  if (!question.trim()) {
    return null;
  }

  return (
    <header className="flex items-center justify-center px-6 pt-6 pb-3">
      <p className="max-w-[60rem] truncate text-center text-base italic text-slate-500 dark:text-slate-400">
        &ldquo;{question}&rdquo;
      </p>
    </header>
  );
}
