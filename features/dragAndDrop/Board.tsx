"use client";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCorners,
  DragOverlay,
  DropAnimation,
  defaultDropAnimationSideEffects,
  CollisionDetection,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { createPortal } from "react-dom";
import Column from "./Column";
import { Column as ColumnType, Card as CardType } from "./types";
import Card from "./Card";
import {
  moveCardBetweenColumns,
  reorderCardsInColumn,
  reorderColumns,
} from "./utils";

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

interface ColumnActive {
  type: "column";
  column: ColumnType;
}

interface CardActive {
  type: "card";
  item: CardType;
}

type ActiveItem = ColumnActive | CardActive;

export default function Board({ initialData }: { initialData: ColumnType[] }) {
  const [boardData, setBoardData] = useState(initialData);
  const [activeItem, setActiveItem] = useState<ActiveItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px drag needed to start
      },
    })
  );

  const findColumn = (id: string) => {
    return boardData.find((col) => col.id === id);
  };

  const findCardColumn = (cardId: string) => {
    return boardData.find((col) =>
      col.items.some((item) => item.id === cardId)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log(active);
    setActiveItem(active.data.current as ActiveItem);
  };

  const getActiveAndOverData = (event: DragOverEvent) => {
    const { active, over } = event;
    const activeId = active.id as string;
    const overId = over?.id as string;
    const activeColumn =
      active.data.current?.type === "card"
        ? findCardColumn(active.id as string)
        : findColumn(active.id as string);
    const overColumn =
      over?.data.current?.type === "card"
        ? findCardColumn(over.id as string)
        : findColumn(over?.id as string);
    return {
      active: active.data.current as ActiveItem,
      over: over?.data.current as ActiveItem,
      activeId,
      overId,
      activeColumn,
      overColumn,
    };
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.type !== "card") return;

    const { activeColumn, overColumn, activeId } = getActiveAndOverData(event);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    setBoardData((prev) =>
      moveCardBetweenColumns(prev, activeId, activeColumn.id, overColumn.id)
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { activeId, overId, active, activeColumn, overColumn } =
      getActiveAndOverData(event);

    if (activeId === overId) return;

    // reorder columns
    if (active?.type === "column" && overColumn) {
      setBoardData((prev) => reorderColumns(prev, activeId, overColumn.id));
      return;
    }

    // reorder cards
    if (active?.type === "card" && activeColumn && overColumn) {
      if (activeColumn.id === overColumn.id) {
        setBoardData((prev) =>
          reorderCardsInColumn(prev, activeColumn.id, activeId, overId)
        );
      }
    }
  };

  const customCollisionDetection: CollisionDetection = (args) => {
    const { active, droppableContainers } = args;

    // 如果拖的是 Column → 過濾掉所有 card
    if (active.data.current?.type === "column") {
      return rectIntersection({
        ...args,
        droppableContainers: droppableContainers.filter(
          (c) => c.data.current?.type === "column"
        ),
      });
    }
    return closestCorners(args);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={boardData.map((col) => col.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-6">
          {boardData.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              items={col.items}
            />
          ))}
        </div>
      </SortableContext>

      {createPortal(
        <DragOverlay
          dropAnimation={dropAnimation}
          modifiers={[restrictToFirstScrollableAncestor]}
        >
          {activeItem?.type === "column" && (
            <Column
              id={activeItem.column.id}
              title={activeItem.column.title}
              items={activeItem.column.items}
            />
          )}
          {activeItem?.type === "card" && (
            <Card id={activeItem.item.id} title={activeItem.item.title} />
          )}
        </DragOverlay>,
        document.body
      )}
      {/* 使用createPortal重新定位，避免modal導致的位移 */}
    </DndContext>
  );
}
