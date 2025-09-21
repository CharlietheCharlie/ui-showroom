import { Feature } from "@/types/types";
import { lazy } from "react";

export const featuresData: Feature[] = [
  {
    id: 0,
    title: "About Me",
    description:
      "A brief introduction about myself, including my background, skills, and interests.",
    techStack: ["React", "TypeScript", "CSS"],
    component: lazy(() => import("@/features/aboutMe")),
  },
  {
    id: 1,
    title: "Infinite Scroll",
    description:
      "A feature that allows users to load more content as they scroll down the page, providing a seamless browsing experience without the need for pagination.",
    techStack: ["React", "Intersection Observer API", "CSS"],
    component: lazy(() => import("@/features/infiniteScroll")),
  },
  {
    id: 2,
    title: "Feature 2",
    description:
      "A feature that allows users to load more content as they scroll down the page, providing a seamless browsing experience without the need for pagination.",
    techStack: ["React", "Intersection Observer API", "CSS"],
    component: lazy(() => import("@/features/FeatureTwoComponent")),
  },
  {
    id: 3,
    title: "Feature 3",
    description:
      "A feature that allows users to load more content as they scroll down the page, providing a seamless browsing experience without the need for pagination.",
    techStack: ["React", "Intersection Observer API", "CSS"],
    component: lazy(() => import("@/features/FeatureTwoComponent")),
  },
];