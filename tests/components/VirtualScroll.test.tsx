import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import VirtualizedInfiniteScrollWrapper from "@/features/virtualScroll/VirtualizedInfiniteScroll";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the AnimatedItem to render its children directly
vi.mock("@/features/virtualScroll/AnimatedItem", () => ({
  AnimatedItem: ({ children }: { children: React.ReactNode }) => (
    <div role="listitem">{children}</div>
  ),
}));

// --- Mock IntersectionObserver ---
const mockIntersectionObserver = vi.fn();
vi.mock("@/components/IntersectionTrigger", () => ({
  default: ({ onVisible }: { onVisible: () => void }) => {
    mockIntersectionObserver(onVisible);
    return <div data-testid="intersection-trigger" />;
  },
}));

// Helper to generate items for our mock loadMore
const generateMockItems = (count: number, page: number) =>
  Array.from({ length: count }, (_, i) => ({
    title: `Item ${count * (page - 1) + i + 1}`,
  }));

describe("VirtualizedInfiniteScroll", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    mockIntersectionObserver.mockClear();
    queryClient.clear();
  });

  const renderComponent = (loadMoreMock: () => Promise<{ title: string }[]>) =>
    render(
      <QueryClientProvider client={queryClient}>
        <VirtualizedInfiniteScrollWrapper
          itemHeight={80}
          containerHeight={400}
          loadMore={loadMoreMock}
        />
      </QueryClientProvider>
    );

  it("should render only visible items on initial load", async () => {
    const loadMoreMock = vi.fn().mockResolvedValue(generateMockItems(15, 1));
    renderComponent(loadMoreMock);

    // Wait for the list to appear and check its contents
    const list = await screen.findByRole("list");
    const items = await within(list).findAllByRole("listitem");

    expect(loadMoreMock).toHaveBeenCalledOnce();
    // Due to virtualization (400px container / 80px item), only 5 items should be rendered
    expect(items.length).toBe(5);
    expect(within(items[0]).getByText("Item 1")).toBeInTheDocument();

    // Check that the component knows about all 15 items by checking the total height
    const scrollableContent = screen.getByTestId("scroll-content");
    expect(scrollableContent.style.height).toBe(`${15 * 80}px`);
  });

  it("should fetch next page and update scroll height when triggered", async () => {
    const loadMoreMock = vi.fn()
      .mockResolvedValueOnce(generateMockItems(15, 1))
      .mockResolvedValueOnce(generateMockItems(15, 2));

    renderComponent(loadMoreMock);

    // 1. Wait for initial items and get scroll container
    await screen.findByText("Item 1");
    const scrollableContent = screen.getByTestId("scroll-content");
    expect(scrollableContent.style.height).toBe(`${15 * 80}px`);

    // 2. Get the onVisible callback and trigger it
    const onVisibleCallback = mockIntersectionObserver.mock.calls?.at(-1)?.[0];
    onVisibleCallback();

    // 3. Wait for the DOM to update first (the most reliable async result)
    await waitFor(() => {
      expect(scrollableContent.style.height).toBe(`${30 * 80}px`);
    });

    // 4. Now that the DOM has updated, assert on the side effects
    expect(loadMoreMock).toHaveBeenCalledTimes(2);
    expect(loadMoreMock).toHaveBeenCalledWith(2);
  });

  it("should display 'No more items' when the last page is reached", async () => {
    const loadMoreMock = vi.fn()
      .mockResolvedValueOnce(generateMockItems(15, 1))
      .mockResolvedValueOnce([]); // Return an empty array for the second page

    renderComponent(loadMoreMock);

    // 1. Wait for initial items
    await screen.findByText("Item 1");

    // 2. Trigger the fetch for the next (and last) page
    const onVisibleCallback = mockIntersectionObserver.mock.calls?.at(-1)?.[0];
    onVisibleCallback();

    // 3. Wait for the "No more items" text to appear
    await screen.findByText("No more items");

    // 4. Assert that the trigger component is no longer rendered
    expect(screen.queryByTestId("intersection-trigger")).not.toBeInTheDocument();
    // And that loadMore was not called a third time
    expect(loadMoreMock).toHaveBeenCalledTimes(2);
  });
});