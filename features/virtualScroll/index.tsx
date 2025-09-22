import { useCallback } from "react";
import VirtualizedInfiniteScroll from "./VirtualizedInfiniteScroll";

async function generateItems(
  count: number,
  page = 1
): Promise<{ title: string }[]> {
  return new Promise((resolve) => {
    const items = Array.from({ length: count }, (_, i) => ({
      title: `Item ${count * (page - 1) + i + 1}`,
    }));
    setTimeout(() => resolve(items), 100); // Simulate network delay
  });
}

export default function VirtualScrollFeature() {
  const loadMore = useCallback(
    (page: number) => generateItems(100000, page),
    []
  );
  return (
    <div className="overflow-hidden">
      <h3 className="text-lg font-semibold">Virtual Scroll Component</h3>
      <p className="text-sm text-muted-foreground">
        This is where the huge amount of list items are rendered efficiently
        using virtualization and animated on scroll into view.
      </p>
        <VirtualizedInfiniteScroll
          className="mt-4"
          itemHeight={80}
          containerHeight={400}
          loadMore={loadMore}
        />
    </div>
  );
}
