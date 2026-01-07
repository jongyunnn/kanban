"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/features/card/types";
import { CardItem } from "@/features/card";
import { cn } from "@/lib/utils";

interface SortableCardProps {
  card: Card;
  onClick: () => void;
}

export function SortableCard({ card, onClick }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card: {
        id: card.id,
        columnId: card.columnId,
        title: card.title,
      },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "touch-none",
        isDragging && "opacity-50"
      )}
    >
      <CardItem card={card} onClick={onClick} />
    </div>
  );
}
