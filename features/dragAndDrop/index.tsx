"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Board from "./Board";
import { Column } from "./types";

async function fetchBoardData(): Promise<Column[]> {
  const res = await fetch("/api/dragAndDrop");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default function DragAndDropFeature() {
  const { data } = useSuspenseQuery({
    queryKey: ["dragAndDropData"],
    queryFn: fetchBoardData,
  });
  return (
    <div className="h-full overflow-auto">
      {data && <Board initialData={data} />}
    </div>
  );
}
