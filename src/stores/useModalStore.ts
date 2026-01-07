"use client";

import { create } from "zustand";
import { Card } from "@/features/card/types";

interface ModalState {
  // 카드 상세 모달
  isCardModalOpen: boolean;
  selectedCard: Card | null;
  openCardModal: (card: Card) => void;
  closeCardModal: () => void;

  // 컬럼 삭제 확인
  isColumnDeleteOpen: boolean;
  columnToDelete: { id: string; title: string; cardCount: number } | null;
  openColumnDelete: (id: string, title: string, cardCount: number) => void;
  closeColumnDelete: () => void;

  // 카드 삭제 확인
  isCardDeleteOpen: boolean;
  cardToDelete: { id: string; title: string } | null;
  openCardDelete: (id: string, title: string) => void;
  closeCardDelete: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  // 카드 상세 모달
  isCardModalOpen: false,
  selectedCard: null,
  openCardModal: (card) => set({ isCardModalOpen: true, selectedCard: card }),
  closeCardModal: () => set({ isCardModalOpen: false, selectedCard: null }),

  // 컬럼 삭제 확인
  isColumnDeleteOpen: false,
  columnToDelete: null,
  openColumnDelete: (id, title, cardCount) =>
    set({ isColumnDeleteOpen: true, columnToDelete: { id, title, cardCount } }),
  closeColumnDelete: () =>
    set({ isColumnDeleteOpen: false, columnToDelete: null }),

  // 카드 삭제 확인
  isCardDeleteOpen: false,
  cardToDelete: null,
  openCardDelete: (id, title) =>
    set({ isCardDeleteOpen: true, cardToDelete: { id, title } }),
  closeCardDelete: () => set({ isCardDeleteOpen: false, cardToDelete: null }),
}));
