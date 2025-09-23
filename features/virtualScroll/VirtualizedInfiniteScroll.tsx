"use client";
import { Suspense, use, useMemo, useState } from "react";
import { AnimatedItem } from "./AnimatedItem";
import { cn } from "@/lib/utils";
import { SkeletonArray } from "@/components/Skeleton";
import CustomScrollbar from "@/components/CustomScrollbar";

type VirtualizedInfiniteScrollProps<T> = {
  itemHeight: number;
  containerHeight: number;
  loadMore: (page: number) => Promise<T[]>;
  className?: string;
};

export default function VirtualizedInfiniteScrollWrapper(
  props: VirtualizedInfiniteScrollProps<{ title: string }>
) {
  const firstPagePromise = useMemo(() => props.loadMore(1), [props]);

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
      <VirtualizedInfiniteScroll
        {...props}
        firstPagePromise={firstPagePromise}
      />
    </Suspense>
  );
}

function VirtualizedInfiniteScroll<T extends { title: string }>({
  itemHeight,
  containerHeight,
  //   loadMore,
  className,
  firstPagePromise,
}: VirtualizedInfiniteScrollProps<T> & {
  firstPagePromise: Promise<T[]>;
}) {
  //
  const firstPage = use(firstPagePromise);
  //   const [page, setPage] = useState(1);
  const [items] = useState<T[]>(firstPage || []);

  const totalHeight = items.length * itemHeight;

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const [range, setRange] = useState({ start: 0, end: visibleCount });

  const visibleItems = items.slice(range.start, range.end);

  //   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
        <div style={{ height: totalHeight, position: "relative" }}>
          <div
            style={{ transform: `translateY(${range.start * itemHeight}px)` }}
            role="list"
          >
            {visibleItems.map((item, index) => {
              const actualIndex = range.start + index;
              return (
                <AnimatedItem
                  key={actualIndex}
                  index={actualIndex}
                  delay={index * 0.1}
                >
                  <Item
                    item={item}
                    itemHeight={itemHeight}
                    //   isSelected={index === selectedIndex}
                  />
                </AnimatedItem>
              );
            })}
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
        "p-4 hover:bg-primary/10 bg-gray-100 mb-4 rounded-2xl flex items-center",
        isSelected && "bg-primary"
      )}
    >
      <p className=" m-0">{item.title}</p>
    </div>
  );
}
