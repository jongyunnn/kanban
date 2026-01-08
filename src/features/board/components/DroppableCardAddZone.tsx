"use client";

import { useDroppable } from "@dnd-kit/core";
import { memo } from "react";
import { CardAddButton } from "@/features/card";
import { cn } from "@/lib/utils";

interface DroppableCardAddZoneProps {
  columnId: string;
  isCardDrag: boolean;
}

export const DroppableCardAddZone = memo(function DroppableCardAddZone({
  columnId,
  isCardDrag,
}: DroppableCardAddZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `card-add-zone-${columnId}`,
    data: {
      type: "card-add-zone",
      columnId: columnId,
    },
  });

  const showIndicator = isOver && isCardDrag;

  return (
    <div ref={setNodeRef} className="relative">
      {/* 드롭 인디케이터 - 카드 추가 버튼 위에만 표시 */}
      <div
        className={cn(
          "absolute -top-1 left-0 right-0 h-0.5 bg-primary rounded-full z-10 transition-opacity duration-150",
          showIndicator ? "opacity-100" : "opacity-0"
        )}
      />
      <CardAddButton columnId={columnId} />
    </div>
  );
});

DroppableCardAddZone.displayName = "DroppableCardAddZone";
