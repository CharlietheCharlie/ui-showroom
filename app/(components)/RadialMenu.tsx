"use client";
import { Dialog } from "@/components/ui/dialog";
import RadialItem from "./RadialItem";
import FeatureDialog from "./FeatureDialog";
import { useFeatureStore } from "@/store/useFeatureStore";
import dynamic from "next/dynamic";
const MyIcon = dynamic(() => import("@/components/MyIcon"), { ssr: false });


function polarToCartesian(angle: number, r: number) {
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}



export default function RadialMenu() {
  const { activeFeature, featuresData, closeModal } = useFeatureStore();

  const sliceAngle = (2 * Math.PI) / Object.keys(featuresData).length;
  const innerRadius = 100;
  const outerRadius = 200;

  return (
    <Dialog  open={!!activeFeature} onOpenChange={(open) => !open && closeModal()}>
       <div className="size-40 md:size-60 lg:size-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <MyIcon />
      </div>
      <div className="w-full h-screen flex items-center justify-center">
        <svg
          width={850}
          height={850}
          viewBox="-250 -250 500 500"
          className="relative rounded-full"
        >
          {featuresData.map((feature, i) => {
            const start = i * sliceAngle - Math.PI / 2;
            const end = start + sliceAngle;

            const [x1, y1] = polarToCartesian(start, outerRadius);
            const [x2, y2] = polarToCartesian(end, outerRadius);
            const [x3, y3] = polarToCartesian(end, innerRadius);
            const [x4, y4] = polarToCartesian(start, innerRadius);

            const path = `
            M${x1},${y1}
            A${outerRadius},${outerRadius} 0 0,1 ${x2},${y2}
            L${x3},${y3}
            A${innerRadius},${innerRadius} 0 0,0 ${x4},${y4}
            Z
          `;

            return (
                <RadialItem
                  key={feature.id}
                  path={path}
                  i={i}
                  cx={0}
                  cy={0}
                  startAngle={start}
                  endAngle={end}
                  innerR={innerRadius}
                  outerR={outerRadius}
                  feature={feature}
                />
            );
          })}
        </svg>
      </div>
      <FeatureDialog></FeatureDialog>
    </Dialog>
  );
}
