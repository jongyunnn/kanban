// Card feature types

export interface Card {
  id: string;
  columnId: string;
  title: string;
  description: string;
  dueDate: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// API Response type (snake_case)
export interface CardApiResponse {
  id: string;
  column_id: string;
  title: string;
  description: string;
  due_date: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

// Transform function
export function transformCard(card: CardApiResponse): Card {
  return {
    id: card.id,
    columnId: card.column_id,
    title: card.title,
    description: card.description,
    dueDate: card.due_date,
    order: card.order,
    createdAt: card.created_at,
    updatedAt: card.updated_at,
  };
}

// Request types
export interface CreateCardRequest {
  column_id: string;
  title: string;
  description?: string;
  due_date?: string | null;
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
  due_date?: string | null;
}

export interface MoveCardRequest {
  target_column_id: string;
  new_order: number;
}
