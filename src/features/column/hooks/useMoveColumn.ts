"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveColumn } from "../api";
import { Column } from "../types";
import { COLUMNS_QUERY_KEY } from "./useColumns";

interface MoveColumnVariables {
  id: string;
  newOrder: number;
}

export function useMoveColumn() {
  const queryClient = useQueryClient();

  return useMutation<
    Column,
    Error,
    MoveColumnVariables,
    { previousColumns: Column[] | undefined }
  >({
    mutationFn: ({ id, newOrder }) => moveColumn(id, newOrder),

    // 낙관적 업데이트
    onMutate: async ({ id, newOrder }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: COLUMNS_QUERY_KEY });

      // 이전 데이터 스냅샷
      const previousColumns =
        queryClient.getQueryData<Column[]>(COLUMNS_QUERY_KEY);

      // 낙관적으로 캐시 업데이트
      queryClient.setQueryData<Column[]>(COLUMNS_QUERY_KEY, (oldColumns) => {
        if (!oldColumns) return oldColumns;

        const column = oldColumns.find((c) => c.id === id);
        if (!column) return oldColumns;

        const currentOrder = column.order;
        if (currentOrder === newOrder) return oldColumns;

        return oldColumns
          .map((col) => {
            if (col.id === id) {
              return { ...col, order: newOrder };
            }
            if (newOrder > currentOrder) {
              // 아래로 이동: 사이의 컬럼들은 order - 1
              if (col.order > currentOrder && col.order <= newOrder) {
                return { ...col, order: col.order - 1 };
              }
            } else {
              // 위로 이동: 사이의 컬럼들은 order + 1
              if (col.order >= newOrder && col.order < currentOrder) {
                return { ...col, order: col.order + 1 };
              }
            }
            return col;
          })
          .sort((a, b) => a.order - b.order);
      });

      return { previousColumns };
    },

    // 에러 시 롤백
    onError: (_error, _variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(COLUMNS_QUERY_KEY, context.previousColumns);
      }
    },

    // 성공/실패 후 쿼리 무효화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_QUERY_KEY });
    },
  });
}
