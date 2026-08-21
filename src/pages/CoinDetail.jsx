import { useNavigate, useParams } from "react-router-dom";
import {
  fetchCoinData,
  fetchChartData,
  fetchChartDataRange,
} from "../api/coinGecko";
import { useEffect, useState, useRef } from "react";
import { formatMarketCap, formatPrice } from "../utils/formatter";
import { useCurrency } from "../context/CurrencyContext";
import { DurationSelector, PRESET_MAP } from "../components/DurationSelector";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCoinCategories } from "../data/coinCategories";
import { CategoryBadge } from "../components/CategoryBadge";

const styles = {
  chartEmpty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 400,
    border: "1px dashed rgba(255, 255, 255, 0.12)",
    borderRadius: 10,
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
  },
};

const MS_PER_DAY = 86400000;

const getSpanDays = (rangeKey, customFrom, customTo) => {
  if (rangeKey === "custom") {
    if (!customFrom || !customTo) {
      return null;
    }

    return Math.max(
      1,
      Math.round((new Date(customTo) - new Date(customFrom)) / MS_PER_DAY),
    );
  }

  return PRESET_MAP[rangeKey]?.days ?? 7;
};

const formatChartLabel = (timestamp, spanDays) => {
  const date = new Date(timestamp);

  if (spanDays <= 1) {
    const hour = date.getHours().toString().padStart(2, "0");

    return `${hour}:00`;
  }

  if (spanDays <= 90) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  if (spanDays <= 730) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
  }

  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const downsample = (points, maxPoints = 300) => {
  if (points.length <= maxPoints) {
    return points;
  }

  const step = Math.ceil(points.length / maxPoints);

  return points.filter((_, i) => i % step === 0);
};

