/**
 * API endpoints and configuration constants
 */

const API_ENDPOINTS = {
  PRICES: "https://interview.switcheo.com/prices.json",
  TOKEN_ICONS_BASE:
    "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens",
};

const SUPPORTED_TOKENS = [
  "BLUR",
  "bNEO",
  "BUSD",
  "USD",
  "ETH",
  "GMX",
  "STEVMOS",
  "LUNA",
  "RATOM",
  "STRD",
  "EVMOS",
  "IBCX",
  "IRIS",
  "ampLUNA",
  "KUJI",
  "STOSMO",
  "USDC",
  "axlUSDC",
  "ATOM",
  "STATOM",
  "OSMO",
  "rSWTH",
  "STLUNA",
  "LSI",
  "OKB",
  "OKT",
  "SWTH",
  "USC",
  "WBTC",
  "wstETH",
  "YieldUSD",
  "ZIL",
];

const DEFAULT_TOKENS = {
  FROM: "ETH",
  TO: "USDC",
};

const REFRESH_INTERVALS = {
  PRICES: 30000, // 30 seconds
  EXCHANGE_RATE: 5000, // 5 seconds
};

const DECIMAL_PLACES = {
  AMOUNT: 6,
  PRICE: 8,
  EXCHANGE_RATE: 10,
};

export {
  API_ENDPOINTS,
  SUPPORTED_TOKENS,
  DEFAULT_TOKENS,
  REFRESH_INTERVALS,
  DECIMAL_PLACES,
};
