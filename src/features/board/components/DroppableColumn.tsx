"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { memo, useMemo } from "react";
import { Card } from "@/features/card/types";
import { ColumnItem } from "@/features/column";
import { Column } from "@/features/column/types";
import { cn } from "@/lib/utils";
import { ActiveDragItem } from "../types";
import { DroppableCardAddZone } from "./DroppableCardAddZone";
import { SortableCard } from "./SortableCard";

interface DroppableColumnProps {
  column: Column;
  onCardClick: (card: Card) => void;
  activeItem: ActiveDragItem | null;
  overId?: string | null;
}

export const DroppableColumn = memo(function DroppableColumn({
  column,
  onCardClick,
  activeItem,
  overId,
}: DroppableColumnProps) {
  // 컬럼 정렬용 sortable
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column: {
        id: column.id,
        title: column.title,
        order: column.order,
      },
    },
    transition: {
      duration: 0,
      easing: "ease-out",
    },
  });

  // 카드 드롭 영역용 droppable
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `column-droppable-${column.id}`,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  // 카드 ID 목록 계산 (드래그 중인 카드가 이 컬럼으로 이동 중이면 포함)
  const cardIds = useMemo(() => {
    const baseCardIds = column.cards.map((card) => card.id);
    return activeItem?.type === "card" &&
      activeItem.columnId === column.id &&
      !baseCardIds.includes(activeItem.id)
      ? [...baseCardIds, activeItem.id]
      : baseCardIds;
  }, [column.cards, activeItem, column.id]);

  // 현재 드래그 중인 카드 ID
  const activeCardId = useMemo(
    () => (activeItem?.type === "card" ? activeItem.id : null),
    [activeItem]
  );

  const isCardDrag = activeItem?.type === "card";

  // 컬럼은 드래그 시 위치 변경 애니메이션 적용
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setSortableRef}
      style={style}
      className={cn(isDragging && "opacity-50")}
    >
      <ColumnItem column={column} dragHandleProps={{ attributes, listeners }}>
        <div
          ref={setDroppableRef}
          className={cn(
            "min-h-[100px] rounded-md",
            isOver && column.cards.length === 0 && "bg-primary/5"
          )}
        >
          <SortableContext
            items={cardIds}
            strategy={verticalListSortingStrategy}
          >
            {column.cards.length === 0 ? (
              <div className="py-4">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  카드를 추가해보세요
                </p>
                <DroppableCardAddZone
                  columnId={column.id}
                  isCardDrag={isCardDrag}
                />
              </div>
            ) : (
              <div className="space-y-2">
                {column.cards.map((card) => (
                  <SortableCard
                    key={card.id}
                    card={card}
                    onClick={() => onCardClick(card)}
                    activeCardId={activeCardId}
                    overId={overId}
                  />
                ))}
                <DroppableCardAddZone
                  columnId={column.id}
                  isCardDrag={isCardDrag}
                />
              </div>
            )}
          </SortableContext>
        </div>
      </ColumnItem>
    </div>
  );
});

DroppableColumn.displayName = "DroppableColumn";
