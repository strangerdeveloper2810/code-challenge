/**
 * Currency-related utility functions
 * Pure functions with no side effects
 */

import { API_ENDPOINTS, DECIMAL_PLACES } from "../constants/api";

/**
 * Format amount with smart decimal places and thousand separators
 * @param {number|string} amount - The amount to format
 * @param {number} decimals - Maximum number of decimal places
 * @param {boolean} compact - Use compact notation for large numbers
 * @returns {string} Formatted amount string
 */
const formatAmount = (
  amount = 0,
  decimals = DECIMAL_PLACES.AMOUNT,
  compact = false
) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";

  // For very small numbers, show more precision
  if (num > 0 && num < 0.001) {
    return num.toFixed(8).replace(/\.?0+$/, "");
  }

  // For compact notation (large numbers)
  if (compact && num >= 1000000) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  }

  // For large numbers, show fewer decimals
  let actualDecimals = decimals;
  if (num >= 1000) actualDecimals = Math.min(2, decimals);
  else if (num >= 100) actualDecimals = Math.min(4, decimals);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: actualDecimals,
  }).format(num);
};

/**
 * Format price with enhanced currency display
 * @param {number} price - The price to format
 * @param {string} currency - Currency code (default: USD)
 * @param {boolean} compact - Use compact notation for large numbers
 * @returns {string} Formatted price string
 */
// eslint-disable-next-line no-unused-vars
const formatPrice = (price = 0, currency = "USD", compact = false) => {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "$0.00";

  // For very small prices
  if (num > 0 && num < 0.01) {
    return `$${num.toFixed(8).replace(/\.?0+$/, "")}`;
  }

  // For compact notation
  if (compact && num >= 1000000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      compactDisplay: "short",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  }

  // Standard formatting
  let maxDecimals = DECIMAL_PLACES.PRICE;
  if (num >= 1000) maxDecimals = 2;
  else if (num >= 100) maxDecimals = 4;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  }).format(num);
};

/**
 * Format crypto amount with symbol
 * @param {number|string} amount - The amount to format
 * @param {string} symbol - Token symbol (e.g., "BTC", "ETH")
 * @param {boolean} showSymbol - Whether to show the symbol
 * @returns {string} Formatted crypto amount
 */
const formatCryptoAmount = (amount = 0, symbol = "", showSymbol = true) => {
  const formattedAmount = formatAmount(amount, 8); // Crypto typically uses up to 8 decimals
  return showSymbol && symbol
    ? `${formattedAmount} ${symbol}`
    : formattedAmount;
};

/**
 * Format percentage with proper styling
 * @param {number} percentage - The percentage to format
 * @param {boolean} showSign - Whether to show + for positive numbers
 * @returns {string} Formatted percentage
 */
const formatPercentage = (percentage = 0, showSign = true) => {
  const num =
    typeof percentage === "string" ? parseFloat(percentage) : percentage;
  if (isNaN(num)) return "0%";

  const sign = showSign && num > 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
};

/**
 * Format large numbers with K, M, B suffixes
 * @param {number} num - Number to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted number with suffix
 */
const formatCompactNumber = (num = 0, decimals = 1) => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
  return formatAmount(num, decimals);
};

/**
 * Format exchange rate with proper precision
 * @param {number} rate - Exchange rate
 * @param {string} fromSymbol - From token symbol
 * @param {string} toSymbol - To token symbol
 * @returns {string} Formatted exchange rate
 */
const formatExchangeRate = (rate = 0, fromSymbol = "", toSymbol = "") => {
  if (!rate || rate === 0) return "0";

  const formattedRate = formatAmount(rate, 8);
  if (fromSymbol && toSymbol) {
    return `1 ${fromSymbol} = ${formattedRate} ${toSymbol}`;
  }
  return formattedRate;
};

/**
 * Calculate exchange rate between two tokens
 * @param {Object} fromToken - Source token object
 * @param {Object} toToken - Target token object
 * @returns {number} Exchange rate
 */
const calculateExchangeRate = (fromToken = null, toToken = null) => {
  if (!fromToken?.price || !toToken?.price || fromToken.price === 0) {
    return 0;
  }
  return fromToken.price / toToken.price;
};

/**
 * Calculate output amount based on input amount and exchange rate
 * @param {string|number} inputAmount - Input amount
 * @param {number} exchangeRate - Exchange rate
 * @returns {number} Output amount
 */
const calculateOutputAmount = (inputAmount = 0, exchangeRate = 0) => {
  const amount =
    typeof inputAmount === "string" ? parseFloat(inputAmount) : inputAmount;
  if (isNaN(amount) || amount <= 0 || exchangeRate <= 0) {
    return 0;
  }
  return amount * exchangeRate;
};

/**
 * Calculate USD value for token amount
 * @param {number|string} amount - Token amount
 * @param {number} price - Token price in USD
 * @returns {string} Formatted USD value
 */
const calculateUSDValue = (amount = 0, price = 0) => {
  const tokenAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(tokenAmount) || !price) return "$0.00";

  const usdValue = tokenAmount * price;
  return formatPrice(usdValue, "USD", true);
};

/**
 * Validate if amount is a valid number
 * @param {string} amount - Amount string to validate
 * @returns {boolean} True if valid
 */
const isValidAmount = (amount = "") => {
  if (!amount || amount.trim() === "") return false;
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
};

/**
 * Generate token icon URL from Switcheo token icons repository
 * @param {string} currency - Currency symbol
 * @returns {string} Icon URL
 */
const getTokenIconUrl = (currency = "") => {
  if (!currency) return "";

  
  // Return the direct URL to Switcheo's token icons
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`;
};

/**
 * Process raw price data to create Token objects
 * @param {Array} priceData - Array of price data objects
 * @returns {Array} Array of processed token objects
 */
const processTokenData = (priceData = []) => {
  // Group by currency and get latest price
  const tokenMap = new Map();

  priceData.forEach((item) => {
    const existing = tokenMap.get(item.currency);
    if (!existing || new Date(item.date) > new Date(existing.date)) {
      tokenMap.set(item.currency, item);
    }
  });

  // Convert to Token objects
  return Array.from(tokenMap.values()).map((item) => ({
    currency: item.currency,
    price: item.price,
    lastUpdated: item.date,
    iconUrl: getTokenIconUrl(item.currency),
  }));
};

/**
 * Validate swap data
 * @param {Object|null} fromToken - Source token
 * @param {Object|null} toToken - Target token
 * @param {string} fromAmount - Input amount
 * @returns {Object} Validation result with isValid and error
 */
const validateSwapData = (
  fromToken = null,
  toToken = null,
  fromAmount = ""
) => {
  if (!fromToken) {
    return { isValid: false, error: "Please select a token to swap from" };
  }

  if (!toToken) {
    return { isValid: false, error: "Please select a token to swap to" };
  }

  if (fromToken.currency === toToken.currency) {
    return { isValid: false, error: "Cannot swap the same token" };
  }

  if (!isValidAmount(fromAmount)) {
    return { isValid: false, error: "Please enter a valid amount" };
  }

  return { isValid: true };
};

/**
 * Generate unique transaction ID
 * @returns {string} Unique transaction ID
 */
const generateTransactionId = () => {
  return `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function for input handling
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func = () => {}, delay = 300) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export {
  formatAmount,
  formatPrice,
  formatCryptoAmount,
  formatPercentage,
  formatCompactNumber,
  formatExchangeRate,
  calculateExchangeRate,
  calculateOutputAmount,
  calculateUSDValue,
  isValidAmount,
  getTokenIconUrl,
  processTokenData,
  validateSwapData,
  generateTransactionId,
  debounce,
};
