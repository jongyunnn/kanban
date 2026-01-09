"use client";

import {
  DragOverlay,
  DropAnimation,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { CardItem } from "@/features/card";
import { Card } from "@/features/card/types";
import { ActiveDragItem } from "../types";

interface CardDragOverlayProps {
  activeItem: ActiveDragItem | null;
  activeCard?: Card | null;
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
  duration: 0,
  easing: "ease-out",
};

export function CardDragOverlay({
  activeItem,
  activeCard,
}: CardDragOverlayProps) {
  if (!activeItem) return null;

  // 컬럼 드래그 오버레이
  if (activeItem.type === "column") {
    return (
      <DragOverlay dropAnimation={dropAnimation}>
        <div className="w-72 bg-muted rounded-lg p-3 shadow-lg border border-border cursor-grabbing">
          <p className="text-sm font-semibold">{activeItem.title}</p>
        </div>
      </DragOverlay>
    );
  }

  // 카드 드래그 오버레이 - 미니멀하게
  return (
    <DragOverlay dropAnimation={dropAnimation}>
      <div className="w-64 cursor-grabbing shadow-lg rounded-md">
        {activeCard ? (
          <CardItem card={activeCard} />
        ) : (
          <div className="bg-background rounded-md p-3 shadow-sm border">
            <p className="text-sm font-medium line-clamp-2">
              {activeItem.title}
            </p>
          </div>
        )}
      </div>
    </DragOverlay>
  );
}
