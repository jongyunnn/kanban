"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createColumn } from "../api";
import { Column, CreateColumnRequest } from "../types";
import { COLUMNS_QUERY_KEY } from "./useColumns";

export function useCreateColumn() {
  const queryClient = useQueryClient();

  return useMutation<Column, Error, CreateColumnRequest>({
    mutationFn: createColumn,
    onSuccess: (newColumn) => {
      queryClient.setQueryData<Column[]>(COLUMNS_QUERY_KEY, (oldColumns) => {
        if (!oldColumns) return [newColumn];
        return [...oldColumns, newColumn];
      });
      toast.success("컬럼이 생성되었습니다.");
    },
    onError: () => {
      toast.error("컬럼 생성에 실패했습니다.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: COLUMNS_QUERY_KEY });
    },
  });
}
