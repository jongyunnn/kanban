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
import { useDeleteCard } from "../hooks";

interface CardDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardId: string;
  cardTitle: string;
  onSuccess?: () => void;
}

export const CardDeleteDialog = memo(function CardDeleteDialog({
  open,
  onOpenChange,
  cardId,
  cardTitle,
  onSuccess,
}: CardDeleteDialogProps) {
  const deleteCard = useDeleteCard();

  const handleDelete = useCallback(() => {
    deleteCard.mutate(cardId, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  }, [deleteCard, cardId, onOpenChange, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>카드 삭제</DialogTitle>
          <DialogDescription>
            &ldquo;{cardTitle}&rdquo; 카드를 삭제하시겠습니까?
            <br />
            삭제된 카드는 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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
