"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
    },
  });
}
