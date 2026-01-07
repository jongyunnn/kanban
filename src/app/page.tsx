"use client";

import { BoardContainer } from "@/features/board";

export default function Home() {
  return (
    <main className="h-screen bg-background">
      <header className="border-b px-4 py-3">
        <h1 className="text-xl font-bold">칸반 보드</h1>
      </header>
      <div className="h-[calc(100vh-57px)]">
        <BoardContainer />
      </div>
    </main>
  );
}
