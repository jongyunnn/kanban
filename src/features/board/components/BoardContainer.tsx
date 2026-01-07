"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useColumns } from "@/features/column/hooks";
import { ColumnAddButton } from "@/features/column";
import { CardDetailModal } from "@/features/card";
import { Card } from "@/features/card/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DroppableColumn } from "./DroppableColumn";
import { CardDragOverlay } from "./CardDragOverlay";
import { useBoardDnd } from "../hooks";

export function BoardContainer() {
  const { data: columns, isLoading, error } = useColumns();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    activeItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useBoardDnd({ columns: columns ?? [] });

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const handleCloseModal = (open: boolean) => {
    setShowCardModal(open);
    if (!open) {
      setSelectedCard(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 p-4 overflow-x-auto h-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-72 shrink-0 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        <p>컬럼을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  const hasColumns = columns && columns.length > 0;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
      >
        <div className="flex gap-4 p-4 overflow-x-auto h-full">
          {hasColumns ? (
            <>
              {columns.map((column) => (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  onCardClick={handleCardClick}
                />
              ))}
              <ColumnAddButton />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-64 gap-4">
              <p className="text-muted-foreground">
                첫 번째 컬럼을 추가해보세요
              </p>
              <ColumnAddButton />
            </div>
          )}
        </div>

        <CardDragOverlay activeItem={activeItem} />
      </DndContext>

      <CardDetailModal
        open={showCardModal}
        onOpenChange={handleCloseModal}
        card={selectedCard}
      />
    </>
  );
}
