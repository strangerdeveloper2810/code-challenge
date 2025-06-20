/**
 * Test Setup Configuration
 * Global test utilities and mocks
 */

import "@testing-library/jest-dom";
import { vi, beforeAll, afterAll } from "vitest";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => {
  const mockToast = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    remove: vi.fn(),
    promise: vi.fn(),
  });

  return {
    default: mockToast,
    toast: mockToast,
    Toaster: () => null,
  };
});

// Mock API endpoints for consistent testing
globalThis.fetch = vi.fn();

// Suppress console errors in tests unless debugging
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
