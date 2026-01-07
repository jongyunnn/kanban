"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCard } from "../api";
import { Card, UpdateCardRequest } from "../types";
import { COLUMNS_QUERY_KEY } from "@/features/column/hooks";
import { Column } from "@/features/column/types";

interface UpdateCardVariables {
  id: string;
  data: UpdateCardRequest;
}

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation<Card, Error, UpdateCardVariables, { previousColumns: Column[] | undefined }>({
    mutationFn: ({ id, data }) => updateCard(id, data),

    // 낙관적 업데이트
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: COLUMNS_QUERY_KEY });

      const previousColumns = queryClient.getQueryData<Column[]>(COLUMNS_QUERY_KEY);

      queryClient.setQueryData<Column[]>(COLUMNS_QUERY_KEY, (oldColumns) => {
        if (!oldColumns) return oldColumns;
        return oldColumns.map((column) => ({
          ...column,
          cards: column.cards.map((card) => {
            if (card.id === id) {
              return {
                ...card,
                title: data.title ?? card.title,
                description: data.description ?? card.description,
                dueDate: data.due_date !== undefined ? data.due_date : card.dueDate,
                updatedAt: new Date().toISOString(),
              };
            }
            return card;
          }),
        }));
      });

      return { previousColumns };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(COLUMNS_QUERY_KEY, context.previousColumns);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_QUERY_KEY });
    },
  });
}
