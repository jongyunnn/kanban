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
import { useDeleteColumn } from "../hooks";

export const ColumnDeleteDialog = memo(function ColumnDeleteDialog() {
  const { isColumnDeleteOpen, columnToDelete, closeColumnDelete } =
    useModalStore();
  const deleteColumn = useDeleteColumn();

  const handleDelete = useCallback(() => {
    if (!columnToDelete) return;
    deleteColumn.mutate(columnToDelete.id, {
      onSuccess: () => {
        closeColumnDelete();
      },
    });
  }, [deleteColumn, columnToDelete, closeColumnDelete]);

  if (!columnToDelete) return null;

  return (
    <Dialog open={isColumnDeleteOpen} onOpenChange={closeColumnDelete}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>컬럼 삭제</DialogTitle>
          <DialogDescription>
            &ldquo;{columnToDelete.title}&rdquo; 컬럼을 삭제하시겠습니까?
            {columnToDelete.cardCount > 0 && (
              <>
                <br />
                <span className="text-destructive font-medium">
                  이 컬럼에 있는 {columnToDelete.cardCount}개의 카드도 함께
                  삭제됩니다.
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={closeColumnDelete}
            disabled={deleteColumn.isPending}
          >
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            loading={deleteColumn.isPending}
          >
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ColumnDeleteDialog.displayName = "ColumnDeleteDialog";
