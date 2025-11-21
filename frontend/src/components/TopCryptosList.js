import './TopCryptosList.css';

function TopCryptosList({ topCryptosData, error }) {
  if (error) {
    return (
      <div className="top-cryptos-display error">
        <div className="error-icon">⚠️</div>
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!topCryptosData || !topCryptosData.data) {
    return null;
  }

  const { data: cryptos } = topCryptosData;

  const getChangeColor = (change) => {
    if (!change && change !== 0) return '#64748b';
    return change >= 0 ? '#10b981' : '#ef4444';
  };

  const formatChange = (change) => {
    if (!change && change !== 0) return 'N/A';
    const symbol = change >= 0 ? '+' : '';
    return `${symbol}${change.toFixed(2)}%`;
  };

  const formatPrice = (price) => {
    if (price >= 1) {
      return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8
      });
    }
  };

  return (
    <div className="top-cryptos-display">
      <div className="top-cryptos-header">
        <h2>🏆 Top {cryptos.length} Cryptocurrencies</h2>
        <p>Ranked by market capitalization</p>
      </div>

      <div className="top-cryptos-list">
        {cryptos.map((crypto) => (
          <div key={crypto.id} className="crypto-card">
            <div className="crypto-rank">#{crypto.rank}</div>

            <div className="crypto-info">
              <div className="crypto-name-section">
                <h3 className="crypto-name">{crypto.name}</h3>
                <span className="crypto-symbol">{crypto.symbol}</span>
              </div>

              <div className="crypto-price-section">
                <div className="crypto-price">${formatPrice(crypto.price_usd)}</div>
                <div
                  className="crypto-change"
                  style={{ color: getChangeColor(crypto.change_24h) }}
                >
                  {formatChange(crypto.change_24h)}
                </div>
              </div>
            </div>

            <div className="crypto-details-row">
              <div className="detail-column">
                <span className="detail-label">Market Cap</span>
                <span className="detail-value">
                  ${(crypto.market_cap / 1e9).toFixed(2)}B
                </span>
              </div>
              <div className="detail-column">
                <span className="detail-label">24h Volume</span>
                <span className="detail-value">
                  ${(crypto.volume_24h / 1e9).toFixed(2)}B
                </span>
              </div>
              <div className="detail-column">
                <span className="detail-label">7d</span>
                <span
                  className="detail-value"
                  style={{ color: getChangeColor(crypto.change_7d) }}
                >
                  {formatChange(crypto.change_7d)}
                </span>
              </div>
              <div className="detail-column">
                <span className="detail-label">30d</span>
                <span
                  className="detail-value"
                  style={{ color: getChangeColor(crypto.change_30d) }}
                >
                  {formatChange(crypto.change_30d)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopCryptosList;
