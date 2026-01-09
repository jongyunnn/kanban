"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, isPast, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { AlertCircle, Trash2 } from "lucide-react";
import { memo, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalStore } from "@/stores";
import { useUpdateCard } from "../hooks";
import { CardFormValues, cardFormSchema } from "../lib/schemas";
import { DescriptionField, DueDateField, TitleField } from "./CardFormFields";

export const CardDetailModal = memo(function CardDetailModal() {
  const {
    isCardModalOpen,
    selectedCard: card,
    closeCardModal,
    openCardDelete,
  } = useModalStore();
  const updateCard = useUpdateCard();

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
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    if (card) {
      reset({
        title: card.title,
        description: card.description,
        dueDate: card.dueDate ? card.dueDate.split("T")[0] : null,
      });
    }
  }, [card, reset]);

  const dueDate = card?.dueDate ? new Date(card.dueDate) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate);

  const onSubmit = (data: CardFormValues) => {
    if (!card) return;

    updateCard.mutate(
      {
        id: card.id,
        data: {
          title: data.title,
          description: data.description || "",
          due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        },
      },
      {
        onSuccess: () => {
          closeCardModal();
        },
      }
    );
  };

  if (!card) return null;

  return (
    <>
      <Dialog open={isCardModalOpen} onOpenChange={closeCardModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>카드 상세</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TitleField
              id="title"
              {...register("title")}
              error={errors.title?.message}
            />

            <DescriptionField
              id="description"
              {...register("description")}
              rows={4}
              error={errors.description?.message}
            />

            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <DueDateField
                  id="dueDate"
                  value={field.value}
                  onChange={field.onChange}
                  labelExtra={
                    isOverdue && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive">
                        <AlertCircle className="size-3" aria-hidden="true" />
                        기한 지남
                      </span>
                    )
                  }
                />
              )}
            />

            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                생성일:{" "}
                {format(new Date(card.createdAt), "yyyy년 M월 d일 HH:mm", {
                  locale: ko,
                })}
              </p>
              <p>
                수정일:{" "}
                {format(new Date(card.updatedAt), "yyyy년 M월 d일 HH:mm", {
                  locale: ko,
                })}
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => openCardDelete(card.id, card.title)}
              >
                <Trash2 className="size-4" />
                삭제
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeCardModal}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty}
                  loading={updateCard.isPending}
                >
                  저장
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
});

CardDetailModal.displayName = "CardDetailModal";
