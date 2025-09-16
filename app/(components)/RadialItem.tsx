"use client";
import { motion } from "framer-motion";

export default function RadialItem({
  path,
  i,
}: {
  path: string;
  i: number;
}) {
  return (
    <motion.path
      d={path}
      className="fill-white/10 stroke-white/20 hover:fill-white/20 cursor-pointer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: i * 0.1, type: "spring" }}
    />
  );
}
