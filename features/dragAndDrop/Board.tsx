'use client';
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
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import Column from './Column';
import { KanbanItem } from '.';
import Card from './Card';

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export default function Board({ initialData, portalContainer }: { initialData: KanbanItem[], portalContainer: HTMLElement | null }) {
  const [boardData, setBoardData] = useState(initialData);
  const [activeItem, setActiveItem] = useState<KanbanItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px drag needed to start
      },
    })
  );

  const findColumn = (id: string) => {
    return boardData.find(col => col.id === id);
  };

  const findCardColumn = (cardId: string) => {
    return boardData.find(col => col.items.some(item => item.id === cardId));
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItem(active.data.current);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.data.current?.type !== 'card') return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findCardColumn(activeId);
    const overColumn = over.data.current?.type === 'card' ? findCardColumn(overId) : findColumn(overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    setBoardData(prev => {
      const activeItems = [...activeColumn.items];
      const overItems = [...overColumn.items];

      const activeIndex = activeItems.findIndex(item => item.id === activeId);
      const [movedItem] = activeItems.splice(activeIndex, 1);
      
      overItems.push(movedItem);

      return prev.map(col => {
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
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Reordering columns
    if (active.data.current?.type === 'column' && over.data.current?.type === 'column') {
      setBoardData(prev => {
        const oldIndex = prev.findIndex(col => col.id === activeId);
        const newIndex = prev.findIndex(col => col.id === overId);
        return arrayMove(prev, oldIndex, newIndex);
      });
      return;
    }

    // Reordering cards
    if (active.data.current?.type === 'card') {
      const activeColumn = findCardColumn(activeId);
      const overColumn = findCardColumn(overId);

      if (activeColumn && overColumn && activeColumn.id === overColumn.id) {
        setBoardData(prev => {
          return prev.map(col => {
            if (col.id === activeColumn.id) {
              const oldIndex = col.items.findIndex(item => item.id === activeId);
              const newIndex = col.items.findIndex(item => item.id === overId);
              if (oldIndex === -1 || newIndex === -1) return col; // safety check
              return { ...col, items: arrayMove(col.items, oldIndex, newIndex) };
            }
            return col;
          });
        });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={boardData.map(col => col.id)} strategy={horizontalListSortingStrategy}>
        <div className="flex gap-6">
          {boardData.map(col => (
            <Column key={col.id} id={col.id} title={col.title} items={col.items} />
          ))}
        </div>
      </SortableContext>

      {portalContainer && createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeItem?.type === 'column' && (
            <Column id={activeItem.column.id} title={activeItem.column.title} items={activeItem.column.items} />
          )}
          {activeItem?.type === 'card' && (
            <Card id={activeItem.item.id} title={activeItem.item.title} />
          )}
        </DragOverlay>,
        portalContainer
      )}
    </DndContext>
  );
}
