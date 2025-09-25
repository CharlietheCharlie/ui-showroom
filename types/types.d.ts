import { LazyExoticComponent } from "react";

export type Feature = {
    id: number | string;
    title: string;
    description: string;
    techStack: string[];
    component: LazyExoticComponent<() => JSX.Element>;
}


