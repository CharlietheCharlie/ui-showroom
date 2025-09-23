"use client";
import { useEffect, useRef } from "react";

type IntersectionTriggerProps = {
  onVisible: () => void;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  className?: string;
};

export default function IntersectionTrigger({
  onVisible,
  root = null,
  rootMargin = "0px",
  threshold = 0.1,
  className,
}: IntersectionTriggerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onVisible();
        }
      },
      { root, rootMargin, threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onVisible, root, rootMargin, threshold]);

  return <div ref={ref} className={className} />;
}
