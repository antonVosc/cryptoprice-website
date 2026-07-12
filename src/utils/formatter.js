import { CURRENCIES } from "../context/CurrencyContext";

const NO_DECIMAL_CURRENCIES = new Set(["jpy"]);

const getSymbol = (currency) =>
  CURRENCIES.find((c) => c.code === currency)?.symbol || "$";

export const formatPrice = (price, currency = "usd") => {
  if (price == null || isNaN(price)) return "N/A";

  const symbol = getSymbol(currency);

  if (price < 0.01) {
    return `${symbol}${parseFloat(price.toPrecision(4))}`;
  }

  const isZeroDecimal = NO_DECIMAL_CURRENCIES.has(currency);

  const formatted = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: isZeroDecimal ? 0 : 2,
  }).format(price);

  return `${symbol}${formatted}`;
};

export const formatMarketCap = (marketCap, currency = "usd") => {
  if (marketCap == null || isNaN(marketCap)) return "N/A";

  const symbol = getSymbol(currency);

  if (marketCap >= 1e12) return `${symbol}${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `${symbol}${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `${symbol}${(marketCap / 1e6).toFixed(2)}M`;

  return `${symbol}${marketCap.toLocaleString()}`;
};

export const formatSupply = (supply) => {
  if (supply == null || isNaN(supply)) return "N/A";

  if (supply >= 1e12) return `${(supply / 1e12).toFixed(2)}T`;
  if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B`;
  if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M`;

  return supply.toLocaleString();
};