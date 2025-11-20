from crypto_service import CryptoService
import json

def print_pretty(title, data):
    """Helper to print data nicely"""
    print(f"\n{'-'*20} {title} {'-'*20}")
    if data:
        print(json.dumps(data, indent=2))
    else:
        print("No data found.")

def main():
    # 1. Initialize the service
    print("Initializing CryptoService...")
    service = CryptoService()

    try:
        # 2. Test Getting Price
        # Change 'bitcoin' to any other coin ID to test
        print("Fetching price for Bitcoin...")
        price_data = service.get_price('bitcoin')
        print_pretty("Bitcoin Price Data", price_data)

        # 3. Test Searching
        print("\nSearching for 'Doge'...")
        search_results = service.search_crypto('doge')
        print_pretty("Search Results (Top 10)", search_results)

        # 4. Test Trending
        print("\nFetching trending coins...")
        trending_data = service.get_trending()
        print_pretty("Trending Coins", trending_data)

    except Exception as e:
        print(f"\n❌ An error occurred: {e}")

if __name__ == "__main__":
    main()