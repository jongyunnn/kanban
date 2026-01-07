"use client";

import { useColumns } from "../hooks";
import { ColumnItem } from "./ColumnItem";
import { ColumnAddButton } from "./ColumnAddButton";
import { Skeleton } from "@/components/ui/skeleton";

export function ColumnList() {
  const { data: columns, isLoading, error } = useColumns();

  if (isLoading) {
    return (
      <div className="flex gap-4 p-4 overflow-x-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-72 shrink-0 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        <p>컬럼을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  const hasColumns = columns && columns.length > 0;

  return (
    <div className="flex gap-4 p-4 overflow-x-auto h-full">
      {hasColumns ? (
        <>
          {columns.map((column) => (
            <ColumnItem key={column.id} column={column}>
              {column.cards.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  카드를 추가해보세요
                </p>
              ) : (
                <div className="space-y-2">
                  {column.cards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-background rounded-md p-3 shadow-sm border"
                    >
                      <p className="text-sm font-medium">{card.title}</p>
                      {card.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {card.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ColumnItem>
          ))}
          <ColumnAddButton />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-64 gap-4">
          <p className="text-muted-foreground">
            첫 번째 컬럼을 추가해보세요
          </p>
          <ColumnAddButton />
        </div>
      )}
    </div>
  );
}
