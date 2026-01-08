"use client";

import { Plus } from "lucide-react";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useColumns } from "@/features/column/hooks";
import { useCreateCard } from "../hooks";

export const QuickAddTaskButton = memo(function QuickAddTaskButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  const { data: columns } = useColumns();
  const createCard = useCreateCard();

  // "To Do" 컬럼 찾기
  const todoColumn = useMemo(
    () => columns?.find((col) => col.id === "col_001" || col.order === 0),
    [columns]
  );

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setDueDate(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!todoColumn || createCard.isPending || isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      isSubmittingRef.current = false;
      return;
    }

    createCard.mutate(
      {
        column_id: todoColumn.id,
        title: trimmedTitle,
        description: description.trim(),
        due_date: dueDate,
      },
      {
        onSuccess: () => {
          resetForm();
          setOpen(false);
          isSubmittingRef.current = false;
        },
        onError: () => {
          isSubmittingRef.current = false;
        },
      }
    );
  }, [todoColumn, createCard, title, description, dueDate, resetForm]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    },
    [resetForm]
  );

  // To Do 컬럼이 없으면 버튼 비활성화
  if (!todoColumn) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Plus className="size-4" />
        작업 추가
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="size-4" />
          작업 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>새 작업 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quick-title">제목</Label>
            <Input
              id="quick-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="작업 제목 입력"
              maxLength={100}
              disabled={createCard.isPending}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quick-description">설명 (선택)</Label>
            <Textarea
              id="quick-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="작업 설명"
              maxLength={1000}
              rows={3}
              disabled={createCard.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quick-dueDate">마감일 (선택)</Label>
            <DateInput
              id="quick-dueDate"
              value={dueDate}
              onChange={setDueDate}
              disabled={createCard.isPending}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createCard.isPending}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim()}
              loading={createCard.isPending}
            >
              추가
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

QuickAddTaskButton.displayName = "QuickAddTaskButton";
