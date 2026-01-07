// Column feature types

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

export interface Column {
  id: string;
  title: string;
  order: number;
  createdAt: string;
  cards: Card[];
}

// API Response types (snake_case)
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

export interface ColumnApiResponse {
  id: string;
  title: string;
  order: number;
  created_at: string;
  cards: CardApiResponse[];
}

// Transform functions
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

export function transformColumn(column: ColumnApiResponse): Column {
  return {
    id: column.id,
    title: column.title,
    order: column.order,
    createdAt: column.created_at,
    cards: column.cards.map(transformCard),
  };
}

// Request types
export interface CreateColumnRequest {
  title: string;
}

export interface UpdateColumnRequest {
  title: string;
}
