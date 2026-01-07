"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteColumn } from "../hooks";

interface ColumnDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnId: string;
  columnTitle: string;
  cardCount: number;
}

export function ColumnDeleteDialog({
  open,
  onOpenChange,
  columnId,
  columnTitle,
  cardCount,
}: ColumnDeleteDialogProps) {
  const deleteColumn = useDeleteColumn();

  const handleDelete = () => {
    deleteColumn.mutate(columnId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>컬럼 삭제</DialogTitle>
          <DialogDescription>
            &ldquo;{columnTitle}&rdquo; 컬럼을 삭제하시겠습니까?
            {cardCount > 0 && (
              <>
                <br />
                <span className="text-destructive font-medium">
                  이 컬럼에 있는 {cardCount}개의 카드도 함께 삭제됩니다.
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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
}
