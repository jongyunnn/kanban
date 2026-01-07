"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * 클라이언트 hydration 완료 여부를 반환하는 훅
 * useSyncExternalStore를 사용하여 effect 내 setState 없이 안전하게 구현
 */
export function useMounted(): boolean {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
}
