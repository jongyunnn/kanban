"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateColumn } from "../hooks";

export function ColumnAddButton() {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const createColumn = useCreateColumn();

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    createColumn.mutate(
      { title: trimmedTitle },
      {
        onSuccess: () => {
          setTitle("");
          setIsAdding(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setTitle("");
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
        className="w-72 shrink-0 h-10 justify-start text-muted-foreground hover:text-foreground"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="size-4" />
        컬럼 추가
      </Button>
    );
  }

  return (
    <div className="w-72 shrink-0 bg-muted/50 rounded-lg p-2 space-y-2">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="컬럼 제목 입력"
        maxLength={50}
        disabled={createColumn.isPending}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={!title.trim()}
          loading={createColumn.isPending}
        >
          추가
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCancel}
          disabled={createColumn.isPending}
        >
          <X className="size-4" />
          <span className="sr-only">취소</span>
        </Button>
      </div>
    </div>
  );
}
