import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { CoinDetail } from "./pages/CoinDetail";
import { CurrencyProvider } from "./context/CurrencyContext";

function App() {
  return (
    <CurrencyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coin/:id" element={<CoinDetail />} />
        </Routes>
      </BrowserRouter>
    </CurrencyProvider>
  );
}

export default App;