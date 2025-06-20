/**
 * Main swap hook - Business logic layer
 * Manages swap state and operations
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import {
  calculateExchangeRate,
  calculateOutputAmount,
  validateSwapData,
  formatCryptoAmount,
  debounce,
} from "../utils/currency";

/**
 * Custom hook for managing swap operations
 * @returns {Object} Swap state and actions
 */
const useSwap = () => {
  const [formData, setFormData] = useState({
    fromToken: null,
    toToken: null,
    fromAmount: "",
    toAmount: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate exchange rate when tokens change
  const exchangeRate = useMemo(() => {
    if (!formData.fromToken || !formData.toToken) return null;
    return calculateExchangeRate(formData.fromToken, formData.toToken);
  }, [formData.fromToken, formData.toToken]);

  // Validate swap data
  const validation = useMemo(() => {
    return validateSwapData(
      formData.fromToken,
      formData.toToken,
      formData.fromAmount
    );
  }, [formData.fromToken, formData.toToken, formData.fromAmount]);

  // Debounced amount calculation
  const debouncedCalculateToAmount = useMemo(
    () =>
      debounce((amount, rate) => {
        if (rate && amount) {
          const outputAmount = calculateOutputAmount(amount, rate);
          setFormData((prev) => ({
            ...prev,
            toAmount: outputAmount.toString(),
          }));
        } else {
          setFormData((prev) => ({ ...prev, toAmount: "" }));
        }
      }, 300),
    []
  );

  // Auto-calculate to amount when from amount or rate changes
  useEffect(() => {
    if (exchangeRate && formData.fromAmount) {
      debouncedCalculateToAmount(formData.fromAmount, exchangeRate);
    } else {
      setFormData((prev) => ({ ...prev, toAmount: "" }));
    }
  }, [formData.fromAmount, exchangeRate, debouncedCalculateToAmount]);

  // Clear error when form data changes
  useEffect(() => {
    if (error) setError(null);
  }, [formData]);

  // Actions
  const setFromToken = useCallback((token = null) => {
    setFormData((prev) => ({ ...prev, fromToken: token }));
  }, []);

  const setToToken = useCallback((token = null) => {
    setFormData((prev) => ({ ...prev, toToken: token }));
  }, []);

  const setFromAmount = useCallback((amount = "") => {
    // Validate input format
    if (amount === "" || /^\d*\.?\d*$/.test(amount)) {
      setFormData((prev) => ({ ...prev, fromAmount: amount }));
    }
  }, []);

  const setToAmount = useCallback(
    (amount = "") => {
      // Validate input format
      if (amount === "" || /^\d*\.?\d*$/.test(amount)) {
        setFormData((prev) => ({ ...prev, toAmount: amount }));

        // Reverse calculate from amount if user edits to amount
        if (exchangeRate && amount) {
          const reverseAmount = calculateOutputAmount(amount, 1 / exchangeRate);
          setFormData((prev) => ({
            ...prev,
            fromAmount: reverseAmount.toString(),
          }));
        }
      }
    },
    [exchangeRate]
  );

  const swapTokens = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
    }));

    // Show toast for token swap
    toast("🔄 Tokens swapped!", {
      duration: 2000,
      position: "top-right",
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      fromToken: null,
      toToken: null,
      fromAmount: "",
      toAmount: "",
    });
    setError(null);
  }, []);

  const executeSwap = useCallback(async () => {
    if (!validation.isValid) {
      setError(validation.error || "Invalid swap data");
      toast.error(validation.error || "Invalid swap data", {
        duration: 4000,
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real app, this would call the swap API
      console.log("Swap executed:", {
        from: formData.fromToken?.currency,
        to: formData.toToken?.currency,
        amount: formData.fromAmount,
        rate: exchangeRate,
      });

      // Format amounts for toast message
      const fromFormatted = formatCryptoAmount(
        formData.fromAmount,
        formData.fromToken?.currency || "",
        true
      );
      const toFormatted = formatCryptoAmount(
        formData.toAmount,
        formData.toToken?.currency || "",
        true
      );

      // Show success toast
      toast.success(
        `🎉 Successfully swapped ${fromFormatted} for ${toFormatted}!`,
        {
          duration: 5000,
          position: "top-right",
        }
      );

      // Reset form after successful swap
      resetForm();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Swap failed. Please try again.";
      setError(errorMessage);

      toast.error(errorMessage, {
        duration: 6000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  }, [validation, formData, exchangeRate, resetForm]);

  // Compose state
  const state = {
    formData,
    isLoading,
    error,
    exchangeRate,
    isValidSwap: validation.isValid,
  };

  return {
    state,
    actions: {
      setFromToken,
      setToToken,
      setFromAmount,
      setToAmount,
      swapTokens,
      resetForm,
      executeSwap,
    },
  };
};

export default useSwap;
