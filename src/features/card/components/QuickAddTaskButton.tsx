"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useColumns } from "@/features/column/hooks";
import { useCreateCard } from "../hooks";
import { CardFormValues, cardFormSchema } from "../lib/schemas";
import { DescriptionField, DueDateField, TitleField } from "./CardFormFields";

export const QuickAddTaskButton = memo(function QuickAddTaskButton() {
  const [open, setOpen] = useState(false);

  const { data: columns } = useColumns();
  const createCard = useCreateCard();

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: null,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = form;

  // "To Do" 컬럼 찾기
  const todoColumn = useMemo(
    () => columns?.find((col) => col.id === "col_001" || col.order === 0),
    [columns]
  );

  const onSubmit = (data: CardFormValues) => {
    if (!todoColumn || createCard.isPending) return;

    createCard.mutate(
      {
        column_id: todoColumn.id,
        title: data.title.trim(),
        description: data.description?.trim() || "",
        due_date: data.dueDate,
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      }
    );
  };

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        reset();
      }
    },
    [reset]
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TitleField
            id="quick-title"
            {...register("title")}
            error={errors.title?.message}
            autoFocus
          />
          <DescriptionField
            id="quick-description"
            {...register("description")}
            error={errors.description?.message}
          />
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <DueDateField
                id="quick-dueDate"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createCard.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              loading={createCard.isPending}
            >
              추가
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

QuickAddTaskButton.displayName = "QuickAddTaskButton";
