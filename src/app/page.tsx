"use client";

import { BoardContainer } from "@/features/board";

export default function Home() {
  return (
    <div className="-mx-4 -mt-10 -mb-32 min-h-screen flex flex-col bg-background">
      <header className="border-b px-4 py-3 shrink-0">
        <h1 className="text-xl font-bold">칸반 보드</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <BoardContainer />
      </div>
    </div>
  );
}
