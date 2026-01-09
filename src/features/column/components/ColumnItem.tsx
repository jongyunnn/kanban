"use client";

import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { memo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Column } from "../types";
import { ColumnHeader } from "./ColumnHeader";

interface ColumnItemProps {
  column: Column;
  children?: React.ReactNode;
  dragHandleProps?: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
}

export const ColumnItem = memo(function ColumnItem({
  column,
  children,
  dragHandleProps,
}: ColumnItemProps) {
  return (
    <div
      role="region"
      aria-label={`${column.title} 컬럼, 카드 ${column.cards.length}개`}
      className="flex flex-col w-72 shrink-0 bg-muted/50 rounded-lg"
    >
      <ColumnHeader
        id={column.id}
        title={column.title}
        cardCount={column.cards.length}
        dragHandleProps={dragHandleProps}
      />

      <ScrollArea className="flex-1 min-h-[200px]">
        <div className="p-3">{children}</div>
      </ScrollArea>
    </div>
  );
});

ColumnItem.displayName = "ColumnItem";
