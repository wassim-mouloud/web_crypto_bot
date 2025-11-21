# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A cryptocurrency price bot with a Flask backend and React frontend that provides real-time cryptocurrency prices via the CoinGecko API.

## Architecture

### Backend (Python/Flask)
- **Location**: `backend/`
- **Entry point**: [backend/app.py](backend/app.py) - Flask application with CORS enabled, runs on port 5001
- **Service layer**: [backend/crypto_service.py](backend/crypto_service.py) - CryptoService class handles all CoinGecko API interactions
- **API endpoints**:
  - `GET /` - Health check
  - `GET /api/price/<crypto>` - Get price data with multi-timeframe changes (24h, 7d, 30d, 1y)
  - `GET /api/search/<query>` - Search for cryptocurrencies

### Frontend (React)
- **Location**: `frontend/`
- **Entry point**: [frontend/src/App.js](frontend/src/App.js) - Main application component with state management
- **API layer**: [frontend/src/services/cryptoApi.js](frontend/src/services/cryptoApi.js) - Communicates with Flask backend at http://127.0.0.1:5001
- **Components**:
  - [ChatInput.js](frontend/src/components/ChatInput.js) - User input form for cryptocurrency queries
  - [PriceDisplay.js](frontend/src/components/PriceDisplay.js) - Displays price data with multi-timeframe fluctuations, market cap, volume, ATH/ATL

### Key Data Flow
1. User enters crypto name in ChatInput component
2. App.js calls getCryptoPrice from cryptoApi.js
3. Frontend makes HTTP request to Flask backend
4. Backend CryptoService makes two API calls to CoinGecko:
   - `/simple/price` for current price and 24h data
   - `/coins/{id}` for detailed market data (7d, 30d, 1y changes)
5. Backend combines and returns formatted data with price fluctuations across multiple timeframes
6. PriceDisplay shows price, changes, market cap, volume, and ATH/ATL

## Development Commands

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py  # Starts Flask on http://127.0.0.1:5001
```

### Frontend
```bash
cd frontend
npm install
npm start  # Starts React dev server on http://localhost:3000
npm test   # Run tests
npm run build  # Production build
```

### Running the Full Application
1. Start backend first: `cd backend && python app.py`
2. Start frontend: `cd frontend && npm start`
3. Access at http://localhost:3000

## Dependencies

### Backend (Python)
- Flask 3.0.0 - Web framework
- Flask-Cors 4.0.0 - CORS support for React frontend
- requests 2.31.0 - HTTP client for CoinGecko API
- python-dotenv 1.0.0 - Environment variable management
- gunicorn 21.2.0 - Production ASGI server

### Frontend (React)
- React 19.2.0
- react-scripts 5.0.1 - Create React App tooling

## Important Notes

- No API key required for CoinGecko API (free tier usage)
- Backend uses requests.Session() for connection pooling
- Frontend expects backend at http://127.0.0.1:5001 (hardcoded in cryptoApi.js)
- Price data includes: current price, 24h/7d/30d/1y changes, market cap, volume, ATH, ATL
- All cryptocurrency IDs must be lowercase (e.g., "bitcoin", "ethereum")
