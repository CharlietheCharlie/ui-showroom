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
    setTimeout(() => resolve(items), 800);
  });
}

export default function VirtualScrollFeature() {
  const loadmore = useCallback((page: number) => {
    console.log("load page", page);
    return generateItems(50000, page);
  }, []);
  return (
    <VirtualizedInfiniteScroll
      className="mt-4 bg-background/10"
      itemHeight={80}
      containerHeight={400}
      loadMore={loadmore}
    />
  );
}
