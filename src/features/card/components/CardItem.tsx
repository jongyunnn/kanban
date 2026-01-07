"use client";

import { format, isPast, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "../types";

interface CardItemProps {
  card: Card;
  onClick: () => void;
}

export function CardItem({ card, onClick }: CardItemProps) {
  const hasDueDate = card.dueDate !== null;
  const dueDate = hasDueDate ? new Date(card.dueDate!) : null;
  const isOverdue = dueDate && isPast(dueDate) && !isToday(dueDate);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left bg-background rounded-md p-3 shadow-sm border transition-all",
        "hover:shadow-md hover:border-primary/50",
        "focus:outline-none focus:ring-2 focus:ring-primary/50"
      )}
    >
      <p className="text-sm font-medium line-clamp-2">{card.title}</p>

      {card.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {card.description}
        </p>
      )}

      {hasDueDate && dueDate && (
        <div
          className={cn(
            "flex items-center gap-1 mt-2 text-xs",
            isOverdue ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <Calendar className="size-3" />
          <span>
            {format(dueDate, "M월 d일", { locale: ko })}
            {isOverdue && " (기한 지남)"}
          </span>
        </div>
      )}
    </button>
  );
}
