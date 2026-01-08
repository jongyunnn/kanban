"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateCard } from "../hooks";
import { CardFormValues, cardFormSchema } from "../lib/schemas";
import { Card } from "../types";
import { CardDeleteDialog } from "./CardDeleteDialog";

interface CardDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Card | null;
}

export function CardDetailModal({
  open,
  onOpenChange,
  card,
}: CardDetailModalProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
          onOpenChange(false);
        },
      }
    );
  };

  const handleDeleteSuccess = () => {
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  if (!card) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>카드 상세</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="카드 제목"
                maxLength={100}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="카드 설명"
                rows={4}
                maxLength={1000}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">마감일</Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <DateInput
                    id="dueDate"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

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
                className="text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="size-4" />
                삭제
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
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

      <CardDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        cardId={card.id}
        cardTitle={card.title}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}
