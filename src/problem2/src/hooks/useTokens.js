/**
 * Hook for fetching and managing token data
 * Application service layer
 */

import { useState, useEffect, useCallback } from "react";
import { currencyService } from "../services/priceService";
import { DEFAULT_TOKENS } from "../constants/api";

/**
 * Custom hook for managing token data
 * @returns {Object} Token data and management functions
 */
const useTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTokens = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const tokenData = await currencyService.getTokens();
      setTokens(tokenData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tokens");
      console.error("Failed to fetch tokens:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Only refresh if not currently loading
      if (!isLoading) {
        fetchTokens();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchTokens, isLoading]);

  const getTokenBySymbol = useCallback(
    (symbol = "") => {
      return tokens.find((token) => token.currency === symbol);
    },
    [tokens]
  );

  const defaultFromToken = getTokenBySymbol(DEFAULT_TOKENS.FROM);
  const defaultToToken = getTokenBySymbol(DEFAULT_TOKENS.TO);

  return {
    tokens,
    isLoading,
    error,
    refetch: fetchTokens,
    getTokenBySymbol,
    defaultFromToken,
    defaultToToken,
  };
};

export default useTokens;
