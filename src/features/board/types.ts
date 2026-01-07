// Board feature types for Drag & Drop

export type DragType = "card";

export interface DragData {
  type: DragType;
  card: {
    id: string;
    columnId: string;
    title: string;
  };
}

export interface ActiveDragItem {
  id: string;
  type: DragType;
  columnId: string;
  title: string;
}
