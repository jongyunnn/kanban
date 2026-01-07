import { apiClient } from "@/lib/api-client";
import {
  Column,
  ColumnApiResponse,
  CreateColumnRequest,
  UpdateColumnRequest,
  transformColumn,
} from "./types";

interface ColumnsResponse {
  data: ColumnApiResponse[];
}

interface ColumnResponse {
  data: ColumnApiResponse;
}

interface DeleteColumnResponse {
  data: {
    success: boolean;
    deleted_cards_count: number;
  };
}

// 컬럼 전체 조회 (카드 포함)
export async function fetchColumns(): Promise<Column[]> {
  const response = await apiClient.get<ColumnsResponse, ColumnsResponse>("/columns");
  return response.data.map(transformColumn);
}

// 컬럼 생성
export async function createColumn(data: CreateColumnRequest): Promise<Column> {
  const response = await apiClient.post<ColumnResponse, ColumnResponse>("/columns", data);
  return transformColumn({ ...response.data, cards: [] });
}

// 컬럼 수정
export async function updateColumn(id: string, data: UpdateColumnRequest): Promise<Column> {
  const response = await apiClient.patch<ColumnResponse, ColumnResponse>(`/columns/${id}`, data);
  return transformColumn({ ...response.data, cards: [] });
}

// 컬럼 삭제
export async function deleteColumn(id: string): Promise<{ success: boolean; deletedCardsCount: number }> {
  const response = await apiClient.delete<DeleteColumnResponse, DeleteColumnResponse>(`/columns/${id}`);
  return {
    success: response.data.success,
    deletedCardsCount: response.data.deleted_cards_count,
  };
}
