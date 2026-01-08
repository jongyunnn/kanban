"use client";

import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { GripVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUpdateColumn } from "../hooks";

interface ColumnHeaderProps {
  id: string;
  title: string;
  cardCount: number;
  onDeleteClick: () => void;
  dragHandleProps?: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
}

export function ColumnHeader({
  id,
  title,
  cardCount,
  onDeleteClick,
  dragHandleProps,
}: ColumnHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateColumn = useUpdateColumn();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(title);
  }, [title]);

  const handleStartEdit = () => {
    setEditValue(title);
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== title) {
      updateColumn.mutate({ id, data: { title: trimmedValue } });
    } else {
      setEditValue(title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 p-3">
      {dragHandleProps && (
        <button
          type="button"
          className={cn(
            "touch-none cursor-grab text-muted-foreground hover:text-foreground transition-colors",
            "active:cursor-grabbing"
          )}
          {...dragHandleProps.attributes}
          {...dragHandleProps.listeners}
        >
          <GripVertical className="size-4" />
          <span className="sr-only">컬럼 드래그 핸들</span>
        </button>
      )}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-7 text-sm font-semibold"
            maxLength={50}
          />
        ) : (
          <button
            onClick={handleStartEdit}
            aria-label={`${title} 컬럼 - 클릭하여 이름 수정`}
            className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors text-left"
          >
            {title}
          </button>
        )}
        <span className="text-xs text-muted-foreground shrink-0">
          {cardCount}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="shrink-0">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">컬럼 메뉴</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleStartEdit}>
            <Pencil className="size-4" />
            이름 수정
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDeleteClick}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="size-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
