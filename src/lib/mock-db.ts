// src/lib/mock-db.ts

export interface Column {
  id: string;
  title: string;
  order: number;
  createdAt: string;
}

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

// API 응답용 snake_case 타입
export interface ColumnResponse {
  id: string;
  title: string;
  order: number;
  created_at: string;
  cards: CardResponse[];
}

export interface CardResponse {
  id: string;
  column_id: string;
  title: string;
  description: string;
  due_date: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

// 네트워크 지연 시뮬레이션 (200~500ms)
export function simulateDelay(): Promise<void> {
  const delay = Math.floor(Math.random() * 300) + 200;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

// camelCase → snake_case 변환
export function toSnakeCase<T extends Record<string, unknown>>(
  obj: T
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    result[snakeKey] = obj[key];
  }
  return result;
}

// Card를 API 응답 형식으로 변환
export function cardToResponse(card: Card): CardResponse {
  return {
    id: card.id,
    column_id: card.columnId,
    title: card.title,
    description: card.description,
    due_date: card.dueDate,
    order: card.order,
    created_at: card.createdAt,
    updated_at: card.updatedAt,
  };
}

// Column을 API 응답 형식으로 변환 (카드 포함)
export function columnToResponse(
  column: Column,
  cards: Card[]
): ColumnResponse {
  return {
    id: column.id,
    title: column.title,
    order: column.order,
    created_at: column.createdAt,
    cards: cards
      .filter((card) => card.columnId === column.id)
      .sort((a, b) => a.order - b.order)
      .map(cardToResponse),
  };
}

// 고유 ID 생성
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// 현재 시간 ISO 문자열
export function nowISO(): string {
  return new Date().toISOString();
}

class MockDB {
  public columns: Column[];
  public cards: Card[];

  constructor() {
    this.columns = [
      {
        id: "col_001",
        title: "To Do",
        order: 0,
        createdAt: "2025-01-10T09:00:00Z",
      },
      {
        id: "col_002",
        title: "In Progress",
        order: 1,
        createdAt: "2025-01-10T09:00:00Z",
      },
      {
        id: "col_003",
        title: "Done",
        order: 2,
        createdAt: "2025-01-10T09:00:00Z",
      },
    ];

    this.cards = [
      {
        id: "card_001",
        columnId: "col_001",
        title: "프로젝트 요구사항 분석",
        description: "클라이언트 미팅 내용을 바탕으로 요구사항 문서 작성",
        dueDate: "2025-01-15T00:00:00Z",
        order: 0,
        createdAt: "2025-01-10T09:00:00Z",
        updatedAt: "2025-01-10T09:00:00Z",
      },
      {
        id: "card_002",
        columnId: "col_001",
        title: "기술 스택 검토",
        description: "",
        dueDate: null,
        order: 1,
        createdAt: "2025-01-10T10:00:00Z",
        updatedAt: "2025-01-10T10:00:00Z",
      },
      {
        id: "card_003",
        columnId: "col_002",
        title: "와이어프레임 작성",
        description: "Figma를 사용하여 주요 화면 와이어프레임 작성",
        dueDate: "2025-01-12T00:00:00Z",
        order: 0,
        createdAt: "2025-01-10T11:00:00Z",
        updatedAt: "2025-01-10T11:00:00Z",
      },
      {
        id: "card_004",
        columnId: "col_003",
        title: "개발 환경 세팅",
        description: "Vite + React + TypeScript 프로젝트 초기 설정 완료",
        dueDate: null,
        order: 0,
        createdAt: "2025-01-10T12:00:00Z",
        updatedAt: "2025-01-10T12:00:00Z",
      },
      {
        id: "card_005",
        columnId: "col_999",
        title: "레거시 데이터 정리",
        description: "이전 프로젝트에서 마이그레이션된 태스크",
        dueDate: "2025-01-05T00:00:00Z",
        order: 0,
        createdAt: "2025-01-10T13:00:00Z",
        updatedAt: "2025-01-10T13:00:00Z",
      },
    ];
  }

  // Column CRUD
  getAllColumns(): Column[] {
    return [...this.columns].sort((a, b) => a.order - b.order);
  }

  getColumnById(id: string): Column | undefined {
    return this.columns.find((col) => col.id === id);
  }

  createColumn(title: string): Column {
    const maxOrder =
      this.columns.length > 0
        ? Math.max(...this.columns.map((c) => c.order))
        : -1;

    const newColumn: Column = {
      id: generateId("col"),
      title,
      order: maxOrder + 1,
      createdAt: nowISO(),
    };

    this.columns.push(newColumn);
    return newColumn;
  }

