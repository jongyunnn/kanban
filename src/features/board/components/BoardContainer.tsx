"use client";

import {
  closestCenter,
  closestCorners,
  DndContext,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { CollisionDetection } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CardDetailModal } from "@/features/card";
import { ColumnAddButton } from "@/features/column";
import { useColumns } from "@/features/column/hooks";
import { useModalStore } from "@/stores";
import { useBoardDnd } from "../hooks";
import { CardDragOverlay } from "./CardDragOverlay";
import { DroppableColumn } from "./DroppableColumn";

function BoardSkeleton() {
  return (
    <div className="flex gap-4 p-4 overflow-x-auto">
      {[1, 2, 3].map((i) => (
        <div key={i} className="shrink-0 w-72">
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
        <p className="text-lg font-medium">
          컬럼을 불러오는 중 오류가 발생했습니다.
        </p>
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
  const { openCardModal, selectedCard, isCardModalOpen, closeCardModal } =
    useModalStore();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    activeItem,
    overId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useBoardDnd({ columns: columns ?? [] });

  const handleCardModalOpenChange = useCallback(
    (open: boolean) => {
      if (!open) closeCardModal();
    },
    [closeCardModal]
  );

  // 드래그 타입에 따른 커스텀 collision detection
  const collisionDetection: CollisionDetection = useCallback(
    (args) => {
      // 컬럼 드래그 시: 컬럼만 대상으로 closestCenter 사용
      if (activeItem?.type === "column") {
        const columnCollisions = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => {
            const data = container.data.current as
              | { type?: string; column?: unknown }
              | undefined;
            return data?.type === "column" && data?.column;
          }),
        });
        return columnCollisions;
      }

      // 카드 드래그 시: pointerWithin 우선, 카드 타입 충돌을 우선시
      const pointerCollisions = pointerWithin(args);

      if (pointerCollisions.length > 0) {
        // 카드 타입 충돌을 우선시 (카드 위에 hover 시 카드 인디케이터 표시)
        const cardCollision = pointerCollisions.find((collision) => {
          const container = args.droppableContainers.find(
            (c) => c.id === collision.id
          );
          const data = container?.data.current as { type?: string } | undefined;
          return data?.type === "card";
        });

        if (cardCollision) {
          return [cardCollision];
        }

        // 카드 충돌이 없으면 첫 번째 충돌 사용 (컬럼 droppable 등)
        return pointerCollisions;
      }

      return closestCorners(args);
    },
    [activeItem]
  );

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
        collisionDetection={collisionDetection}
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
            <SortableContext
              items={columns.map((c) => c.id)}
              strategy={horizontalListSortingStrategy}
            >
              {columns.map((column) => (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  onCardClick={openCardModal}
                  activeItem={activeItem}
                  overId={overId}
                />
              ))}
            </SortableContext>
            <div className="shrink-0">
              <ColumnAddButton />
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <CardDragOverlay
          activeItem={activeItem}
          activeCard={
            activeItem?.type === "card"
              ? columns
                  ?.flatMap((c) => c.cards)
                  .find((c) => c.id === activeItem.id)
              : null
          }
        />
      </DndContext>

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          open={isCardModalOpen}
          onOpenChange={handleCardModalOpenChange}
        />
      )}
    </>
  );
}
