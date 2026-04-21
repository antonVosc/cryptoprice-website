import { formatPrice, formatMarketCap } from "../utils/formatter";

export const CryptoCard = ({ crypto }) => {
  const change = parseFloat((crypto.price_change_percentage_24h ?? 0).toFixed(2));
  
  return (
    <div className="crypto-card">
      <div className="crypto-header">
        <div className="crypto-info">
          <img src={crypto.image} alt={crypto.name} />

          <div>
            <h3>{crypto.name}</h3>
            <p className="symbol">{crypto.symbol.toUpperCase()}</p>

            <span className="rank">#{crypto.market_cap_rank}</span>
          </div>
        </div>
      </div>

      <div className="crypto-price">
        <p className="price">{formatPrice(crypto.current_price)}</p>
        <p
          className={`change ${change > 0 ? "positive" : change < 0 ? "negative" : ""}`}
        >
          {change > 0 ? "↑" : change < 0 ? "↓" : null}{" "}
          {Math.abs(change).toFixed(2)}%
        </p>
      </div>

      <div className="crypto-stats">
        <div className="stat">
          <span className="stat-label">Market Cap</span>

          <span className="stat-value">
            ${formatMarketCap(crypto.market_cap)}
          </span>
        </div>

        <div className="stat">
          <span className="stat-label">Volume</span>

          <span className="stat-value">
            ${formatMarketCap(crypto.total_volume)}
          </span>
        </div>
      </div>
    </div>
  );
};
