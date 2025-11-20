import './PriceDisplay.css';

function PriceDisplay({ priceData, error }) {
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
          <span className="example-tag">₿ bitcoin</span>
          <span className="example-tag">Ξ ethereum</span>
          <span className="example-tag">Ð dogecoin</span>
        </div>
      </div>
    );
  }

  const { data } = priceData;
  const priceChangeColor = data.change_24h >= 0 ? '#10b981' : '#ef4444';
  const priceChangeSymbol = data.change_24h >= 0 ? '+' : '';

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
      </div>

      <div className="last-updated">
        Last updated: {new Date(data.last_updated * 1000).toLocaleString()}
      </div>
    </div>
  );
}

export default PriceDisplay;
