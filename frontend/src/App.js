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

  // Intelligent input parser
  const parseUserInput = (input) => {
    const cleanInput = input.trim().toLowerCase();

    // Pattern 1: Top cryptocurrencies
    // Matches: "top 10", "top", "show me top 5", "what are the top 20", "give me the best 15"
    const topPatterns = [
      /(?:show|give|get|what are|list)?\s*(?:me)?\s*(?:the)?\s*(?:top|best|highest|leading)\s*(\d+)?/i,
      /^top\s*(\d+)?$/i,
      /(\d+)?\s*(?:top|best|leading)\s*(?:cryptos?|cryptocurrencies?|coins?)/i
    ];

    for (const pattern of topPatterns) {
      const match = cleanInput.match(pattern);
      if (match) {
        const limit = match[1] ? parseInt(match[1]) : 10;
        return { type: 'top', limit };
      }
    }

    // Pattern 2: Price queries with context words
    // Matches: "price of bitcoin", "what is ethereum", "show me dogecoin", "get solana price"
    const pricePatterns = [
      /(?:what is|what's|show|give|get|find|check|tell me|how much is)?\s*(?:me)?\s*(?:the)?\s*(?:price|value|cost)?\s*(?:of|for)?\s*([a-z0-9-]+)/i,
      /([a-z0-9-]+)\s*(?:price|value|cost)/i
    ];

    for (const pattern of pricePatterns) {
      const match = cleanInput.match(pattern);
      if (match && match[1]) {
        const crypto = match[1].trim();
        // Filter out common words that aren't cryptos
        const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can'];
        if (!stopWords.includes(crypto) && crypto.length > 1) {
          return { type: 'price', crypto };
        }
      }
    }

    // Pattern 3: Direct crypto name (fallback)
    // Just the crypto name like "bitcoin", "eth", "btc"
    if (cleanInput.length >= 2 && /^[a-z0-9-]+$/.test(cleanInput)) {
      return { type: 'price', crypto: cleanInput };
    }

    // Could not understand the input
    return { type: 'unknown', input: cleanInput };
  };

  const handleCryptoSubmit = async (cryptoName) => {
    setIsLoading(true);
    setError(null);
    setPriceData(null);
    setTopCryptosData(null);

    const parsed = parseUserInput(cryptoName);

    try {
      if (parsed.type === 'top') {
        // Handle top cryptocurrencies request
        const data = await getTopCryptos(parsed.limit);
        setTopCryptosData(data);
        setViewMode('top');
      } else if (parsed.type === 'price') {
        // Handle crypto price lookup
        const data = await getCryptoPrice(parsed.crypto);
        setPriceData(data);
        setViewMode('single');
      } else {
        // Unknown input
        throw new Error(`I couldn't understand "${cryptoName}". Try asking for a cryptocurrency name (like "bitcoin") or "top 10" for the top cryptocurrencies.`);
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
