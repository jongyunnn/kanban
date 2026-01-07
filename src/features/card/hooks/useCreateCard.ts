"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCard } from "../api";
import { Card, CreateCardRequest } from "../types";
import { COLUMNS_QUERY_KEY } from "@/features/column/hooks";
import { Column } from "@/features/column/types";

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation<Card, Error, CreateCardRequest>({
    mutationFn: createCard,
    onSuccess: (newCard) => {
      queryClient.setQueryData<Column[]>(COLUMNS_QUERY_KEY, (oldColumns) => {
        if (!oldColumns) return oldColumns;
        return oldColumns.map((column) => {
          if (column.id === newCard.columnId) {
            return {
              ...column,
              cards: [...column.cards, newCard],
            };
          }
          return column;
        });
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_QUERY_KEY });
    },
  });
}
