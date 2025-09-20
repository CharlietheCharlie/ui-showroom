// This file extends Vitest's 'expect' with custom matchers from jest-dom,
// making it easier to write assertions for DOM nodes.
// For example: expect(element).toBeInTheDocument();

import '@testing-library/jest-dom/vitest';
import ResizeObserver from 'resize-observer-polyfill';
import { vi } from 'vitest';

// Mock ResizeObserver globally
vi.stubGlobal('ResizeObserver', ResizeObserver);

