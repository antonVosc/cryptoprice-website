import { CURRENCIES } from "../context/CurrencyContext";

const NO_DECIMAL_CURRENCIES = new Set(["jpy"]);

const getSymbol = (currency) =>
  CURRENCIES.find((c) => c.code === currency)?.symbol || "$";

export const formatPrice = (price, currency) => {
  if (price == null) return "—";

  if (price > 0 && price < 0.01) {
    const decimals = Math.max(2, -Math.floor(Math.log10(price)) + 2);
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
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