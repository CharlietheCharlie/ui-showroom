import { useRef } from "react";
import Board from "./Board";

export type KanbanItem = {
    id: string;
    title: string;
    items: {id: string, title: string}[];
}

const kanbanData: KanbanItem[] = [
    {
        id: 'todo',
        title: 'To do',
        items: [
            {id: 'task-1', title: 'Implement user authentication'},
            {id: 'task-2', title: 'Design database schema'},
            {id: 'task-3', title: 'Setup project structure'},
        ],
    },
    {
        id: 'inprogress',
        title: 'In Progress',
        items: [
            {id: 'task-4', title: 'Develop API for posts'},
        ],
    },
    {
        id: 'done',
        title: 'Done',
        items: [
            {id: 'task-5', title: 'Create landing page'},
        ],
    },
]

export default function DragAndDropFeature() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="p-8 h-full overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
            <Board initialData={kanbanData} portalContainer={containerRef.current}/>
        </div>
    )
}
