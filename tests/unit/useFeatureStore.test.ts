import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useFeatureStore } from '@/store/useFeatureStore';
import { featuresData } from '@/public/datas/feature';

// Vitest doesn't automatically reset Zustand state between tests.
// We need to manually reset it to ensure test isolation.
const initialState = useFeatureStore.getInitialState();

beforeEach(() => {
  act(() => {
    useFeatureStore.setState(initialState);
  });
});

describe('useFeatureStore', () => {
  it('should have the correct initial state', () => {
    const { result } = renderHook(() => useFeatureStore());

    expect(result.current.activeFeature).toBeNull();
    expect(result.current.featuresData).toEqual(featuresData);
    expect(result.current.features).toEqual({});
  });

  it('openModal should set the activeFeature correctly', () => {
    const { result } = renderHook(() => useFeatureStore());
    const featureToOpen = featuresData[0]; // Let's open the first feature

    act(() => {
      result.current.openModal(featureToOpen.id);
    });

    expect(result.current.activeFeature).not.toBeNull();
    expect(result.current.activeFeature?.id).toBe(featureToOpen.id);
    expect(result.current.activeFeature?.title).toBe(featureToOpen.title);
  });

  it('openModal should handle non-existent feature id', () => {
    const { result } = renderHook(() => useFeatureStore());

    act(() => {
      result.current.openModal('non-existent-id');
    });

    expect(result.current.activeFeature).toBeNull();
  });

  it('closeModal should reset the activeFeature to null', () => {
    const { result } = renderHook(() => useFeatureStore());
    const featureToOpen = featuresData[1];

    // First, open a modal
    act(() => {
      result.current.openModal(featureToOpen.id);
    });

    // Ensure it's open
    expect(result.current.activeFeature).not.toBeNull();

    // Then, close it
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.activeFeature).toBeNull();
  });
});
