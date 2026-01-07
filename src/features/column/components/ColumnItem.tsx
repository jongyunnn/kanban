"use client";

import { useState } from "react";
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
    <div className="flex flex-col w-72 shrink-0 bg-muted/50 rounded-lg">
      <ColumnHeader
        id={column.id}
        title={column.title}
        cardCount={column.cards.length}
        onDeleteClick={() => setShowDeleteDialog(true)}
      />

      <div className="flex-1 overflow-y-auto px-2 pb-2 min-h-[200px]">
        {children}
      </div>

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
