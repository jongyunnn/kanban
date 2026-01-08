// Board feature types for Drag & Drop

export type DragType = "card" | "column";

export interface CardDragData {
  type: "card";
  card: {
    id: string;
    columnId: string;
    title: string;
  };
}

export interface ColumnDragData {
  type: "column";
  column: {
    id: string;
    title: string;
    order: number;
  };
}

export type DragData = CardDragData | ColumnDragData;

export interface ActiveCardItem {
  id: string;
  type: "card";
  columnId: string;
  title: string;
}

export interface ActiveColumnItem {
  id: string;
  type: "column";
  title: string;
  order: number;
}

export type ActiveDragItem = ActiveCardItem | ActiveColumnItem;
