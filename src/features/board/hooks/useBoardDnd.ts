"use client";

import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
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

      if (overData?.type === "column" || overData?.type === "card-add-zone") {
        // 빈 컬럼에 드롭하거나 카드 추가 영역에 드롭한 경우
        targetColumnId = overData.columnId!;
        const targetColumn = findColumnById(targetColumnId);
        // 카드 목록의 마지막 위치로 이동
        // 자기 자신이 이 컬럼에 있는 경우 카드 수에서 1을 빼야 함
        const selfInColumn =
          targetColumn?.cards.some((c) => c.id === activeId) ?? false;
        newOrder = selfInColumn
          ? (targetColumn?.cards.length ?? 1) - 1
          : (targetColumn?.cards.length ?? 0);
      } else {
        // 카드 위에 드롭한 경우
        const overColumn = findColumnByCardId(overId);

        if (!overColumn) {
          // 다른 컬럼의 빈 영역에 드롭한 경우 감지를 위해 columns에서 over.id로 시작하는 컬럼 찾기
          const droppableColumnId = String(overId).replace(
            "column-droppable-",
            ""
          );
          const droppableColumn = findColumnById(droppableColumnId);

          if (droppableColumn) {
            targetColumnId = droppableColumnId;
            // 자기 자신이 이 컬럼에 있는 경우 카드 수에서 1을 빼야 함
            const selfInColumn = droppableColumn.cards.some(
              (c) => c.id === activeId
            );
            newOrder = selfInColumn
              ? droppableColumn.cards.length - 1
              : droppableColumn.cards.length;
          } else {
            return; // 유효한 드롭 대상을 찾지 못함
          }
        } else {
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
        }
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

  return {
    activeItem,
    overId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  };
}
