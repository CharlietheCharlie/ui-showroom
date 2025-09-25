import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "./Card";
import { Column as ColumnType } from "./types";

export default function Column({ id, title, items }: ColumnType) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "column",
      column: { id, title, items },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      role="region"
      aria-label={title}
      ref={setNodeRef}
      style={style}
      className="w-80 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-4"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <h2 data-testid="column-title" className="font-bold text-lg">{title}</h2>
      </div>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <Card key={item.id} id={item.id} title={item.title} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
