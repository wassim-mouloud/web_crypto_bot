# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Crypto Price Bot - A full-stack application for fetching real-time cryptocurrency prices using the CoinGecko API.

## Architecture

**Frontend** (React 19 / Create React App):
- `frontend/src/App.js` - Main component with intelligent input parsing for natural language queries ("top 10", "price of bitcoin", etc.)
- `frontend/src/services/cryptoApi.js` - API client connecting to Flask backend at `http://127.0.0.1:5001`
- `frontend/src/components/` - UI components: ChatInput, PriceDisplay, TopCryptosList

**Backend** (Flask):
- `backend/app.py` - Flask server with REST endpoints: `/api/price/<crypto>`, `/api/search/<query>`, `/api/top`
- `backend/crypto_service.py` - CryptoService class wrapping CoinGecko API with 60-second TTL caching and rate limit handling

## Development Commands

### Backend
```bash
cd backend
source venv/bin/activate
python app.py  # Runs on port 5001
```

### Frontend
```bash
cd frontend
npm start      # Runs on port 3000
npm test       # Jest tests
npm run build  # Production build
```

## API Endpoints

- `GET /api/price/<crypto>` - Price data with 24h/7d/30d/1y changes, ATH/ATL
- `GET /api/search/<query>` - Search cryptocurrencies (returns top 10)
- `GET /api/top?limit=N` - Top N cryptocurrencies by market cap (1-50)

## Key Implementation Details

- Backend uses requests.Session for connection reuse
- RateLimitError custom exception handles CoinGecko 429 responses
- Frontend parses natural language patterns (regex-based) to determine query type
- CORS enabled on backend for cross-origin requests from React dev server
