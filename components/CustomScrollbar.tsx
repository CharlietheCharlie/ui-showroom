"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CustomScrollbarProps = {
  height: number;
  contentHeight: number;
  children: (
    containerRef: React.RefObject<HTMLDivElement | null>
  ) => React.ReactNode;
  handleScroll?: (el: HTMLDivElement) => void;
  className?: string;
};

export default function CustomScrollbar({
  height,
  contentHeight,
  children,
  handleScroll,
  className,
}: CustomScrollbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const { clientHeight, scrollHeight } = el;
    if (scrollHeight <= clientHeight) {
      setThumbHeight(0); 
    } else {
      const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 20);
      setThumbHeight(thumbHeight);
    }
  }, [contentHeight]);

  const onScroll = () => {
    const el = containerRef.current!;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const ratio = scrollTop / (scrollHeight - clientHeight);
    setThumbTop(ratio * (clientHeight - thumbHeight));
    if(handleScroll) handleScroll(el);
  };

  const onThumbPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startTop = thumbTop;
  
    const onMove = (ev: PointerEvent) => {
      const delta = ev.clientY - startY;
      const newTop = Math.min(
        Math.max(0, startTop + delta),
        containerRef.current!.clientHeight - thumbHeight
      );
      setThumbTop(newTop);
  
      const ratio = newTop / (containerRef.current!.clientHeight - thumbHeight);
      containerRef.current!.scrollTop =
        ratio *
        (containerRef.current!.scrollHeight -
          containerRef.current!.clientHeight);
    };
  
    const onEnd = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onEnd);
    };
  
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onEnd);
  };
  
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ height }}
    >
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="h-full overflow-y-auto pr-10 -mr-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children(containerRef)}
      </div>
      <div className="absolute right-2 top-0 bottom-0 w-2 bg-gray-200/40 rounded">
        <div
          ref={thumbRef}
          onPointerDown={onThumbPointerDown}
          className="w-4 absolute left-1/2 -translate-x-1/2 bg-primary rounded active:bg-primary/70"
          style={{
            height: thumbHeight,
            transform: `translateY(${thumbTop}px)`,
          }}
        />
      </div>
    </div>
  );
}
