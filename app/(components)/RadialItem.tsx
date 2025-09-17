"use client";
import { cn } from "@/lib/utils";
import { useFeatureStore } from "@/store/useFeatureStore";
import { Feature } from "@/types/types";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

export default function RadialItem({
  path,
  i,
  cx,
  cy,
  startAngle,
  endAngle,
  innerR,
  outerR,
  feature,
}: {
  path: string;
  i: number;
  cx: number; // 圓心 X
  cy: number; // 圓心 Y
  startAngle: number;
  endAngle: number;
  innerR: number;
  outerR: number;
  feature: Feature;
}) {
  // slice 中心角度
  const midAngle = (startAngle + endAngle) / 2;
  // 內外半徑中點
  const r = (innerR + outerR) / 2;
  const x = cx + Math.cos(midAngle) * r;
  const y = cy + Math.sin(midAngle) * r;

  const [isTextHover, setIsTextHover] = useState(false);
  const handleMouseEnter = useCallback(() => setIsTextHover(true), []);
  const handleMouseLeave = useCallback(() => setIsTextHover(false), []);

  const { openModal } = useFeatureStore();

  return (
    <>
      <motion.path
        d={path}
        className={cn(
          "fill-white/5 stroke-white/20 hover:fill-primary/20",
          isTextHover && "fill-primary/30"
        )}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: i * 0.1,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      />
      <foreignObject x={x - 50} y={y - 20} width={100} height={40}>
          <div
            onClick={() => openModal(feature.id)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="cursor-target font-semibold w-full h-full flex items-center justify-center text-sm dark:text-white text-black select-none"
          >
            {feature.title}
          </div>
      </foreignObject>
    </>
  );
}