export const CoinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rangeKey, setRangeKey] = useState("7d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [earliestDate, setEarliestDate] = useState(null);
  const earliestCache = useRef({});
  const [chartError, setChartError] = useState(null);

  const loadEarliestDate = async () => {
    if (earliestCache.current[id]) {
      setEarliestDate(earliestCache.current[id]);

      return;
    }

    try {
      const data = await fetchChartData(id, currency, "max");
      if (data.prices?.length) {
        const first = new Date(data.prices[0][0]).toISOString().slice(0, 10);
        earliestCache.current[id] = first;
        setEarliestDate(first);
      }
    } catch (err) {
      console.error("Error fetching earliest date: ", err);
    }
  };

  const handleRangeChange = (key) => {
    setRangeKey(key);

    if (key === "custom") {
      setEarliestDate(earliestCache.current[id] || null);
    } else {
      setCustomFrom("");
      setCustomTo("");
    }
  };

  useEffect(() => {
    earliestCache.current = {};
    setEarliestDate(null);
  }, [id]);

  // Always resolve how much history this coin has, so we can hide
  // presets (2Y, 5Y, etc.) that have no data before the user picks them.
  useEffect(() => {
    loadEarliestDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currency]);

  const maxAvailableDays = earliestDate
    ? Math.max(
        1,
        Math.round(
          (Date.now() - new Date(earliestDate).getTime()) / MS_PER_DAY,
        ),
      )
    : null;

  // If the currently selected preset is no longer valid for this coin
  // (e.g. switched from a coin with 2y history to one with 90d), fall back.
  useEffect(() => {
    if (maxAvailableDays == null || rangeKey === "custom") {
      return;
    }

    const preset = PRESET_MAP[rangeKey];

    if (preset && preset.days > maxAvailableDays) {
      setRangeKey("7d");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxAvailableDays]);

  const handleCustomChange = (field, val) => {
    if (field === "from") {
      setCustomFrom(val);
    } else {
      setCustomTo(val);
    }
  };

  useEffect(() => {
    if (rangeKey === "custom" && (!customFrom || !customTo)) {
      return;
    }

    let ignore = false;

    const loadAll = async () => {
      setIsLoading(true);

      try {
        await Promise.all([loadCoinData(ignore), loadChartData(ignore)]);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadAll();

    return () => {
      ignore = true;
    };
  }, [id, currency, rangeKey, customFrom, customTo]);

  const loadCoinData = async (ignore) => {
    try {
      const data = await fetchCoinData(id);

      if (!ignore) {
        setCoin(data);
      }
    } catch (err) {
      if (!ignore) {
        console.error("Error fetching crypto: ", err);
      }
    }
  };

  const loadChartData = async (ignore) => {
    try {
      const spanDays = getSpanDays(rangeKey, customFrom, customTo);

      if (spanDays === null) {
        return;
      }

      let data;

      if (rangeKey === "custom") {
        const fromTs = Math.floor(new Date(customFrom).getTime() / 1000);
        const toTs = Math.floor(new Date(customTo).getTime() / 1000) + 86399;

        data = await fetchChartDataRange(id, currency, fromTs, toTs);
      } else {
        data = await fetchChartData(id, currency, PRESET_MAP[rangeKey].days);
      }

      if (!data.prices?.length) {
        if (!ignore) {
          setChartData([]);
          setChartError("No price data available for this range.");
        }
        return;
      }

      const raw = downsample(data.prices);

      const formattedData = raw.reduce((acc, [ts, price]) => {
        const time = formatChartLabel(ts, spanDays);
        const point = { time, price };
        const existingIndex = acc.findIndex((d) => d.time === time);

        if (existingIndex >= 0) {
          acc[existingIndex] = point;
        } else {
          acc.push(point);
        }

        return acc;
      }, []);

      if (!ignore) {
        setChartData(formattedData);
        setChartError(null);
      }
    } catch (err) {
      if (!ignore) {
        console.error("Error fetching crypto: ", err);
        setChartData([]);
        setChartError("Couldn't load chart data. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading coin data...</p>
        </div>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="app">
        <div className="no-results">
          <p>Coin not found.</p>
          <button onClick={() => navigate("/")}>Go Back</button>
        </div>
      </div>
    );
  }

  const priceChange = coin.market_data.price_change_percentage_24h || 0;
  const isPositive = priceChange > 0;
  const isNegative = priceChange < 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section" onClick={() => navigate("/")}>
            <h1>🚀 Crypto Tracker</h1>
            <p>Real-time cryptocurrency prices and market data</p>
          </div>
          <button onClick={() => navigate("/")} className="back-button">
            ← Back to List
          </button>
        </div>
      </header>

      <div className="coin-detail">
        <div className="coin-header">
          <div className="coin-title">
            <img src={coin.image.large} alt={coin.name} />
            <div>
              <h1>{coin.name}</h1>
              <p className="symbol">{coin.symbol.toUpperCase()}</p>
            </div>
          </div>

          <div className="badge-row" style={{ marginTop: 8 }}>
            {getCoinCategories(coin.id).map((cat) => (
              <CategoryBadge key={cat} category={cat} />
            ))}
          </div>

          <span className="rank">Rank #{coin.market_data.market_cap_rank}</span>
        </div>

        <div className="coin-price-section">
          <div className="current-price">
            <h2>
              {formatPrice(
                coin.market_data.current_price?.[currency],
                currency,
              )}
            </h2>

            <span
              className={`change-badge ${isPositive ? "positive" : isNegative ? "negative" : ""}`}
            >
              {isPositive ? "↑" : isNegative ? "↓" : null}{" "}
              {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>

          <div className="price-ranges">
            <div className="price-range">
              <span className="range-label">24h High</span>
              <span className="range-value">
                {formatPrice(coin.market_data.high_24h?.[currency], currency)}
              </span>
            </div>

            <div className="price-range">
              <span className="range-label">24h Low</span>
              <span className="range-value">
                {formatPrice(coin.market_data.low_24h?.[currency], currency)}
              </span>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-header">
            <h3>Price Chart</h3>
            <DurationSelector
              value={rangeKey}
              onChange={handleRangeChange}
              customFrom={customFrom}
              customTo={customTo}
              onCustomChange={handleCustomChange}
              minDate={earliestDate}
              maxDays={maxAvailableDays}
            />
          </div>

          {chartError ? (
            <div style={styles.chartEmpty}>
              <p>{chartError}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 255, 255, 0.1)"
                />
                <XAxis
                  dataKey="time"
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  formatter={(value) => [formatPrice(value, currency), "Price"]}
                  contentStyle={{
                    backgroundColor: "rgba(20, 20, 40, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#e0e0e0",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#ADD8E6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">
              {formatMarketCap(
                coin.market_data.market_cap?.[currency],
                currency,
              )}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Volume (24H)</span>
            <span className="stat-value">
              {formatMarketCap(
                coin.market_data.total_volume?.[currency],
                currency,
              )}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Circulating Supply</span>
            <span className="stat-value">
              {formatMarketCap(
                coin.market_data.circulating_supply *
                  coin.market_data.current_price?.[currency],
                currency,
              )}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Supply</span>
            <span className="stat-value">
              {formatMarketCap(
                coin.market_data.total_supply *
                  coin.market_data.current_price?.[currency],
                currency,
              )}
            </span>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Data provided by CoinGecko API · Updates every 30 seconds</p>
      </footer>
    </div>
  );
};
