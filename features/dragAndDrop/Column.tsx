import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card from "./Card";

export default function Column({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: {id: string, title: string}[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition} = useSortable({
    id,
    data: {
      type: 'column',
      column: { id, title, items },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-80 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col gap-4"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <h2 className="font-bold text-lg">{title}</h2>
      </div>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <Card key={item.id} id={item.id} title={item.title} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}