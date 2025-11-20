// API service for communicating with Flask backend

const API_BASE_URL = 'http://127.0.0.1:5001';

/**
 * Fetch crypto price data from backend
 * @param {string} cryptoName - Name of cryptocurrency (e.g., 'bitcoin', 'ethereum')
 * @returns {Promise} Price data object
 */
export const getCryptoPrice = async (cryptoName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/price/${cryptoName.toLowerCase()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch crypto price');
    }

    return data;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    throw error;
  }
};

/**
 * Search for cryptocurrencies
 * @param {string} query - Search term
 * @returns {Promise} Array of matching cryptocurrencies
 */
export const searchCrypto = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/search/${query}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to search cryptocurrencies');
    }

    return data.results;
  } catch (error) {
    console.error('Error searching crypto:', error);
    throw error;
  }
};

/**
 * Check if backend API is online
 * @returns {Promise<boolean>}
 */
export const checkApiStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json();
    return data.status === 'online';
  } catch (error) {
    console.error('Backend API is offline:', error);
    return false;
  }
};
