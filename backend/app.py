from flask import Flask, jsonify, request
from flask_cors import CORS
from crypto_service import CryptoService

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize crypto service
crypto_service = CryptoService()

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'online',
        'message': 'Crypto Price Bot API is running'
    })

@app.route('/api/price/<crypto>', methods=['GET'])
def get_crypto_price(crypto):
    """
    Get current price for a cryptocurrency

    Args:
        crypto: Cryptocurrency name (e.g., 'bitcoin', 'ethereum')

    Returns:
        JSON with price data or error message
    """
    try:
        # Get price data from CoinGecko
        price_data = crypto_service.get_price(crypto)

        if price_data:
            return jsonify({
                'success': True,
                'crypto': crypto,
                'data': price_data
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': f'Cryptocurrency "{crypto}" not found'
            }), 404

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/search/<query>', methods=['GET'])
def search_crypto(query):
    """
    Search for cryptocurrencies by name

    Args:
        query: Search term

    Returns:
        JSON with list of matching cryptocurrencies
    """
    try:
        results = crypto_service.search_crypto(query)
        return jsonify({
            'success': True,
            'results': results
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
