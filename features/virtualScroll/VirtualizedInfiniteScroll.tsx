"use client";
import { Suspense, use, useMemo, useRef, useState } from "react";
import { AnimatedItem } from "./AnimatedItem";
import { cn } from "@/lib/utils";
import { SkeletonArray } from "@/components/Skeleton";
import CustomScrollbar from "@/components/CustomScrollbar";
import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import IntersectionTrigger from "@/components/IntersectionTrigger";

type VirtualizedInfiniteScrollProps<T> = {
  itemHeight: number;
  containerHeight: number;
  loadMore: (page: number) => Promise<T[]>;
  className?: string;
};

export default function VirtualizedInfiniteScrollWrapper(
  props: VirtualizedInfiniteScrollProps<{ title: string }>
) {
  return (
    <Suspense
      fallback={
        <ListSkeleton
          className={props.className}
          containerHeight={props.containerHeight}
          itemHeight={props.itemHeight}
        ></ListSkeleton>
      }
    >
      <VirtualizedInfiniteScroll {...props} />
    </Suspense>
  );
}

function VirtualizedInfiniteScroll<T extends { title: string }>({
  itemHeight,
  containerHeight,
  loadMore,
  className,
}: VirtualizedInfiniteScrollProps<T>) {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["infinite-items"],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => loadMore(pageParam),
      getNextPageParam: (lastPage, pages) => {
        const totalItems = pages.flat().length; // 把已加載的頁面攤平成一個陣列
        if (lastPage.length === 0) return undefined; // 這一頁沒資料，表示到底了
        if (totalItems >= 200_000) return undefined; // 超過20萬筆就停
        return pages.length + 1; // 繼續下一頁
      },
      staleTime: Infinity,
    });

  const items = data?.pages.flat() ?? [];

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const [range, setRange] = useState({ start: 0, end: visibleCount });

  const visibleItems = items.slice(range.start, range.end);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleScroll = (scrollContainer: HTMLDivElement) => {
    const scrollTop = scrollContainer.scrollTop;
    const start = Math.floor(scrollTop / itemHeight);
    const end = start + visibleCount;
    setRange({ start, end });
  };

  return (
    <CustomScrollbar
      height={containerHeight}
      handleScroll={handleScroll}
      className={className}
      contentHeight={totalHeight}
    >
      {() => (
        <div
          style={{ height: totalHeight, position: "relative" }}
          data-testid="scroll-content"
        >
          <div
            style={{ transform: `translateY(${range.start * itemHeight}px)` }}
            role="list"
          >
            {visibleItems.map((item, index) => {
              const actualIndex = range.start + index;
              return (
                <AnimatedItem
                  onClick={() => setSelectedIndex(actualIndex)}
                  key={actualIndex}
                  index={actualIndex}
                  delay={index * 0.1}
                >
                  <Item
                    item={item}
                    itemHeight={itemHeight}
                    isSelected={actualIndex === selectedIndex}
                  />
                </AnimatedItem>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              top: `${items.length * itemHeight + itemHeight/2}px`, // Positioned after all loaded items
              height: itemHeight,
              width: "100%",
            }}
            className="flex items-center justify-center"
          >
            {isFetchingNextPage
              ? "Loading..."
              : hasNextPage
              ? <IntersectionTrigger rootMargin={itemHeight / 2 + "px"} onVisible={fetchNextPage} />
              : "No more items"}
          </div>
        </div>
      )}
    </CustomScrollbar>
  );
}

function ListSkeleton({
  containerHeight,
  itemHeight,
  className,
}: {
  containerHeight: number;
  itemHeight: number;
  className?: string;
}) {
  return (
    <div style={{ height: containerHeight }} className={className}>
      <SkeletonArray amount={5}>
        <div
          style={{ height: itemHeight }}
          className="bg-secondary rounded-lg w-full animate-pulse mb-4"
        ></div>
      </SkeletonArray>
    </div>
  );
}

function Item<T extends { title: string }>({
  item,
  isSelected,
  itemHeight,
}: {
  item: T;
  isSelected?: boolean;
  itemHeight?: number;
}) {
  return (
    <div
      style={{ height: itemHeight }}
      className={cn(
        "p-4 opacity-75 mb-4 rounded-2xl flex items-center",
        isSelected
          ? "bg-primary text-primary-foreground hover:bg-primary"
          : "bg-gray-100 hover:bg-primary/10 dark:bg-gray-800 dark:hover:bg-gray-700 drak:text-white"
      )}
    >
      <p className=" m-0">{item.title}</p>
    </div>
  );
}
