import { Column } from "./types";
import { arrayMove } from "@dnd-kit/sortable";

/**
 * Move a card between two different columns.
 */
export function moveCardBetweenColumns(
  boardData: Column[],
  activeId: string,
  activeColumnId: string,
  overColumnId: string
): Column[] {
  return boardData.map((col) => {
    if (col.id === activeColumnId) {
      return { ...col, items: col.items.filter((item) => item.id !== activeId) };
    }
    if (col.id === overColumnId) {
      const activeCard = boardData
        .find((c) => c.id === activeColumnId)
        ?.items.find((i) => i.id === activeId);
      if (!activeCard) return col;
      return { ...col, items: [...col.items, activeCard] };
    }
    return col;
  });
}

/**
 * Reorder cards within the same column.
 */
export function reorderCardsInColumn(
  boardData: Column[],
  columnId: string,
  activeId: string,
  overId: string
): Column[] {
  return boardData.map((col) => {
    if (col.id === columnId) {
      const oldIndex = col.items.findIndex((i) => i.id === activeId);
      const newIndex = col.items.findIndex((i) => i.id === overId);
      if (oldIndex === -1 || newIndex === -1) return col;
      return { ...col, items: arrayMove(col.items, oldIndex, newIndex) };
    }
    return col;
  });
}

/**
 * Reorder entire columns.
 */
export function reorderColumns(
  boardData: Column[],
  activeId: string,
  overId: string
): Column[] {
  const oldIndex = boardData.findIndex((col) => col.id === activeId);
  const newIndex = boardData.findIndex((col) => col.id === overId);
  if (oldIndex === -1 || newIndex === -1) return boardData;
  return arrayMove(boardData, oldIndex, newIndex);
}
