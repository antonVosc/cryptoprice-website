import { useEffect, useRef, useState } from "react";
import { fetchCryptos } from "../api/coinGecko";
import { CryptoCard } from "../components/CryptoCard";
import {
  useCurrency,
  CURRENCIES,
  CurrencyProvider,
} from "../context/CurrencyContext";
import { coinGroups as CATEGORY_MAP } from "../data/coinCategories";

import { getCoinCategories } from "../data/coinCategories";

export const Home = () => {
  const { currency, setCurrency } = useCurrency();
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowLoad, setIsSlowLoad] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [coinFilter, setCoinFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [orderFilter, setOrderFilter] = useState("all");
  const slowLoadTimerRef = useRef(null);

  const coinGroups = { all: [], ...CATEGORY_MAP };

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchCryptoData();

    slowLoadTimerRef.current = setTimeout(() => {
      setIsSlowLoad(true);
    }, 5000);

    const interval = setInterval(fetchCryptoData, 30000);

    return () => {
      clearTimeout(slowLoadTimerRef.current);
      clearInterval(interval);
    };
  }, [currency]);

  useEffect(() => {
    filterAndSort();
  }, [sortBy, cryptoList, searchQuery, coinFilter, orderFilter]);

  const fetchCryptoData = async () => {
    try {
      const data = await fetchCryptos(currency);
      console.log("Fetched crypto data: ", data);
      setCryptoList(data);
    } catch (err) {
      console.error("Error fetching crypto: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = cryptoList.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (coinFilter !== "all") {
      filtered = filtered.filter((crypto) =>
        coinGroups[coinFilter].includes(crypto.id),
      );
    }

    // FOR GITHUB
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.current_price - b.current_price;
        case "price_desc":
          return b.current_price - a.current_price;
        case "change":
          return a.price_change_percentage_24h - b.price_change_percentage_24h;
        case "market_cap":
          return a.market_cap - b.market_cap;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });

    // FOR LOCAL DEV
    // filtered.sort((a, b) => {
    //   const aUncat = getCoinCategories(a.id).length === 0;
    //   const bUncat = getCoinCategories(b.id).length === 0;

    //   if (aUncat !== bUncat) return aUncat ? -1 : 1;

    //   switch (sortBy) {
    //     case "name":
    //       return a.name.localeCompare(b.name);
    //     case "price":
    //       return a.current_price - b.current_price;
    //     case "price_desc":
    //       return b.current_price - a.current_price;
    //     case "change":
    //       return a.price_change_percentage_24h - b.price_change_percentage_24h;
    //     case "market_cap":
    //       return a.market_cap - b.market_cap;
    //     default:
    //       return a.market_cap_rank - b.market_cap_rank;
    //   }
    // });

    if (orderFilter === "rise_small") {
      filtered = filtered
        .filter((crypto) => crypto.price_change_percentage_24h > 0)
        .sort(
          (a, b) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h,
        );
    }

    if (orderFilter === "rise_large") {
      filtered = filtered
        .filter((crypto) => crypto.price_change_percentage_24h > 0)
        .sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h,
        );
    }

    if (orderFilter === "fall_large") {
      filtered = filtered
        .filter((crypto) => crypto.price_change_percentage_24h < 0)
        .sort(
          (a, b) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h,
        );
    }

    if (orderFilter === "fall_small") {
      filtered = filtered
        .filter((crypto) => crypto.price_change_percentage_24h < 0)
        .sort(
          (a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h,
        );
    }

    setFilteredList(filtered);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🚀 Crypto Tracker</h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>

          <div className="search-section">
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              className="search-input"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>
      </header>

      <div className="controls">
        <div className="filter-group">
          <label>Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option value={c.code} key={c.code}>
                {c.label}
              </option>
            ))}
          </select>

          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="market_cap_rank">Rank</option>
            <option value="name">Name</option>
            <option value="price">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="change">24h Change</option>
            <option value="market_cap">Market Cap</option>
          </select>

          <label>Filter:</label>
          <select
            value={coinFilter}
            onChange={(e) => setCoinFilter(e.target.value)}
          >
            {Object.keys(coinGroups).map((group) => (
              <option value={group} key={group}>
                {group.replaceAll("_", " ").toUpperCase()}
              </option>
            ))}
          </select>

          <label>Order:</label>
          <select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="rise_small">Rise (smallest change)</option>
            <option value="rise_large">Rise (largest change)</option>
            <option value="fall_small">Fall (smallest change)</option>
            <option value="fall_large">Fall (largest change)</option>
          </select>
        </div>

        <div className="view-toggle">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">
          {isSlowLoad ? (
            <div className="loading-warning">
              <span className="warning-icon">⚠️</span>
              <p>
                Couldn't load cryptocurrencies. Please ensure internet
                connection is stable.
              </p>
            </div>
          ) : (
            <>
              <div className="spinner" />
              <p>Loading crypto data...</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="crypto-count">
            Showing {filteredList.length} cryptocurrencies
          </div>
          <div className={`crypto-container ${viewMode}`}>
            {filteredList.map((crypto) => (
              <CryptoCard crypto={crypto} key={crypto.id} currency={currency} />
            ))}
          </div>
        </>
      )}

      <footer className="footer">
        <p>Data provided by CoinGecko API · Updates every 30 seconds</p>
      </footer>

      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ⬆
        </button>
      )}
    </div>
  );
};
