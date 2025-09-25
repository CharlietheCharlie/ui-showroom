import { NextResponse } from "next/server";

export async function GET() {
  const kanbanData = [
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

  return NextResponse.json(kanbanData);
}

export async function PUT(request: Request) {
  const data = await request.json();
  return NextResponse.json(data);
}
