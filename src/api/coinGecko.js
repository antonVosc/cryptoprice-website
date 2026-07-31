const BASE_URL = "https://api.coingecko.com/api/v3";

const handleResponse = async (response, context) => {
  if (response.status === 429) {
    throw new Error(`Rate limited while ${context}. Try again shortly.`);
  }

  if (!response.ok) {
    throw new Error(`Failed to ${context}`);
  }

  return response.json();
};

export const fetchCryptos = async (currency = "usd", page = 1) => {
  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=250&page=${page}&sparkline=false`,
  );

  return handleResponse(response, "fetch cryptos");
};

export const fetchCoinData = async (id) => {
  const response = await fetch(
    `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
  );

  return handleResponse(response, "fetch coin data");
};

export const fetchChartData = async (id, currency = "usd", days = 7) => {
  const response = await fetch(
    `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`,
  );

  return handleResponse(response, "fetch chart data");
};

export const fetchChartDataRange = (id, currency = "usd", from, to) => {
  const response = fetch(
    `${BASE_URL}/coins/${id}/market_chart/range?vs_currency=${currency}&from=${from}&to=${to}`,
  );

  return handleResponse(response, "fetch chart data range");
};
