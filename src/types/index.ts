export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export type ApiResponse<T> = ApiSuccessResponse<T>;

// Data Models
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

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;