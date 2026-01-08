"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Column } from "../types";
import { ColumnHeader } from "./ColumnHeader";
import { ColumnDeleteDialog } from "./ColumnDeleteDialog";

interface ColumnItemProps {
  column: Column;
  children?: React.ReactNode;
}

export function ColumnItem({ column, children }: ColumnItemProps) {
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
      />

      <ScrollArea className="flex-1 min-h-[200px]">
        <div className="p-3">
          {children}
        </div>
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
