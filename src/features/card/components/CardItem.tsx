"use client";

import { memo } from "react";
import { format, isPast, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "../types";

interface CardItemProps {
  card: Card;
  onClick: () => void;
}

export const CardItem = memo(function CardItem({ card, onClick }: CardItemProps) {
  const hasDueDate = card.dueDate !== null;
  const dueDate = hasDueDate ? new Date(card.dueDate!) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate);

  return (
    <button
      onClick={onClick}
      aria-label={`카드: ${card.title}${isOverdue ? " (기한 지남)" : ""}`}
      className={cn(
        "w-full text-left bg-background rounded-md p-3 shadow-sm border transition-all",
        "hover:shadow-md hover:border-primary/50",
        "focus:outline-none focus:ring-2 focus:ring-primary/50",
        isOverdue && "border-destructive/50 bg-destructive/5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium line-clamp-2 flex-1">{card.title}</p>
        {isOverdue && (
          <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
        )}
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
            isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
          )}
        >
          <Calendar className="size-3" aria-hidden="true" />
          <span>
            {format(dueDate, "yyyy. MM. dd.", { locale: ko })}
            {isOverdue && " (기한 지남)"}
          </span>
        </div>
      )}
    </button>
  );
});
