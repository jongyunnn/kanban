"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useColumns } from "@/features/column/hooks";
import { ColumnAddButton } from "@/features/column";
import { CardDetailModal } from "@/features/card";
import { useModalStore } from "@/stores";
import { useBoardDnd } from "../hooks";
import { DroppableColumn } from "./DroppableColumn";
import { CardDragOverlay } from "./CardDragOverlay";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

function BoardSkeleton() {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex-shrink-0 w-72">
          <Skeleton className="h-10 w-full mb-4 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface BoardErrorProps {
  onRetry: () => void;
}

function BoardError({ onRetry }: BoardErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="w-6 h-6" />
        <p className="text-lg font-medium">컬럼을 불러오는 중 오류가 발생했습니다.</p>
      </div>
      <p className="text-muted-foreground text-sm">
        네트워크 연결을 확인하고 다시 시도해주세요.
      </p>
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <RefreshCw className="w-4 h-4" />
        다시 시도
      </Button>
    </div>
  );
}

function EmptyBoard() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p className="text-muted-foreground text-lg">
        아직 컬럼이 없습니다. 첫 번째 컬럼을 추가해보세요!
      </p>
      <ColumnAddButton />
    </div>
  );
}

export function BoardContainer() {
  const { data: columns, isLoading, error, refetch } = useColumns();
  const { openCardModal, selectedCard, isCardModalOpen, closeCardModal } = useModalStore();

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

  if (isLoading) {
    return <BoardSkeleton />;
  }

  if (error) {
    return <BoardError onRetry={() => refetch()} />;
  }

  if (!columns || columns.length === 0) {
    return <EmptyBoard />;
  }

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
        <ScrollArea className="h-full">
          <div className="flex gap-4 p-4 w-max h-[calc(100dvh-56px)]">
            {columns.map((column) => (
              <DroppableColumn
                key={column.id}
                column={column}
                onCardClick={openCardModal}
              />
            ))}
            <div className="shrink-0">
              <ColumnAddButton />
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <CardDragOverlay activeItem={activeItem} />
      </DndContext>

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          open={isCardModalOpen}
          onOpenChange={(open) => {
            if (!open) closeCardModal();
          }}
        />
      )}
    </>
  );
}
