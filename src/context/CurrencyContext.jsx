import { createContext, useContext, useState } from "react";

const CurrencyContext = createContext(null);

export const CURRENCIES = [
  { code: "usd", label: "USD", symbol: "$" },
  { code: "eur", label: "EUR", symbol: "€" },
  { code: "gbp", label: "GBP", symbol: "£" },
  { code: "rub", label: "RUB", symbol: "₽" },
  { code: "btc", label: "BTC", symbol: "₿" },
  { code: "eth", label: "ETH", symbol: "Ξ" },
  { code: "aed", label: "AED", symbol: "د.إ " },
  { code: "ars", label: "ARS", symbol: "$ " },
  { code: "aud", label: "AUD", symbol: "$ " },
  { code: "bch", label: "BCH", symbol: "Ƀ" },
  { code: "bdt", label: "BDT", symbol: "৳ " },
  { code: "bits", label: "BITS", symbol: "Ƀ" },
  { code: "bmd", label: "BMD", symbol: "$ " },
  { code: "bhd", label: "BHD", symbol: ".د.ب " },
  { code: "bnb", label: "BNB", symbol: "BNB " },
  { code: "brl", label: "BRL", symbol: "R$ " },
  { code: "cad", label: "CAD", symbol: "$ " },
  { code: "chf", label: "CHF", symbol: "CHF " },
  { code: "clp", label: "CLP", symbol: "$ " },
  { code: "cny", label: "CNY", symbol: "¥" },
  { code: "czk", label: "CZK", symbol: "Kč" },
  { code: "dkk", label: "DKK", symbol: "kr" },
  { code: "dot", label: "DOT", symbol: "DOT " },
  { code: "eos", label: "EOS", symbol: "EOS " },
  { code: "gel", label: "GEL", symbol: "₾" },
  { code: "hkd", label: "HKD", symbol: "$" },
  { code: "huf", label: "HUF", symbol: "Ft" },
  { code: "idr", label: "IDR", symbol: "Rp" },
  { code: "ils", label: "ILS", symbol: "₪" },
  { code: "inr", label: "INR", symbol: "₹" },
  { code: "jpy", label: "JPY", symbol: "¥" },
  { code: "krw", label: "KRW", symbol: "₩" },
  { code: "kwd", label: "KWD", symbol: "د.ك" },
  { code: "link", label: "LINK", symbol: "LINK " },
  { code: "lkr", label: "LKR", symbol: "₨" },
  { code: "ltc", label: "LTC", symbol: "Ł" },
  { code: "mmk", label: "MMK", symbol: "K" },
  { code: "mxn", label: "MXN", symbol: "$" },
  { code: "myr", label: "MYR", symbol: "RM" },
  { code: "ngn", label: "NGN", symbol: "₦" },
  { code: "nok", label: "NOK", symbol: "kr" },
  { code: "nzd", label: "NZD", symbol: "$" },
  { code: "php", label: "PHP", symbol: "₱" },
  { code: "pkr", label: "PKR", symbol: "₨" },
  { code: "pln", label: "PLN", symbol: "zł" },
  { code: "sar", label: "SAR", symbol: "﷼" },
  { code: "sats", label: "SATS", symbol: "sats" },
  { code: "sek", label: "SEK", symbol: "kr" },
  { code: "sgd", label: "SGD", symbol: "$" },
  { code: "sol", label: "SOL", symbol: "SOL " },
  { code: "thb", label: "THB", symbol: "฿" },
  { code: "try", label: "TRY", symbol: "₺" },
  { code: "twd", label: "TWD", symbol: "NT$" },
  { code: "uah", label: "UAH", symbol: "₴" },
  { code: "vef", label: "VEF", symbol: "Bs" },
  { code: "vnd", label: "VND", symbol: "₫" },
  { code: "xag", label: "XAG", symbol: "XAG " },
  { code: "xau", label: "XAU", symbol: "XAU " },
  { code: "xdr", label: "XDR", symbol: "XDR " },
  { code: "xlm", label: "XLM", symbol: "XLM " },
  { code: "xrp", label: "XRP", symbol: "XRP " },
  { code: "yfi", label: "YFI", symbol: "YFI " },
  { code: "zar", label: "ZAR", symbol: "R" },
];

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "usd",
  );

  const updateCurrency = (code) => {
    setCurrency(code);

    localStorage.setItem("currency", code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);

  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }

  return ctx;
};
