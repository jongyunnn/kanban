import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types";

/**
 * API 에러에서 HTTP 상태 코드를 추출합니다.
 */
export function getErrorStatus(error: unknown): number | null {
  if (error instanceof AxiosError) {
    return error.response?.status ?? null;
  }
  return null;
}

/**
 * API 에러에서 에러 메시지를 추출합니다.
 */
export function getErrorMessage(error: unknown): string | null {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return data?.error?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "알 수 없는 에러가 발생했습니다.";
}

/**
 * 특정 HTTP 상태 코드인지 확인합니다.
 */
export function isHttpStatus(error: unknown, status: number): boolean {
  return getErrorStatus(error) === status;
}