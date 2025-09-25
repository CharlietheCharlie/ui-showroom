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
  closestCenter,
  CollisionDetection,
  rectIntersection,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { createPortal } from "react-dom";
import Column from "./Column";
import { Column as ColumnType, Card as CardType } from ".";
import Card from "./Card";

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

    const { activeColumn, overColumn, activeId, overId } =
      getActiveAndOverData(event);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    setBoardData((prev) => {
      const activeItems = [...activeColumn.items];
      const overItems = [...overColumn.items];

      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const [movedItem] = activeItems.splice(activeIndex, 1);

      overItems.push(movedItem);

      return prev.map((col) => {
        if (col.id === activeColumn.id) {
          return { ...col, items: activeItems };
        }
        if (col.id === overColumn.id) {
          return { ...col, items: overItems };
        }
        return col;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);
    const { activeId, overId, active, activeColumn, overColumn } =
      getActiveAndOverData(event);

    if (activeId === overId) return;

    // Reordering columns
    if (active?.type === "column" && overColumn) {
      setBoardData((prev) => {
        const oldIndex = prev.findIndex((col) => col.id === activeId);
        const newIndex = prev.findIndex((col) => col.id === overColumn.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
      return;
    }

    // Reordering cards
    if (active?.type === "card") {
      if (activeColumn && overColumn && activeColumn.id === overColumn.id) {
        setBoardData((prev) => {
          return prev.map((col) => {
            if (col.id === activeColumn.id) {
              const oldIndex = col.items.findIndex(
                (item) => item.id === activeId
              );
              const newIndex = col.items.findIndex(
                (item) => item.id === overId
              );
              if (oldIndex === -1 || newIndex === -1) return col; // safety check
              return {
                ...col,
                items: arrayMove(col.items, oldIndex, newIndex),
              };
            }
            return col;
          });
        });
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
