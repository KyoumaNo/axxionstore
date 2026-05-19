// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://axxionstore-production.up.railway.app/api'
  : 'http://localhost:3000/api';

// Vercel akan set environment variable untuk production
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
