/**
 * useSwap Hook Test Suite
 * Tests for swap business logic and state management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import toast from "react-hot-toast";
import useSwap from "../useSwap.js";

describe("useSwap Hook", () => {
  const mockTokens = [
    { currency: "ETH", price: 2000 },
    { currency: "BTC", price: 30000 },
    { currency: "USDC", price: 1 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should initialize with empty form data", () => {
      const { result } = renderHook(() => useSwap());

      expect(result.current.state.formData).toEqual({
        fromToken: null,
        toToken: null,
        fromAmount: "",
        toAmount: "",
      });
      expect(result.current.state.isLoading).toBe(false);
      expect(result.current.state.error).toBe(null);
      expect(result.current.state.exchangeRate).toBe(null);
      expect(result.current.state.isValidSwap).toBe(false);
    });

    it("should provide all necessary actions", () => {
      const { result } = renderHook(() => useSwap());

      expect(result.current.actions).toHaveProperty("setFromToken");
      expect(result.current.actions).toHaveProperty("setToToken");
      expect(result.current.actions).toHaveProperty("setFromAmount");
      expect(result.current.actions).toHaveProperty("setToAmount");
      expect(result.current.actions).toHaveProperty("swapTokens");
      expect(result.current.actions).toHaveProperty("resetForm");
      expect(result.current.actions).toHaveProperty("executeSwap");
    });
  });

  describe("Token Selection", () => {
    it("should set from token correctly", () => {
      const { result } = renderHook(() => useSwap());

      act(() => {
        result.current.actions.setFromToken(mockTokens[0]);
      });

      expect(result.current.state.formData.fromToken).toEqual(mockTokens[0]);
    });

    it("should set to token correctly", () => {
      const { result } = renderHook(() => useSwap());

      act(() => {
        result.current.actions.setToToken(mockTokens[1]);
      });

      expect(result.current.state.formData.toToken).toEqual(mockTokens[1]);
    });

    it("should calculate exchange rate when both tokens are set", () => {
      const { result } = renderHook(() => useSwap());

      act(() => {
        result.current.actions.setFromToken(mockTokens[0]); // ETH: $2000
        result.current.actions.setToToken(mockTokens[1]); // BTC: $30000
      });

      // ETH to BTC rate should be 2000/30000 = 0.0667
      expect(result.current.state.exchangeRate).toBeCloseTo(0.0667, 4);
    });
  });

  describe("Amount Handling", () => {
    it("should set from amount with valid input", () => {
      const { result } = renderHook(() => useSwap());

      act(() => {
        result.current.actions.setFromAmount("123.45");
      });

      expect(result.current.state.formData.fromAmount).toBe("123.45");
    });

    it("should reject invalid amount formats", () => {
      const { result } = renderHook(() => useSwap());

      act(() => {
        result.current.actions.setFromAmount("123.45");
      });

      act(() => {
        result.current.actions.setFromAmount("abc"); // Should be rejected
      });

      expect(result.current.state.formData.fromAmount).toBe("123.45"); // Unchanged
    });

    it("should auto-calculate to amount when from amount changes", async () => {
      const { result } = renderHook(() => useSwap());

      // Set up tokens first
      act(() => {
        result.current.actions.setFromToken(mockTokens[0]); // ETH
        result.current.actions.setToToken(mockTokens[1]); // BTC
      });

      // Set from amount
      act(() => {
        result.current.actions.setFromAmount("10");
      });

      // Wait for debounced calculation
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 350));
      });

      // 10 ETH * (2000/30000) = 0.6667 BTC
      expect(parseFloat(result.current.state.formData.toAmount)).toBeCloseTo(
        0.6667,
        4
      );
    });
  });

  describe("Token Swapping", () => {
    it("should swap token positions", () => {
      const { result } = renderHook(() => useSwap());

      // Set initial state
      act(() => {
        result.current.actions.setFromToken(mockTokens[0]);
        result.current.actions.setToToken(mockTokens[1]);
        result.current.actions.setFromAmount("10");
      });

      // Wait for auto-calculation
      act(() => {
        result.current.actions.swapTokens();
      });

      expect(result.current.state.formData.fromToken).toEqual(mockTokens[1]);
      expect(result.current.state.formData.toToken).toEqual(mockTokens[0]);
      expect(toast).toHaveBeenCalledWith("🔄 Tokens swapped!", {
        duration: 2000,
        position: "top-right",
      });
    });
  });

  describe("Form Validation", () => {
    it("should validate complete swap data", () => {
      const { result } = renderHook(() => useSwap());

      act(() => {
        result.current.actions.setFromToken(mockTokens[0]);
        result.current.actions.setToToken(mockTokens[1]);
        result.current.actions.setFromAmount("10");
      });

      expect(result.current.state.isValidSwap).toBe(true);
    });

    it("should invalidate swap with missing tokens", () => {
      const { result } = renderHook(() => useSwap());

      act(() => {
        result.current.actions.setFromAmount("10");
      });

      expect(result.current.state.isValidSwap).toBe(false);
    });

    it("should invalidate swap with same tokens", () => {
      const { result } = renderHook(() => useSwap());

      act(() => {
        result.current.actions.setFromToken(mockTokens[0]);
        result.current.actions.setToToken(mockTokens[0]); // Same token
        result.current.actions.setFromAmount("10");
      });

      expect(result.current.state.isValidSwap).toBe(false);
    });
  });

  describe("Swap Execution", () => {
    it("should execute successful swap", async () => {
      const { result } = renderHook(() => useSwap());

      // Set up valid swap
      act(() => {
        result.current.actions.setFromToken(mockTokens[0]);
        result.current.actions.setToToken(mockTokens[1]);
        result.current.actions.setFromAmount("10");
      });

      // Execute swap
      await act(async () => {
        await result.current.actions.executeSwap();
      });

      expect(toast.success).toHaveBeenCalled();
      expect(result.current.state.formData.fromToken).toBe(null); // Form reset
      expect(result.current.state.formData.toToken).toBe(null);
    });

    it("should handle swap validation error", async () => {
      const { result } = renderHook(() => useSwap());

      // Execute swap without setting tokens
      await act(async () => {
        await result.current.actions.executeSwap();
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Please select a token to swap from",
        {
          duration: 4000,
          position: "top-right",
        }
      );
      expect(result.current.state.error).toBe(
        "Please select a token to swap from"
      );
    });

    it("should show loading state during swap", async () => {
      const { result } = renderHook(() => useSwap());

      // Set up valid swap
      act(() => {
        result.current.actions.setFromToken(mockTokens[0]);
        result.current.actions.setToToken(mockTokens[1]);
        result.current.actions.setFromAmount("10");
      });

      // Start swap execution
      let swapPromise;
      act(() => {
        swapPromise = result.current.actions.executeSwap();
      });

      expect(result.current.state.isLoading).toBe(true);

      // Wait for completion
      await act(async () => {
        await swapPromise;
      });

      expect(result.current.state.isLoading).toBe(false);
    });
  });

  describe("Form Reset", () => {
    it("should reset form to initial state", () => {
      const { result } = renderHook(() => useSwap());

      // Set some data
      act(() => {
        result.current.actions.setFromToken(mockTokens[0]);
        result.current.actions.setToToken(mockTokens[1]);
        result.current.actions.setFromAmount("10");
      });

      // Reset form
      act(() => {
        result.current.actions.resetForm();
      });

      expect(result.current.state.formData).toEqual({
        fromToken: null,
        toToken: null,
        fromAmount: "",
        toAmount: "",
      });
      expect(result.current.state.error).toBe(null);
    });
  });

  describe("Error Handling", () => {
    it("should clear error when form data changes", async () => {
      const { result } = renderHook(() => useSwap());

      // Manually set an error by calling executeSwap without valid data
      await act(async () => {
        await result.current.actions.executeSwap(); // This will set an error
      });

      expect(result.current.state.error).toBeTruthy();

      // Change form data should clear error
      act(() => {
        result.current.actions.setFromToken(mockTokens[0]);
      });

      expect(result.current.state.error).toBe(null);
    });
  });
});
