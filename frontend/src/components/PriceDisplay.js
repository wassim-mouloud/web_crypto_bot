import './PriceDisplay.css';

function PriceDisplay({ priceData, error, onExampleClick }) {
  if (error) {
    return (
      <div className="price-display error">
        <div className="error-icon">⚠️</div>
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!priceData) {
    return (
      <div className="price-display welcome">
        <h2>✨ Welcome to Crypto Price Bot</h2>
        <p>Type a cryptocurrency name to get started!</p>
        <div className="examples">
          <button className="example-tag" onClick={() => onExampleClick && onExampleClick('bitcoin')}>
            ₿ bitcoin
          </button>
          <button className="example-tag" onClick={() => onExampleClick && onExampleClick('ethereum')}>
            Ξ ethereum
          </button>
          <button className="example-tag" onClick={() => onExampleClick && onExampleClick('dogecoin')}>
            Ð dogecoin
          </button>
        </div>
      </div>
    );
  }

  const { data } = priceData;
  const priceChangeColor = data.change_24h >= 0 ? '#10b981' : '#ef4444';
  const priceChangeSymbol = data.change_24h >= 0 ? '+' : '';

  const getChangeColor = (change) => {
    if (!change && change !== 0) return '#64748b';
    return change >= 0 ? '#10b981' : '#ef4444';
  };

  const formatChange = (change) => {
    if (!change && change !== 0) return 'N/A';
    const symbol = change >= 0 ? '+' : '';
    return `${symbol}${change.toFixed(2)}%`;
  };

  return (
    <div className="price-display">
      <div className="crypto-header">
        <h2>{data.name.toUpperCase()}</h2>
      </div>

      <div className="price-main">
        <div className="price-value">
          ${data.price_usd.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </div>
        <div
          className="price-change"
          style={{ color: priceChangeColor }}
        >
          {priceChangeSymbol}{data.change_24h.toFixed(2)}% (24h)
        </div>
      </div>

      {/* Timeframe fluctuations */}
      <div className="timeframe-section">
        <h3 className="section-title">Price Fluctuations</h3>
        <div className="timeframe-grid">
          <div className="timeframe-item">
            <span className="timeframe-label">24 Hours</span>
            <span
              className="timeframe-value"
              style={{ color: getChangeColor(data.change_24h) }}
            >
              {formatChange(data.change_24h)}
            </span>
          </div>
          <div className="timeframe-item">
            <span className="timeframe-label">7 Days</span>
            <span
              className="timeframe-value"
              style={{ color: getChangeColor(data.change_7d) }}
            >
              {formatChange(data.change_7d)}
            </span>
          </div>
          <div className="timeframe-item">
            <span className="timeframe-label">30 Days</span>
            <span
              className="timeframe-value"
              style={{ color: getChangeColor(data.change_30d) }}
            >
              {formatChange(data.change_30d)}
            </span>
          </div>
          <div className="timeframe-item">
            <span className="timeframe-label">1 Year</span>
            <span
              className="timeframe-value"
              style={{ color: getChangeColor(data.change_1y) }}
            >
              {formatChange(data.change_1y)}
            </span>
          </div>
        </div>
      </div>

      {/* Market details */}
      <div className="price-details">
        <div className="detail-item">
          <span className="detail-label">Market Cap</span>
          <span className="detail-value">
            ${(data.market_cap / 1e9).toFixed(2)}B
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">24h Volume</span>
          <span className="detail-value">
            ${(data.volume_24h / 1e9).toFixed(2)}B
          </span>
        </div>
        {data.ath && (
          <div className="detail-item">
            <span className="detail-label">All-Time High</span>
            <span className="detail-value">
              ${data.ath.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
        )}
        {data.atl && (
          <div className="detail-item">
            <span className="detail-label">All-Time Low</span>
            <span className="detail-value">
              ${data.atl.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8
              })}
            </span>
          </div>
        )}
      </div>

      <div className="last-updated">
        Last updated: {new Date(data.last_updated * 1000).toLocaleString()}
      </div>
    </div>
  );
}

export default PriceDisplay;
