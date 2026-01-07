"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteColumn } from "../api";
import { Column } from "../types";
import { COLUMNS_QUERY_KEY } from "./useColumns";

interface DeleteColumnResult {
  success: boolean;
  deletedCardsCount: number;
}

export function useDeleteColumn() {
  const queryClient = useQueryClient();

  return useMutation<DeleteColumnResult, Error, string, { previousColumns: Column[] | undefined }>({
    mutationFn: deleteColumn,

    // 낙관적 업데이트
    onMutate: async (columnId) => {
      await queryClient.cancelQueries({ queryKey: COLUMNS_QUERY_KEY });

      const previousColumns = queryClient.getQueryData<Column[]>(COLUMNS_QUERY_KEY);

      queryClient.setQueryData<Column[]>(COLUMNS_QUERY_KEY, (oldColumns) => {
        if (!oldColumns) return oldColumns;
        return oldColumns.filter((column) => column.id !== columnId);
      });

      return { previousColumns };
    },

    onSuccess: () => {
      toast.success("컬럼이 삭제되었습니다.");
    },

    // 에러 시 롤백
    onError: (_error, _columnId, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(COLUMNS_QUERY_KEY, context.previousColumns);
      }
      toast.error("컬럼 삭제에 실패했습니다.");
    },

    // 성공/실패 후 쿼리 무효화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_QUERY_KEY });
    },
  });
}
