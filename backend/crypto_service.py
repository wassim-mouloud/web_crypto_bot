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
        Get current price data for a cryptocurrency

        Args:
            crypto_id: Cryptocurrency ID (e.g., 'bitcoin', 'ethereum')

        Returns:
            Dictionary with price information or None if not found
        """
        try:
            # CoinGecko endpoint for simple price
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

            # Format the response
            return {
                'name': crypto_id.lower(),
                'price_usd': crypto_data.get('usd'),
                'market_cap': crypto_data.get('usd_market_cap'),
                'volume_24h': crypto_data.get('usd_24h_vol'),
                'change_24h': crypto_data.get('usd_24h_change'),
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
