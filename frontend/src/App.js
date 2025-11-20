import { useState } from 'react';
import './App.css';
import ChatInput from './components/ChatInput';
import PriceDisplay from './components/PriceDisplay';
import { getCryptoPrice } from './services/cryptoApi';

function App() {
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCryptoSubmit = async (cryptoName) => {
    setIsLoading(true);
    setError(null);
    setPriceData(null);

    try {
      const data = await getCryptoPrice(cryptoName);
      setPriceData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch cryptocurrency data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <h1>Crypto Price Bot</h1>
          <p>Get real-time cryptocurrency prices</p>
        </header>

        <main className="app-main">
          <PriceDisplay priceData={priceData} error={error} />

          {isLoading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Fetching price data...</p>
            </div>
          )}

          <ChatInput onSubmit={handleCryptoSubmit} isLoading={isLoading} />
        </main>

        <footer className="app-footer">
          <p>Powered by CoinGecko API</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
