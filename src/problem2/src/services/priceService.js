/**
 * Price service for fetching token price data
 * Data access layer
 */

import { API_ENDPOINTS } from "../constants/api";
import { processTokenData, getTokenIconUrl } from "../utils/currency";

class PriceService {
  constructor() {
    this.cache = new Map();
    this.CACHE_DURATION = 30000; // 30 seconds
  }

  /**
   * Fetch token prices from API
   * @returns {Promise<Array>} Array of token price objects
   */
  async fetchPrices() {
    try {
      const response = await fetch(API_ENDPOINTS.PRICES);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      throw new Error("Failed to fetch price data. Please try again.");
    }
  }

  /**
   * Get processed token data with caching
   * @returns {Promise<Array>} Array of processed token objects
   */
  async getTokens() {
    const cacheKey = "tokens";
    const cached = this.cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const priceData = await this.fetchPrices();
      const tokens = processTokenData(priceData);

      // Update cache
      this.cache.set(cacheKey, {
        data: tokens,
        timestamp: Date.now(),
      });

      return tokens;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn("Using cached data due to fetch error");
        return cached.data;
      }
      throw error;
    }
  }

  /**
   * Get specific token by currency
   * @param {string} currency - Currency symbol
   * @returns {Promise<Object|null>} Token object or null
   */
  async getToken(currency = "") {
    const tokens = await this.getTokens();
    return tokens.find((token) => token.currency === currency) || null;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Check if data is cached and valid
   * @returns {boolean} True if cache is valid
   */
  isCacheValid() {
    const cached = this.cache.get("tokens");
    return cached ? Date.now() - cached.timestamp < this.CACHE_DURATION : false;
  }
}

/**
 * Mock service for development/testing
 */
class MockPriceService {
  constructor() {
    this.mockData = [
      {
        currency: "ETH",
        price: 1645.93,
        lastUpdated: new Date().toISOString(),
        iconUrl: getTokenIconUrl("ETH"),
      },
      {
        currency: "BTC",
        price: 26002.82,
        lastUpdated: new Date().toISOString(),
        iconUrl: getTokenIconUrl("BTC"),
      },
      {
        currency: "USDC",
        price: 1.0,
        lastUpdated: new Date().toISOString(),
        iconUrl: getTokenIconUrl("USDC"),
      },
      {
        currency: "WBTC",
        price: 26002.82,
        lastUpdated: new Date().toISOString(),
        iconUrl: getTokenIconUrl("WBTC"),
      },
      {
        currency: "ATOM",
        price: 7.18,
        lastUpdated: new Date().toISOString(),
        iconUrl: getTokenIconUrl("ATOM"),
      },
      {
        currency: "OSMO",
        price: 0.377,
        lastUpdated: new Date().toISOString(),
        iconUrl: getTokenIconUrl("OSMO"),
      },
      {
        currency: "LUNA",
        price: 0.52,
        lastUpdated: new Date().toISOString(),
        iconUrl: getTokenIconUrl("LUNA"),
      },
      {
        currency: "SWTH",
        price: 0.004,
        lastUpdated: new Date().toISOString(),
        iconUrl: getTokenIconUrl("SWTH"),
      },
    ];
  }

  /**
   * Get mock token data
   * @returns {Promise<Array>} Array of mock token objects
   */
  async getTokens() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return this.mockData;
  }

  /**
   * Get specific mock token by currency
   * @param {string} currency - Currency symbol
   * @returns {Promise<Object|null>} Token object or null
   */
  async getToken(currency = "") {
    const tokens = await this.getTokens();
    return tokens.find((token) => token.currency === currency) || null;
  }

  /**
   * Clear cache (no-op for mock)
   */
  clearCache() {
    // No-op for mock
  }

  /**
   * Check if cache is valid (always true for mock)
   * @returns {boolean} Always true
   */
  isCacheValid() {
    return true;
  }
}

// Export instances
const priceService = new PriceService();
const mockPriceService = new MockPriceService();

// Export appropriate service based on environment
const isDevelopment = import.meta.env.MODE === "development";
const useMock = import.meta.env.VITE_USE_MOCK === "true"; // Only use mock if explicitly enabled

const currencyService = useMock ? mockPriceService : priceService;

export { PriceService, MockPriceService, priceService, currencyService };
