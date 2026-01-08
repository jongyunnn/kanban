"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCard } from "../hooks";

interface CardAddButtonProps {
  columnId: string;
}

export function CardAddButton({ columnId }: CardAddButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const createCard = useCreateCard();

  useEffect(() => {
    if (isAdding) {
      // 입력 필드에 포커스
      inputRef.current?.focus();
      // 폼이 보이도록 스크롤
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [isAdding]);

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    createCard.mutate(
      {
        column_id: columnId,
        title: trimmedTitle,
        description: description.trim(),
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setIsAdding(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="size-4" />
        카드 추가
      </Button>
    );
  }

  return (
    <div ref={formRef} className="bg-background rounded-md p-2 shadow-sm border space-y-2">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="카드 제목 입력"
        maxLength={100}
        disabled={createCard.isPending}
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="설명 (선택)"
        maxLength={1000}
        rows={2}
        disabled={createCard.isPending}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!title.trim()}
          loading={createCard.isPending}
        >
          추가
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCancel}
          disabled={createCard.isPending}
        >
          <X className="size-4" />
          <span className="sr-only">취소</span>
        </Button>
      </div>
    </div>
  );
}
