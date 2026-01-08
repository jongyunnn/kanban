import { apiClient } from "@/lib/api-client";
import {
  Card,
  CardApiResponse,
  CreateCardRequest,
  MoveCardRequest,
  transformCard,
  UpdateCardRequest,
} from "./types";

interface CardResponse {
  data: CardApiResponse;
}

interface DeleteCardResponse {
  data: {
    success: boolean;
  };
}

// 카드 생성
export async function createCard(data: CreateCardRequest): Promise<Card> {
  const response = await apiClient.post<CardResponse, CardResponse>(
    "/cards",
    data
  );
  return transformCard(response.data);
}

// 카드 수정
export async function updateCard(
  id: string,
  data: UpdateCardRequest
): Promise<Card> {
  const response = await apiClient.patch<CardResponse, CardResponse>(
    `/cards/${id}`,
    data
  );
  return transformCard(response.data);
}

// 카드 삭제
export async function deleteCard(id: string): Promise<{ success: boolean }> {
  const response = await apiClient.delete<
    DeleteCardResponse,
    DeleteCardResponse
  >(`/cards/${id}`);
  return { success: response.data.success };
}

// 카드 이동/순서 변경
export async function moveCard(
  id: string,
  data: MoveCardRequest
): Promise<Card> {
  const response = await apiClient.patch<CardResponse, CardResponse>(
    `/cards/${id}/move`,
    data
  );
  return transformCard(response.data);
}
