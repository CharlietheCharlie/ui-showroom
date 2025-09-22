
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VirtualScrollFeature from '@/features/virtualScroll';

// Mock the AnimatedItem to render its children directly
// This avoids dealing with motion and IntersectionObserver in unit tests
vi.mock('@/features/virtualScroll/AnimatedItem', () => ({
  AnimatedItem: ({ children }: { children: React.ReactNode }) => <div role="listitem">{children}</div>,
}));

describe('VirtualScrollFeature', () => {
  it('should render the feature title and description', async () => {
    render(<VirtualScrollFeature />);
    
    expect(screen.getByRole('heading', { name: /Virtual Scroll Component/i })).toBeInTheDocument();
    expect(screen.getByText(/This is where the huge amount of list items are rendered/i)).toBeInTheDocument();

    // Wait for the component to finish its async updates to avoid act() warnings
    expect(await screen.findByText('Item 1')).toBeInTheDocument();
  });

  it('should render the virtualized list with initial items', async () => {
    render(<VirtualScrollFeature />);

    // The component generates 100,000 items, but should only render a few.
    // containerHeight={400} and itemHeight={80}, so visibleCount is 400/80 = 5.
    // The component logic adds a buffer, so we expect a few more than 5.
    const list = screen.getByRole('list');
    
    // Use `findAllByRole` which waits for elements to appear.
    const items = await within(list).findAllByRole('listitem');
    
    // Check that only a small subset of items are rendered
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThan(20); // A reasonable upper bound for virtualization

    // Check if the first item is rendered correctly
    expect(within(items[0]).getByText('Item 1')).toBeInTheDocument();
  });

  it('should not render items that are outside the initial visible range', async () => {
    render(<VirtualScrollFeature />);

    // Wait for the list to populate before checking what's not there
    await screen.findByText('Item 1');

    // Item 50 should definitely not be in the DOM initially
    expect(screen.queryByText('Item 50')).not.toBeInTheDocument();
  });
});
