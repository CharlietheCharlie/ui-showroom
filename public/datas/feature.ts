import { Feature } from "@/types/types";
import { lazy } from "react";

export const featuresData: Feature[] = [
  {
    id: 0,
    title: "About Me",
    description:
      "A brief introduction about myself, including my background, skills, and interests.",
    techStack: [],
    component: lazy(() => import("@/features/aboutMe")),
  },
  {
    id: 1,
    title: "Virtualized Infinite Scroll",
    description:
      "Implemented virtualized scrolling with infinite loading, enabling smooth browsing of 50,000+ records per load.",
    techStack: ["Motion", "Intersection Observer API", "Lazy Loading", "React Query"],
    component: lazy(() => import("@/features/virtualScroll")),
  },
  {
    id: 2,
    title: "Drag and Drop",
    description: "Implemented drag and drop functionality, allowing users to reorder elements.",
    techStack: ["Dnd", "React Query", "Zustand"],
    component: lazy(() => import("@/features/dragAndDrop")),
  },
  
];
