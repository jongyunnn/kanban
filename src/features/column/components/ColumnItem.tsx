"use client";

import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Column } from "../types";
import { ColumnDeleteDialog } from "./ColumnDeleteDialog";
import { ColumnHeader } from "./ColumnHeader";

interface ColumnItemProps {
  column: Column;
  children?: React.ReactNode;
  dragHandleProps?: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
}

export function ColumnItem({
  column,
  children,
  dragHandleProps,
}: ColumnItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        onDeleteClick={() => setShowDeleteDialog(true)}
        dragHandleProps={dragHandleProps}
      />

      <ScrollArea className="flex-1 min-h-[200px]">
        <div className="p-3">{children}</div>
      </ScrollArea>

      <ColumnDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        columnId={column.id}
        columnTitle={column.title}
        cardCount={column.cards.length}
      />
    </div>
  );
}
