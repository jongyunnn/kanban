"use client";

import { useSortable } from "@dnd-kit/sortable";
import { memo } from "react";
import { CardItem } from "@/features/card";
import { Card } from "@/features/card/types";
import { cn } from "@/lib/utils";

interface SortableCardProps {
  card: Card;
  activeCardId?: string | null;
  overId?: string | null;
}

// 드래그 중 다른 카드들이 움직이지 않도록 설정
const animateLayoutChanges = () => false;

export const SortableCard = memo(function SortableCard({
  card,
  activeCardId,
  overId,
}: SortableCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card: {
        id: card.id,
        columnId: card.columnId,
        title: card.title,
      },
    },
    animateLayoutChanges,
  });

  // 다른 카드가 드래그 중이고, 이 카드 위에 올라와 있는지 확인
  const isDropTarget =
    activeCardId && activeCardId !== card.id && overId === card.id;

  return (
    <div className="relative">
      {/* 드롭 위치 인디케이터 - CSS opacity로 전환하여 마운트/언마운트 방지 */}
      <div
        className={cn(
          "absolute -top-1 left-0 right-0 h-0.5 bg-primary rounded-full z-10 transition-opacity duration-150",
          isDropTarget ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={cn("touch-none", isDragging && "opacity-40")}
      >
        <CardItem card={card} />
      </div>
    </div>
  );
});
