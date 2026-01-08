"use client";

import { format, isPast, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { AlertCircle, Calendar, MoreHorizontal, Trash2 } from "lucide-react";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Card } from "../types";
import { CardDeleteDialog } from "./CardDeleteDialog";

interface CardItemProps {
  card: Card;
  onClick: () => void;
}

export const CardItem = memo(function CardItem({
  card,
  onClick,
}: CardItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const hasDueDate = card.dueDate !== null;
  const dueDate = hasDueDate ? new Date(card.dueDate!) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`카드: ${card.title}${isOverdue ? " (기한 지남)" : ""}`}
        className={cn(
          "w-full text-left bg-background rounded-md p-3 shadow-sm border transition-all cursor-pointer",
          "hover:shadow-md hover:border-primary/50",
          "focus:outline-none focus:ring-2 focus:ring-primary/50",
          isOverdue && "border-destructive/50 bg-destructive/5"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium line-clamp-2 flex-1">
            {card.title}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            {isOverdue && (
              <AlertCircle
                className="size-4 text-destructive"
                aria-hidden="true"
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={handleMenuClick}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-5 -mr-1"
                  aria-label="카드 메뉴"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={handleMenuClick}>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="size-4" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {card.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {card.description}
          </p>
        )}

        {hasDueDate && dueDate && (
          <div
            className={cn(
              "flex items-center gap-1 mt-2 text-xs",
              isOverdue
                ? "text-destructive font-medium"
                : "text-muted-foreground"
            )}
          >
            <Calendar className="size-3" aria-hidden="true" />
            <span>
              {format(dueDate, "yyyy. MM. dd.", { locale: ko })}
              {isOverdue && " (기한 지남)"}
            </span>
          </div>
        )}
      </div>

      <CardDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        cardId={card.id}
        cardTitle={card.title}
      />
    </>
  );
});
