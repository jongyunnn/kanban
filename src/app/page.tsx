"use client";

import { GlobalHeader } from "@/components/global-header";
import { BoardContainer } from "@/features/board";

export default function Home() {
  return (
    <>
      <GlobalHeader />
      <main className="h-100dvh bg-background pt-14">
        <BoardContainer />
      </main>
    </>
  );
}
