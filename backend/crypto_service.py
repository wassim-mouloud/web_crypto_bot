import requests
from typing import Optional, Dict, List

class CryptoService:
    """Service for interacting with CoinGecko API"""

    BASE_URL = "https://api.coingecko.com/api/v3"

    def __init__(self):
        """Initialize the crypto service"""
        self.session = requests.Session()
        self.session.headers.update({
            'Accept': 'application/json',
        })

    def get_price(self, crypto_id: str) -> Optional[Dict]:
        """
        Get current price data for a cryptocurrency with multi-timeframe changes

        Args:
            crypto_id: Cryptocurrency ID (e.g., 'bitcoin', 'ethereum')

        Returns:
            Dictionary with price information or None if not found
        """
        try:
            # Get current price data
            endpoint = f"{self.BASE_URL}/simple/price"

            params = {
                'ids': crypto_id.lower(),
                'vs_currencies': 'usd',
                'include_market_cap': 'true',
                'include_24hr_vol': 'true',
                'include_24hr_change': 'true',
                'include_last_updated_at': 'true'
            }

            response = self.session.get(endpoint, params=params)
            response.raise_for_status()

            data = response.json()

            # Check if crypto was found
            if not data or crypto_id.lower() not in data:
                return None

            crypto_data = data[crypto_id.lower()]

            # Get additional data with market info
            detail_endpoint = f"{self.BASE_URL}/coins/{crypto_id.lower()}"
            detail_params = {
                'localization': 'false',
                'tickers': 'false',
                'community_data': 'false',
                'developer_data': 'false',
                'sparkline': 'false'
            }

            detail_response = self.session.get(detail_endpoint, params=detail_params)
            detail_response.raise_for_status()
            detail_data = detail_response.json()

            market_data = detail_data.get('market_data', {})

            # Format the response with multi-timeframe changes
            return {
                'name': crypto_id.lower(),
                'price_usd': crypto_data.get('usd'),
                'market_cap': crypto_data.get('usd_market_cap'),
                'volume_24h': crypto_data.get('usd_24h_vol'),
                'change_24h': crypto_data.get('usd_24h_change'),
                'change_7d': market_data.get('price_change_percentage_7d'),
                'change_30d': market_data.get('price_change_percentage_30d'),
                'change_1y': market_data.get('price_change_percentage_1y'),
                'ath': market_data.get('ath', {}).get('usd'),
                'atl': market_data.get('atl', {}).get('usd'),
                'last_updated': crypto_data.get('last_updated_at')
            }

        except requests.exceptions.RequestException as e:
            print(f"Error fetching crypto price: {e}")
            raise Exception("Failed to fetch cryptocurrency data")

    def search_crypto(self, query: str) -> List[Dict]:
        """
        Search for cryptocurrencies by name or symbol

        Args:
            query: Search term

        Returns:
            List of matching cryptocurrencies
        """
        try:
            endpoint = f"{self.BASE_URL}/search"

            params = {
                'query': query
            }

            response = self.session.get(endpoint, params=params)
            response.raise_for_status()

            data = response.json()

            # Return top 10 results
            coins = data.get('coins', [])[:10]

            return [
                {
                    'id': coin.get('id'),
                    'name': coin.get('name'),
                    'symbol': coin.get('symbol'),
                    'market_cap_rank': coin.get('market_cap_rank')
                }
                for coin in coins
            ]

        except requests.exceptions.RequestException as e:
            print(f"Error searching cryptocurrencies: {e}")
            raise Exception("Failed to search cryptocurrencies")

    def get_trending(self) -> List[Dict]:
        """
        Get trending cryptocurrencies

        Returns:
            List of trending cryptocurrencies
        """
        try:
            endpoint = f"{self.BASE_URL}/search/trending"

            response = self.session.get(endpoint)
            response.raise_for_status()

            data = response.json()
            coins = data.get('coins', [])

            return [
                {
                    'id': item['item'].get('id'),
                    'name': item['item'].get('name'),
                    'symbol': item['item'].get('symbol'),
                    'market_cap_rank': item['item'].get('market_cap_rank')
                }
                for item in coins
            ]

        except requests.exceptions.RequestException as e:
            print(f"Error fetching trending cryptocurrencies: {e}")
            raise Exception("Failed to fetch trending cryptocurrencies")

    def get_top_cryptos(self, limit: int = 10) -> List[Dict]:
        """
        Get top cryptocurrencies by market cap

        Args:
            limit: Number of top cryptocurrencies to return (default: 10)

        Returns:
            List of top cryptocurrencies with price data
        """
        try:
            endpoint = f"{self.BASE_URL}/coins/markets"

            params = {
                'vs_currency': 'usd',
                'order': 'market_cap_desc',
                'per_page': limit,
                'page': 1,
                'sparkline': 'false',
                'price_change_percentage': '24h,7d,30d'
            }

            response = self.session.get(endpoint, params=params)
            response.raise_for_status()

            data = response.json()

            return [
                {
                    'id': coin.get('id'),
                    'name': coin.get('name'),
                    'symbol': coin.get('symbol', '').upper(),
                    'rank': coin.get('market_cap_rank'),
                    'price_usd': coin.get('current_price'),
                    'market_cap': coin.get('market_cap'),
                    'volume_24h': coin.get('total_volume'),
                    'change_24h': coin.get('price_change_percentage_24h'),
                    'change_7d': coin.get('price_change_percentage_7d_in_currency'),
                    'change_30d': coin.get('price_change_percentage_30d_in_currency'),
                    'image': coin.get('image')
                }
                for coin in data
            ]

        except requests.exceptions.RequestException as e:
            print(f"Error fetching top cryptocurrencies: {e}")
            raise Exception("Failed to fetch top cryptocurrencies")
