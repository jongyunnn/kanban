"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { moveCard } from "../api";
import { Card, MoveCardRequest } from "../types";
import { COLUMNS_QUERY_KEY } from "@/features/column/hooks";
import { Column } from "@/features/column/types";

interface MoveCardVariables {
  id: string;
  data: MoveCardRequest;
}

export function useMoveCard() {
  const queryClient = useQueryClient();

  return useMutation<Card, Error, MoveCardVariables, { previousColumns: Column[] | undefined }>({
    mutationFn: ({ id, data }) => moveCard(id, data),

    // 낙관적 업데이트
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: COLUMNS_QUERY_KEY });

      const previousColumns = queryClient.getQueryData<Column[]>(COLUMNS_QUERY_KEY);

      queryClient.setQueryData<Column[]>(COLUMNS_QUERY_KEY, (oldColumns) => {
        if (!oldColumns) return oldColumns;

        // 카드 찾기
        let movedCard: Column["cards"][0] | undefined;
        let sourceColumnId: string | undefined;

        for (const column of oldColumns) {
          const card = column.cards.find((c) => c.id === id);
          if (card) {
            movedCard = card;
            sourceColumnId = column.id;
            break;
          }
        }

        if (!movedCard || !sourceColumnId) return oldColumns;

        return oldColumns.map((column) => {
          // 원본 컬럼에서 카드 제거
          if (column.id === sourceColumnId) {
            const filteredCards = column.cards
              .filter((c) => c.id !== id)
              .map((c, index) => ({ ...c, order: index }));

            // 같은 컬럼 내 이동인 경우
            if (column.id === data.target_column_id) {
              const updatedCard = { ...movedCard, order: data.new_order, updatedAt: new Date().toISOString() };
              const newCards = [...filteredCards];
              newCards.splice(data.new_order, 0, updatedCard);
              return {
                ...column,
                cards: newCards.map((c, index) => ({ ...c, order: index })),
              };
            }

            return {
              ...column,
              cards: filteredCards,
            };
          }

          // 대상 컬럼에 카드 추가 (다른 컬럼으로 이동하는 경우)
          if (column.id === data.target_column_id && sourceColumnId !== data.target_column_id) {
            const updatedCard = {
              ...movedCard,
              columnId: data.target_column_id,
              order: data.new_order,
              updatedAt: new Date().toISOString(),
            };
            const newCards = [...column.cards];
            newCards.splice(data.new_order, 0, updatedCard);
            return {
              ...column,
              cards: newCards.map((c, index) => ({ ...c, order: index })),
            };
          }

          return column;
        });
      });

      return { previousColumns };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(COLUMNS_QUERY_KEY, context.previousColumns);
      }
      toast.error("카드 이동에 실패했습니다.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_QUERY_KEY });
    },
  });
}
