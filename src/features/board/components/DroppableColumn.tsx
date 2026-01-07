"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column } from "@/features/column/types";
import { Card } from "@/features/card/types";
import { ColumnItem } from "@/features/column";
import { CardAddButton } from "@/features/card";
import { SortableCard } from "./SortableCard";
import { cn } from "@/lib/utils";

interface DroppableColumnProps {
  column: Column;
  onCardClick: (card: Card) => void;
}

export function DroppableColumn({ column, onCardClick }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  const cardIds = column.cards.map((card) => card.id);

  return (
    <ColumnItem column={column}>
      <div
        ref={setNodeRef}
        className={cn(
          "min-h-[100px] transition-colors rounded-md",
          isOver && "bg-primary/5"
        )}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {column.cards.length === 0 ? (
            <div className="py-4">
              <p className="text-sm text-muted-foreground text-center mb-4">
                카드를 추가해보세요
              </p>
              <CardAddButton columnId={column.id} />
            </div>
          ) : (
            <div className="space-y-2">
              {column.cards.map((card) => (
                <SortableCard
                  key={card.id}
                  card={card}
                  onClick={() => onCardClick(card)}
                />
              ))}
              <CardAddButton columnId={column.id} />
            </div>
          )}
        </SortableContext>
      </div>
    </ColumnItem>
  );
}
