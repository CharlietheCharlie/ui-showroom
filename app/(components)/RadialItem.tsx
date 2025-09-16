"use client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";

export default function RadialItem({
  path,
  i,
  label,
  cx,
  cy,
  startAngle,
  endAngle,
  innerR,
  outerR,
}: {
  path: string;
  i: number;
  label: string;
  cx: number; // 圓心 X
  cy: number; // 圓心 Y
  startAngle: number;
  endAngle: number;
  innerR: number;
  outerR: number;
}) {
  // slice 中心角度
  const midAngle = (startAngle + endAngle) / 2;
  // 內外半徑中點
  const r = (innerR + outerR) / 2;
  const x = cx + Math.cos(midAngle) * r;
  const y = cy + Math.sin(midAngle) * r;

  return (
    <>
      <DialogTrigger asChild>
        <motion.path
          d={path}
          className="fill-white/5 stroke-white/20 hover:fill-primary/20 cursor-pointer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: i * 0.1,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        />
      </DialogTrigger>
      <foreignObject
        x={x - 50}
        y={y - 20}
        width={100}
        height={40}
        className="pointer-events-none"
      >
        <div className="w-full h-full flex items-center justify-center text-sm dark:text-white text-black select-none">
          {label}
        </div>
      </foreignObject>
    </>
  );
}
