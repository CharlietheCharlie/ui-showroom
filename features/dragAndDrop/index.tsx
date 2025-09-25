import { useEffect, useRef, useState } from "react";
import Board from "./Board";

export type Column = {
  id: string;
  title: string;
  items: Card[];
};

export type Card = {
  id: string;
  title: string;
};

const kanbanData: Column[] = [
  {
    id: "todo",
    title: "To do",
    items: [
      { id: "task-1", title: "Implement user authentication" },
      { id: "task-2", title: "Design database schema" },
      { id: "task-3", title: "Setup project structure" },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    items: [{ id: "task-4", title: "Develop API for posts" }],
  },
  {
    id: "done",
    title: "Done",
    items: [{ id: "task-5", title: "Create landing page" }],
  },
];

export default function DragAndDropFeature() {

  return (
    <div className="h-full overflow-auto">
        <Board initialData={kanbanData} />
    </div>
  );
}