  updateColumn(id: string, title: string): Column | null {
    const column = this.columns.find((col) => col.id === id);
    if (!column) return null;

    column.title = title;
    return column;
  }

  deleteColumn(id: string): { success: boolean; deletedCardsCount: number } {
    const columnIndex = this.columns.findIndex((col) => col.id === id);
    if (columnIndex === -1) {
      return { success: false, deletedCardsCount: 0 };
    }

    // 해당 컬럼의 카드 삭제
    const cardsToDelete = this.cards.filter((card) => card.columnId === id);
    this.cards = this.cards.filter((card) => card.columnId !== id);

    // 컬럼 삭제
    this.columns.splice(columnIndex, 1);

    // order 재정렬
    this.columns
      .sort((a, b) => a.order - b.order)
      .forEach((col, index) => {
        col.order = index;
      });

    return { success: true, deletedCardsCount: cardsToDelete.length };
  }

  // Card CRUD
  getCardsByColumnId(columnId: string): Card[] {
    return this.cards
      .filter((card) => card.columnId === columnId)
      .sort((a, b) => a.order - b.order);
  }

  getCardById(id: string): Card | undefined {
    return this.cards.find((card) => card.id === id);
  }

  createCard(
    columnId: string,
    title: string,
    description: string,
    dueDate: string | null
  ): Card | null {
    // 컬럼 존재 확인
    const column = this.getColumnById(columnId);
    if (!column) return null;

    const columnCards = this.getCardsByColumnId(columnId);
    const maxOrder =
      columnCards.length > 0
        ? Math.max(...columnCards.map((c) => c.order))
        : -1;

    const now = nowISO();
    const newCard: Card = {
      id: generateId("card"),
      columnId,
      title,
      description,
      dueDate,
      order: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };

    this.cards.push(newCard);
    return newCard;
  }

  updateCard(
    id: string,
    updates: Partial<Pick<Card, "title" | "description" | "dueDate">>
  ): Card | null {
    const card = this.cards.find((c) => c.id === id);
    if (!card) return null;

    if (updates.title !== undefined) card.title = updates.title;
    if (updates.description !== undefined)
      card.description = updates.description;
    if (updates.dueDate !== undefined) card.dueDate = updates.dueDate;
    card.updatedAt = nowISO();

    return card;
  }

  deleteCard(id: string): boolean {
    const cardIndex = this.cards.findIndex((card) => card.id === id);
    if (cardIndex === -1) return false;

    const card = this.cards[cardIndex];
    this.cards.splice(cardIndex, 1);

    // 같은 컬럼 내 order 재정렬
    this.cards
      .filter((c) => c.columnId === card.columnId)
      .sort((a, b) => a.order - b.order)
      .forEach((c, index) => {
        c.order = index;
      });

    return true;
  }

  moveCard(id: string, targetColumnId: string, newOrder: number): Card | null {
    const card = this.cards.find((c) => c.id === id);
    if (!card) return null;

    // 대상 컬럼 존재 확인
    const targetColumn = this.getColumnById(targetColumnId);
    if (!targetColumn) return null;

    const sourceColumnId = card.columnId;
    const isSameColumn = sourceColumnId === targetColumnId;

    // 대상 컬럼의 카드들
    const targetCards = this.cards
      .filter((c) => c.columnId === targetColumnId && c.id !== id)
      .sort((a, b) => a.order - b.order);

    // newOrder 범위 조정
    const maxOrder = targetCards.length;
    const adjustedOrder = Math.max(0, Math.min(newOrder, maxOrder));

    // 카드 이동
    card.columnId = targetColumnId;
    card.updatedAt = nowISO();

    // 대상 컬럼 카드들 order 재정렬
    targetCards.splice(adjustedOrder, 0, card);
    targetCards.forEach((c, index) => {
      c.order = index;
    });

    // 다른 컬럼으로 이동한 경우, 원본 컬럼 order 재정렬
    if (!isSameColumn) {
      this.cards
        .filter((c) => c.columnId === sourceColumnId)
        .sort((a, b) => a.order - b.order)
        .forEach((c, index) => {
          c.order = index;
        });
    }

    return card;
  }
}

// 개발 중 핫 리로드 시 데이터 유지를 위해 globalThis 사용
const globalForMockDB = globalThis as unknown as { mockDB: MockDB };

export const db = globalForMockDB.mockDB || new MockDB();

if (process.env.NODE_ENV !== "production") globalForMockDB.mockDB = db;
