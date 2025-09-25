import { describe, it, expect } from "vitest";
import {
  moveCardBetweenColumns,
  reorderCardsInColumn,
  reorderColumns,
} from "@/features/dragAndDrop/utils";
import { Column } from "@/features/dragAndDrop/types";

const mockData: Column[] = [
  {
    id: "col-1",
    title: "Todo",
    items: [
      { id: "card-1", title: "Task 1" },
      { id: "card-2", title: "Task 2" },
    ],
  },
  {
    id: "col-2",
    title: "In Progress",
    items: [{ id: "card-3", title: "Task 3" }],
  },
];

describe("boardUtils", () => {
  it("moves a card between columns", () => {
    const result = moveCardBetweenColumns(mockData, "card-1", "col-1", "col-2");
    expect(result[0].items).toHaveLength(1);
    expect(result[1].items).toHaveLength(2);
    expect(result[1].items.map((i) => i.id)).toContain("card-1");
  });

  it("reorders cards in the same column", () => {
    const result = reorderCardsInColumn(mockData, "col-1", "card-1", "card-2");
    expect(result[0].items[0].id).toBe("card-2");
    expect(result[0].items[1].id).toBe("card-1");
  });

  it("reorders columns", () => {
    const result = reorderColumns(mockData, "col-1", "col-2");
    expect(result[0].id).toBe("col-2");
    expect(result[1].id).toBe("col-1");
  });

  it("ignores reorder if card not found", () => {
    const result = reorderCardsInColumn(mockData, "col-1", "task-x", "task-y");
    const col1 = result.find((c) => c.id === "col-1")!;
    expect(col1.items.map((i) => i.id)).toEqual(["card-1", "card-2"]);
  });

  it("ignores reorder if column not found", () => {
    const result = reorderColumns(mockData, "col-x", "col-y");
    expect(result.map((c) => c.id)).toEqual(["col-1", "col-2"]);
  });
});
