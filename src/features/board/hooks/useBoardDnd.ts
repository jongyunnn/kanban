"use client";

import { useState, useCallback } from "react";
import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column } from "@/features/column/types";
import { useMoveCard } from "@/features/card/hooks";
import { ActiveDragItem, DragData } from "../types";

interface UseBoardDndProps {
  columns: Column[];
}

export function useBoardDnd({ columns }: UseBoardDndProps) {
  const [activeItem, setActiveItem] = useState<ActiveDragItem | null>(null);
  const moveCard = useMoveCard();

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
      setActiveItem({
        id: data.card.id,
        type: "card",
        columnId: data.card.columnId,
        title: data.card.title,
      });
    }
  }, []);

  // 드래그 중 (다른 컬럼 위로 이동 시)
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeData = active.data.current as DragData;
    if (activeData?.type !== "card") return;

    // over가 컬럼인지 카드인지 확인
    const overData = over.data.current as { type?: string; columnId?: string };

    // 현재 위치한 컬럼 ID 결정
    let targetColumnId: string | undefined;

    if (overData?.type === "column") {
      // 빈 컬럼 위에 있는 경우
      targetColumnId = overData.columnId;
    } else {
      // 다른 카드 위에 있는 경우
      const overColumn = findColumnByCardId(overId);
      targetColumnId = overColumn?.id;
    }

    if (!targetColumnId) return;

    // activeItem의 columnId 업데이트
    setActiveItem((prev) => {
      if (!prev) return prev;
      if (prev.columnId === targetColumnId) return prev;
      return { ...prev, columnId: targetColumnId };
    });
  }, [findColumnByCardId]);

  // 드래그 종료
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveItem(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id;

      const activeData = active.data.current as DragData;
      if (activeData?.type !== "card") return;

      const sourceColumnId = activeData.card.columnId;
      const sourceColumn = findColumnById(sourceColumnId);
      if (!sourceColumn) return;

      // over가 컬럼인지 카드인지 확인
      const overData = over.data.current as { type?: string; columnId?: string };

      let targetColumnId: string;
      let newOrder: number;

      if (overData?.type === "column") {
        // 빈 컬럼에 드롭한 경우
        targetColumnId = overData.columnId!;
        newOrder = 0;
      } else {
        // 카드 위에 드롭한 경우
        const overColumn = findColumnByCardId(overId);
        if (!overColumn) return;

        targetColumnId = overColumn.id;
        const overCardIndex = overColumn.cards.findIndex((c) => c.id === overId);

        if (sourceColumnId === targetColumnId) {
          // 같은 컬럼 내 이동
          const oldIndex = sourceColumn.cards.findIndex((c) => c.id === activeId);
          const newCards = arrayMove(sourceColumn.cards, oldIndex, overCardIndex);
          newOrder = newCards.findIndex((c) => c.id === activeId);
        } else {
          // 다른 컬럼으로 이동
          newOrder = overCardIndex;
        }
      }

      // 위치가 변경된 경우에만 API 호출
      const currentColumn = findColumnByCardId(activeId);
      const currentIndex = currentColumn?.cards.findIndex((c) => c.id === activeId) ?? -1;

      const isSamePosition =
        sourceColumnId === targetColumnId &&
        currentIndex === newOrder;

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
    [findColumnById, findColumnByCardId, moveCard]
  );

  // 드래그 취소 (ESC 키)
  const handleDragCancel = useCallback(() => {
    setActiveItem(null);
  }, []);

  return {
    activeItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
