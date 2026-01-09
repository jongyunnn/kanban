"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/stores";
import { useDeleteCard } from "../hooks";

export const CardDeleteDialog = memo(function CardDeleteDialog() {
  const { isCardDeleteOpen, cardToDelete, closeCardDelete } = useModalStore();
  const deleteCard = useDeleteCard();

  const handleDelete = useCallback(() => {
    if (!cardToDelete) return;
    deleteCard.mutate(cardToDelete.id, {
      onSuccess: () => {
        closeCardDelete();
      },
    });
  }, [deleteCard, cardToDelete, closeCardDelete]);

  if (!cardToDelete) return null;

  return (
    <Dialog open={isCardDeleteOpen} onOpenChange={closeCardDelete}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>카드 삭제</DialogTitle>
          <DialogDescription>
            &ldquo;{cardToDelete.title}&rdquo; 카드를 삭제하시겠습니까?
            <br />
            삭제된 카드는 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={closeCardDelete}
            disabled={deleteCard.isPending}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            loading={deleteCard.isPending}
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

CardDeleteDialog.displayName = "CardDeleteDialog";
