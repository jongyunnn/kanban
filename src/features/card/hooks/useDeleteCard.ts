"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { COLUMNS_QUERY_KEY } from "@/features/column/hooks";
import { Column } from "@/features/column/types";
import { deleteCard } from "../api";

export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    string,
    { previousColumns: Column[] | undefined }
  >({
    mutationFn: deleteCard,

    // 낙관적 업데이트
    onMutate: async (cardId) => {
      await queryClient.cancelQueries({ queryKey: COLUMNS_QUERY_KEY });

      const previousColumns =
        queryClient.getQueryData<Column[]>(COLUMNS_QUERY_KEY);

      queryClient.setQueryData<Column[]>(COLUMNS_QUERY_KEY, (oldColumns) => {
        if (!oldColumns) return oldColumns;
        return oldColumns.map((column) => ({
          ...column,
          cards: column.cards.filter((card) => card.id !== cardId),
        }));
      });

      return { previousColumns };
    },

    onSuccess: () => {
      toast.success("카드가 삭제되었습니다.");
    },

    onError: (_error, _cardId, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(COLUMNS_QUERY_KEY, context.previousColumns);
      }
      toast.error("카드 삭제에 실패했습니다.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_QUERY_KEY });
    },
  });
}
