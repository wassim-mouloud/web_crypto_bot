import { useState } from 'react';
import './App.css';
import ChatInput from './components/ChatInput';
import PriceDisplay from './components/PriceDisplay';
import TopCryptosList from './components/TopCryptosList';
import { getCryptoPrice, getTopCryptos } from './services/cryptoApi';

function App() {
  const [priceData, setPriceData] = useState(null);
  const [topCryptosData, setTopCryptosData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('welcome'); // 'welcome', 'single', 'top'

  const handleCryptoSubmit = async (cryptoName) => {
    setIsLoading(true);
    setError(null);
    setPriceData(null);
    setTopCryptosData(null);

    // Check if user wants top cryptocurrencies
    const topPattern = /^top\s*(\d+)?$/i;
    const match = cryptoName.match(topPattern);

    try {
      if (match) {
        // Handle "top" or "top 10" command
        const limit = match[1] ? parseInt(match[1]) : 10;
        const data = await getTopCryptos(limit);
        setTopCryptosData(data);
        setViewMode('top');
      } else {
        // Handle regular crypto price lookup
        const data = await getCryptoPrice(cryptoName);
        setPriceData(data);
        setViewMode('single');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cryptocurrency data. Please try again.');
      setViewMode('single');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPriceData(null);
    setTopCryptosData(null);
    setError(null);
    setViewMode('welcome');
  };

  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Crypto Price Bot</h1>
              <p>Get real-time cryptocurrency prices</p>
            </div>
            {viewMode !== 'welcome' && (
              <button className="reset-btn" onClick={handleReset}>
                🏠 Home
              </button>
            )}
          </div>
        </header>

        <main className="app-main">
          {viewMode === 'single' && <PriceDisplay priceData={priceData} error={error} onExampleClick={handleCryptoSubmit} />}
          {viewMode === 'top' && <TopCryptosList topCryptosData={topCryptosData} error={error} />}
          {viewMode === 'welcome' && <PriceDisplay priceData={null} error={null} onExampleClick={handleCryptoSubmit} />}

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
