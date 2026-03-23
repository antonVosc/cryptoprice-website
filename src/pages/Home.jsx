import { useEffect, useRef, useState } from "react";
import { fetchCryptos } from "../api/coinGecko";
import { CryptoCard } from "../components/CryptoCard";

export const Home = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowLoad, setIsSlowLoad] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const slowLoadTimerRef = useRef(null);

  useEffect(() => {
    slowLoadTimerRef.current = setTimeout(() => {
      setIsSlowLoad(true);
    }, 5000);

    fetchCryptoData();

    return () => clearTimeout(slowLoadTimerRef.current);
  }, []);

  const fetchCryptoData = async () => {
    try {
      const data = await fetchCryptos();

      setCryptoList(data);
    } catch (err) {
      console.error("Error fetching crypto: ", err);
    } finally {
      setIsLoading(false);
      clearTimeout(slowLoadTimerRef.current);
      setIsSlowLoad(false);
    }
  };

  return (
    <div className="app">
      <div className="controls">
        <div className="filter-group"></div>

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
        <div className={`crypto-container ${viewMode}`}>
          {cryptoList.map((crypto, key) => (
            <CryptoCard crypto={crypto} key={key} />
          ))}
        </div>
      )}
    </div>
  );
};
