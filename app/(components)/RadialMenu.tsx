import { Dialog } from "@/components/ui/dialog";
import RadialItem from "./RadialItem";
import FeatureDialog from "./FeatureDialog";
import { DialogTrigger } from "@radix-ui/react-dialog";

function polarToCartesian(angle: number, r: number) {
  return [Math.cos(angle) * r, Math.sin(angle) * r];
}

const featuresData: any[] = [
  {
    title: "Feature 1",
  },
  {
    title: "Feature 2",
  },
  {
    title: "Feature 3",
  },
];

export default function RadialMenu() {
  const sliceAngle = (2 * Math.PI) / featuresData.length;
  const innerRadius = 100;
  const outerRadius = 200;

  return (
    <Dialog>
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
                  key={i}
                  path={path}
                  i={i}
                  label={feature.title}
                  cx={0}
                  cy={0}
                  startAngle={start}
                  endAngle={end}
                  innerR={innerRadius}
                  outerR={outerRadius}
                />
            );
          })}
        </svg>
      </div>
      <FeatureDialog>{featuresData[0].title}</FeatureDialog>
    </Dialog>
  );
}
