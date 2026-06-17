import { useEffect, useRef, useState } from "react";
import { fetchCryptos } from "../api/coinGecko";
import { CryptoCard } from "../components/CryptoCard";

export const Home = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSlowLoad, setIsSlowLoad] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [coinFilter, setCoinFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const slowLoadTimerRef = useRef(null);
  const coinGroups = {
    all: [],
    "layer 1 blockchains": [
      "bitcoin",
      "ethereum",
      "ripple",
      "solana",
      "tron",
      "dogecoin",
      "cardano",
      "bitcoin-cash",
      "zcash",
      "chainlink",
      "monero",
      "the-open-network",
      "stellar",
      "litecoin",
      "sui",
      "avalanche-2",
      "hedera-hashgraph",
      "polkadot",
      "near",
      "ripple-usd",
      "internet-computer",
      "sei-network",
      "cosmos",
      "algorand",
      "kaspa",
      "aptos",
      "vechain",
      "midnight-3",
      "injective-protocol",
      "blockstack",
      "terra-luna",
      "tezos",
      "celestia",
      "conflux-token",
      "bitcoin-cash-sv",
      "decred",
      "kaia",
      "iota",
      "neo",
      "theta-token",
    ],
    "stablecoins/fiat pegged/synthetic": [
      "tether",
      "usd-coin",
      "usds",
      "usd1-wlfi",
      "dai",
      "ethena-usde",
      "paypal-usd",
      "global-dollar",
      "usdd",
      "bfusd",
      "usdtb",
      "usual-usd",
      "ylds",
      "a7a5",
      "true-usd",
      "apxusd",
      "euro-coin",
      "terra-luna",
      "usdgo",
      "first-digital-usd",
      "build-on",
      "usx",
      "usdai",
      "megausd",
      "frax-usd",
      "royal-dollar",
      "crvusd",
      "usda-2",
      "falcon-finance-ff",
      "onyc",
      "re-protocol-reusd",
      "apyusd",
      "satoshi-stablecoin",
      "usa",
      "gusd",
      "stasis-eurs",
      "nusd-2",
      "agora-dollar",
      "societe-generale-forge-eurcv",
    ],
    "exchange tokens": [
      "binancecoin",
      "crypto-com-chain",
      "htx-dao",
      "okb",
      "bitget-token",
      "kucoin-shares",
      "gatechain-token",
      "btse-coin",
      "swissborg",
      "mx-token",
    ],
    "real-world assets (rwa)/institutional finance": [
      "ripple",
      "blackrock-usd-institutional-digital-liquidity-fund",
      "world-liberty-financial",
      "ondo-us-dollar-yield",
      "ondo-finance",
      "janus-henderson-anemoy-treasury-fund",
      "spiko-amundi-overnight-swap-fund-eur",
      "adi-token",
      "superstate-short-duration-us-government-securities-fund-ustb",
      "blockchain-capital",
      "ousg",
      "ylds",
      "a7a5",
      "kinesis-gold",
      "zebec-network",
      "hastra-prime",
      "tradable-na-rent-financing-platform-sstn",
      "tradable-apac-diversified-finance-provider-sstn",
      "tradable-latam-fintech-sstn",
      "story-2",
      "onyc",
      "spiko-us-t-bills-money-market-fund",
      "circle-internet-group-ondo-tokenized-stock",
      "fidelity-digital-interest-token",
      "theo-short-duration-us-treasury-fund",
      "societe-generale-forge-eurcv",
    ],
    "long-tail/emerging/microcap/experimental": [
      "figure-heloc",
      "whitebit",
      "usds",
      "hyperliquid",
      "leo-token",
      "canton-network",
      "rain",
      "hashnote-usyc",
      "world-liberty-financial",
      "falcon-finance",
      "aster-2",
      "pi-network",
      "sky",
      "ripple-usd",
      "usdd",
      "internet-computer",
      "ethereum-classic",
      "aave",
      "bfusd",
      "quant-network",
      "morpho",
      "united-stables",
      "eutbl",
      "ethena",
      "stable-2",
      "worldcoin-wld",
      "flare-networks",
      "aptos",
      "just",
      "xdce-crowd-sale",
      "beldex",
      "dexe",
      "venice-token",
      "vechain",
      "hash-2",
      "midnight-3",
      "a7a5",
      "terra-luna",
      "janus-henderson-anemoy-aaa-clo-fund",
      "unibase",
      "humanity",
      "siren-2",
      "sun-token",
      "lab",
      "spx6900",
      "ether-fi",
      "doublezero",
      "kaia",
      "pieverse",
      "jito-governance-token",
      "compound-governance-token",
      "neo",
      "theta-token",
      "trust-wallet-token",
      "axie-infinity",
      "akash-network",
      "the-sandbox",
      "raydium",
      "chain-2",
      "swissborg",
      "vision-3",
      "decentraland",
      "sonic-3",
      "spiko-us-t-bills-money-market-fund",
      "walrus-2",
      "satoshi-stablecoin",
      "thorchain",
      "genius-3",
      "ecash",
      "centrifuge-2",
      "ultima",
      "origintrail",
      "asteroid-shiba",
      "apecoin",
      "river",
      "newton-project",
      "arweave",
      "golem",
      "vaulta",
      "wemix-token",
      "ozone-chain",
      "cheems-token",
      "instadapp",
    ],
    "meme coins/community tokens": [
      "dogecoin",
      "memecore",
      "shiba-inu",
      "pepe",
      "pump-fun",
      "bonk",
      "pudgy-penguins",
      "official-trump",
      "bianrensheng",
      "build-on",
      "floki",
      "ape-and-pepe",
      "the9bit",
      "dogwifcoin",
      "fartcoin",
      "genius-3",
      "asteroid-shiba",
      "cheems-token",
    ],
    "privacy coins": [
      "zcash",
      "monero",
      "beldex",
      "midnight-3",
      "dash",
      "decred",
      "zano",
    ],
    "oracle/data infrastructure": [
      "chainlink",
      "the-graph",
      "pyth-network",
      "ethereum-name-service",
      "linch",
    ],
    "precious metals/commodities": [
      "tether-gold",
      "pax-gold",
      "kinesis-gold",
      "kinesis-silver",
    ],
    "ai/compute/data/depin": [
      "bittensor",
      "render-token",
      "filecoin",
      "kite-2",
      "virtual-protocol",
      "fetch-ai",
      "edgex",
      "build-on",
      "billions-network",
      "monad",
      "skyai",
      "bittorrent",
      "jasmycoin",
      "apenft",
      "the-graph",
      "the9bit",
      "akash-network",
      "story-2",
      "grass",
      "wefi",
      "zano",
      "audiera",
      "genius-3",
      "helium",
      "origintrail",
      "arweave",
      "golem",
      "tagger",
    ],
    "de-fi protocols": [
      "uniswap",
      "world-liberty-financial",
      "aave",
      "morpho",
      "nexo",
      "jupiter-exchange-solana",
      "pancakeswap-token",
      "injective-protocol",
      "aerodrome-finance",
      "build-on",
      "curve-dao-token",
      "gnosis",
      "zebec-network",
      "hastra-prime",
      "pendle",
      "lido-dao",
      "olympus",
      "telcoin",
      "frax",
      "syrup",
      "lighter",
      "falcon-finance-ff",
      "compound-governance-token",
      "raydium",
      "story-2",
      "onyc",
      "convex-finance",
      "thorchain",
      "linch",
    ],
    "governance tokens": [
      "uniswap",
      "world-liberty-financial",
      "aave",
      "nexo",
      "curve-dao-token",
      "gnosis",
      "lido-dao",
      "decred",
      "optimism",
      "ethereum-name-service",
      "lighter",
      "compound-governance-token",
      "swissborg",
      "ravedao",
      "linch",
    ],
    "layer 2/scaling/modular": [
      "mantle",
      "adi-token",
      "polygon-ecosystem-token",
      "arbitrum",
      "celestia",
      "layerzero",
      "optimism",
      "starknet",
      "lighter",
      "plasma",
      "zksync",
      "immutable-x",
    ],
    "web3 infrastructure/middleware": [
      "adi-token",
      "render-token",
      "filecoin",
      "midnight-3",
      "chiliz",
      "virtual-protocol",
      "injective-protocol",
      "edgex",
      "billions-network",
      "ethgas-2",
      "layerzero",
      "gnosis",
      "zebec-network",
      "skyai",
      "hastra-prime",
      "jasmycoin",
      "telcoin",
      "starknet",
      "ethereum-name-service",
      "reallink",
      "lighter",
      "plasma",
      "the9bit",
      "akash-network",
      "story-2",
      "swissborg",
      "onyc",
      "spiko-us-t-bills-money-market-fund",
      "audiera",
      "thorchain",
      "helium",
      "basic-attention-token",
      "origintrail",
      "ravedao",
      "safepal",
      "eigenlayer",
      "arweave",
      "golem",
      "linch",
      "tagger",
    ],
    "gaming/metaverse/nft": [
      "pudgy-penguins",
      "chiliz",
      "apenft",
      "reallink",
      "the9bit",
      "axie-infinity",
      "the-sandbox",
      "undeads-games",
      "decentraland",
      "gala",
      "audiera",
      "immutable-x",
      "ravedao",
      "apecoin",
      "shuffle-2",
    ],
  };

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchCryptoData();

    slowLoadTimerRef.current = setTimeout(() => {
      setIsSlowLoad(true);
    }, 5000);

    const interval = setInterval(fetchCryptoData, 30000);

    return () => {
      clearTimeout(slowLoadTimerRef.current);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [sortBy, cryptoList, searchQuery, coinFilter]);

  const fetchCryptoData = async () => {
    try {
      const data = await fetchCryptos();
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
        <div className={`crypto-container ${viewMode}`}>
          {filteredList.map((crypto, key) => (
            <CryptoCard crypto={crypto} key={key} />
          ))}
        </div>
      )}

      <footer className="footer">
        <p>Data provided by CoinGecko API · Updated every 30 seconds</p>
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
