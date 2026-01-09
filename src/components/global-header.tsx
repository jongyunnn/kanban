"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { QuickAddTaskButton } from "@/features/card/components/QuickAddTaskButton";

export function GlobalHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 border-b px-4 h-14 flex items-center justify-between bg-background">
      <h1 className="text-xl font-bold">칸반 보드</h1>
      <div className="flex items-center gap-2">
        <QuickAddTaskButton />
        <ThemeToggle />
      </div>
    </header>
  );
}
