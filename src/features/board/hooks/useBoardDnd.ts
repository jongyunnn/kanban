"use client";

import {
  CollisionDetection,
  closestCenter,
  closestCorners,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  pointerWithin,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useState } from "react";
import { useMoveCard } from "@/features/card/hooks";
import { useMoveColumn } from "@/features/column/hooks";
import { Column } from "@/features/column/types";
import {
  ActiveDragItem,
  CardDragData,
  ColumnDragData,
  DragData,
} from "../types";

interface UseBoardDndProps {
  columns: Column[];
}

export function useBoardDnd({ columns }: UseBoardDndProps) {
  const [activeItem, setActiveItem] = useState<ActiveDragItem | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const moveCard = useMoveCard();
  const moveColumn = useMoveColumn();

  // 카드가 속한 컬럼 찾기
  const findColumnByCardId = useCallback(
    (cardId: UniqueIdentifier): Column | undefined => {
      return columns.find((column) =>
        column.cards.some((card) => card.id === cardId)
      );
    },
    [columns]
  );

  // 컬럼 ID로 컬럼 찾기
  const findColumnById = useCallback(
    (columnId: string): Column | undefined => {
      return columns.find((column) => column.id === columnId);
    },
    [columns]
  );

  // 드래그 시작
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as DragData;

    if (data?.type === "card") {
      const cardData = data as CardDragData;
      setActiveItem({
        id: cardData.card.id,
        type: "card",
        columnId: cardData.card.columnId,
        title: cardData.card.title,
      });
    } else if (data?.type === "column") {
      const columnData = data as ColumnDragData;
      setActiveItem({
        id: columnData.column.id,
        type: "column",
        title: columnData.column.title,
        order: columnData.column.order,
      });
    }
  }, []);

  // 드래그 중 (다른 컬럼 위로 이동 시)
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) {
        setOverId(null);
        return;
      }

      const activeId = active.id;
      const currentOverId = over.id;

      // over 대상 ID 업데이트 (카드 드래그 시에만)
      const activeData = active.data.current as DragData;
      if (activeData?.type === "card") {
        setOverId(currentOverId as string);
      }

      if (activeId === currentOverId) return;

      if (activeData?.type !== "card") return;

      // over가 컬럼인지 카드인지 카드 추가 영역인지 확인
      const overData = over.data.current as {
        type?: string;
        columnId?: string;
      };

      // 현재 위치한 컬럼 ID 결정
      let targetColumnId: string | undefined;

      if (overData?.type === "column" || overData?.type === "card-add-zone") {
        // 빈 컬럼 위에 있거나 카드 추가 영역 위에 있는 경우
        targetColumnId = overData.columnId;
      } else {
        // 다른 카드 위에 있는 경우
        const overColumn = findColumnByCardId(currentOverId);
        targetColumnId = overColumn?.id;
      }

      if (!targetColumnId) return;

      // activeItem의 columnId 업데이트 (카드 드래그 시에만)
      setActiveItem((prev) => {
        if (!prev || prev.type !== "card") return prev;
        if (prev.columnId === targetColumnId) return prev;
        return { ...prev, columnId: targetColumnId };
      });
    },
    [findColumnByCardId]
  );

  // 드래그 종료
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveItem(null);
      setOverId(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id;

      const activeData = active.data.current as DragData;

      // 컬럼 드래그 종료 처리
      if (activeData?.type === "column") {
        const overData = over.data.current as {
          type?: string;
          column?: { id: string; order: number };
          columnId?: string;
          card?: { columnId: string };
        };

        // over 대상에서 컬럼 ID 추출
        let targetColumnId: string | undefined;

        if (overData?.type === "column") {
          // sortable column 위에 드롭 (column 객체가 있는 경우)
          if (overData.column) {
            targetColumnId = overData.column.id;
          }
          // droppable zone 위에 드롭 (columnId만 있는 경우)
          else if (overData.columnId) {
            targetColumnId = overData.columnId;
          }
        } else if (overData?.type === "card" && overData.card) {
          // 카드 위에 드롭한 경우 - 해당 카드의 컬럼 ID 사용
          targetColumnId = overData.card.columnId;
        }

        if (!targetColumnId || targetColumnId === activeId) return;

        const activeColumn = columns.find((c) => c.id === activeId);
        const overColumn = columns.find((c) => c.id === targetColumnId);

        if (
          activeColumn &&
          overColumn &&
          activeColumn.order !== overColumn.order
        ) {
          moveColumn.mutate({
            id: activeId,
            newOrder: overColumn.order,
          });
        }
        return;
      }

      // 카드 드래그 종료 처리
      if (activeData?.type !== "card") return;

      const cardData = activeData as CardDragData;
      const sourceColumnId = cardData.card.columnId;
      const sourceColumn = findColumnById(sourceColumnId);
      if (!sourceColumn) return;

      // over가 컬럼인지 카드인지 확인
      const overData = over.data.current as {
        type?: string;
        columnId?: string;
      };

      let targetColumnId: string;
      let newOrder: number;

      // 인디케이터가 표시되는 영역에서만 드롭 허용 (카드 위 또는 카드 추가 영역)
      if (overData?.type === "card-add-zone") {
        // 카드 추가 영역에 드롭한 경우 - 컬럼 마지막 위치로 이동
        targetColumnId = overData.columnId!;
        const targetColumn = findColumnById(targetColumnId);
        // 자기 자신이 이 컬럼에 있는 경우 카드 수에서 1을 빼야 함
        const selfInColumn =
          targetColumn?.cards.some((c) => c.id === activeId) ?? false;
        newOrder = selfInColumn
          ? (targetColumn?.cards.length ?? 1) - 1
          : (targetColumn?.cards.length ?? 0);
      } else if (overData?.type === "card") {
        // 카드 위에 드롭한 경우
        const overColumn = findColumnByCardId(overId);

        if (!overColumn) {
          return; // 유효한 드롭 대상을 찾지 못함
        }

        targetColumnId = overColumn.id;
        const overCardIndex = overColumn.cards.findIndex(
          (c) => c.id === overId
        );

        if (sourceColumnId === targetColumnId) {
          // 같은 컬럼 내 이동
          const oldIndex = sourceColumn.cards.findIndex(
            (c) => c.id === activeId
          );
          const newCards = arrayMove(
            sourceColumn.cards,
            oldIndex,
            overCardIndex
          );
          newOrder = newCards.findIndex((c) => c.id === activeId);
        } else {
          // 다른 컬럼으로 이동
          newOrder = overCardIndex;
        }
      } else if (overData?.type === "column") {
        // 빈 컬럼에 드롭한 경우 - 빈 컬럼일 때만 허용
        targetColumnId = overData.columnId!;
        const targetColumn = findColumnById(targetColumnId);

        // 빈 컬럼이 아니면 드롭 무시
        if (targetColumn && targetColumn.cards.length > 0) {
          return;
        }

        newOrder = 0;
      } else {
        // 그 외 인디케이터가 표시되지 않는 영역 - 드롭 무시
        return;
      }

      // 위치가 변경된 경우에만 API 호출
      const currentColumn = findColumnByCardId(activeId);
      const currentIndex =
        currentColumn?.cards.findIndex((c) => c.id === activeId) ?? -1;

      const isSamePosition =
        sourceColumnId === targetColumnId && currentIndex === newOrder;

      if (!isSamePosition) {
        moveCard.mutate({
          id: activeId,
          data: {
            target_column_id: targetColumnId,
            new_order: newOrder,
          },
        });
      }
    },
    [columns, findColumnById, findColumnByCardId, moveCard, moveColumn]
  );

  // 드래그 취소 (ESC 키)
  const handleDragCancel = useCallback(() => {
    setActiveItem(null);
    setOverId(null);
  }, []);

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

  return {
    activeItem,
    overId,
    collisionDetection,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
