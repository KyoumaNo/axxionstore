// API Configuration
const API_BASE_URL = 'https://axxionstore-production.up.railway.app/api';

const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    PRODUCTS: '/products',
    HEALTH: '/health'
  },
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 3
};

export default API_CONFIG;
