"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchColumns } from "../api";
import { Column } from "../types";

export const COLUMNS_QUERY_KEY = ["columns"] as const;

export function useColumns() {
  return useQuery<Column[], Error>({
    queryKey: COLUMNS_QUERY_KEY,
    queryFn: fetchColumns,
  });
}
