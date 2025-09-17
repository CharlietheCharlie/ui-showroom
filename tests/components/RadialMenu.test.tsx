import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import { describe, it, expect, beforeEach, vi } from 'vitest';
import RadialMenu from '@/app/(components)/RadialMenu';
import { useFeatureStore } from '@/store/useFeatureStore';

// Mock the feature components to avoid rendering complex, lazy-loaded components
vi.mock('@/features/infiniteScroll', () => ({
  default: () => <div>Mocked Infinite Scroll</div>,
}));

vi.mock('@/features/FeatureTwoComponent', () => ({
  default: () => <div>Mocked Feature Two</div>,
}));

const initialState = useFeatureStore.getInitialState();

beforeEach(() => {
  // Reset store before each test
  act(() => {
    useFeatureStore.setState(initialState);
  });
});

describe('RadialMenu and FeatureDialog Integration', () => {
  it('should not show a dialog initially', () => {
    render(<RadialMenu />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('should open the dialog with correct content when a feature item is clicked', async () => {
    const user = userEvent.setup(); // Setup userEvent
    render(<RadialMenu />);

    const featureButton = screen.getByText('Infinite Scroll');
    expect(featureButton).toBeInTheDocument();

    // Act: Click the button using userEvent
    await user.click(featureButton);

    // Assert: Dialog should now be visible
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const dialogTitle = await screen.findByRole('heading', { name: 'Infinite Scroll' });
    expect(dialogTitle).toBeInTheDocument();

    const featureContent = await screen.findByText('Mocked Infinite Scroll');
    expect(featureContent).toBeInTheDocument();
  });

  it('should close the dialog when the close button is clicked', async () => {
    const user = userEvent.setup();
    render(<RadialMenu />);

    // --- Open the dialog first ---
    const featureButton = screen.getByText('Feature 2');
    await user.click(featureButton);

    // --- Assert it's open ---
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // --- Act: Click the close button ---
    const closeButton = await screen.findByText('close');
    await user.click(closeButton);

    // --- Assert: The dialog should be gone ---
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});