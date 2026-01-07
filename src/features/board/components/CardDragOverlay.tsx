"use client";

import { DragOverlay } from "@dnd-kit/core";
import { ActiveDragItem } from "../types";

interface CardDragOverlayProps {
  activeItem: ActiveDragItem | null;
}

export function CardDragOverlay({ activeItem }: CardDragOverlayProps) {
  if (!activeItem) return null;

  return (
    <DragOverlay>
      <div className="bg-background rounded-md p-3 shadow-lg border-2 border-primary rotate-3 opacity-90">
        <p className="text-sm font-medium line-clamp-2">{activeItem.title}</p>
      </div>
    </DragOverlay>
  );
}
