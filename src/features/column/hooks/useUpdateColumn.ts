"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateColumn } from "../api";
import { Column, UpdateColumnRequest } from "../types";
import { COLUMNS_QUERY_KEY } from "./useColumns";

interface UpdateColumnVariables {
  id: string;
  data: UpdateColumnRequest;
}

export function useUpdateColumn() {
  const queryClient = useQueryClient();

  return useMutation<Column, Error, UpdateColumnVariables, { previousColumns: Column[] | undefined }>({
    mutationFn: ({ id, data }) => updateColumn(id, data),

    // 낙관적 업데이트
    onMutate: async ({ id, data }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: COLUMNS_QUERY_KEY });

      // 이전 데이터 스냅샷
      const previousColumns = queryClient.getQueryData<Column[]>(COLUMNS_QUERY_KEY);

      // 낙관적으로 캐시 업데이트
      queryClient.setQueryData<Column[]>(COLUMNS_QUERY_KEY, (oldColumns) => {
        if (!oldColumns) return oldColumns;
        return oldColumns.map((column) =>
          column.id === id ? { ...column, title: data.title } : column
        );
      });

      return { previousColumns };
    },

    onSuccess: () => {
      toast.success("컬럼이 수정되었습니다.");
    },

    // 에러 시 롤백
    onError: (_error, _variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(COLUMNS_QUERY_KEY, context.previousColumns);
      }
      toast.error("컬럼 수정에 실패했습니다.");
    },

    // 성공/실패 후 쿼리 무효화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_QUERY_KEY });
    },
  });
}
