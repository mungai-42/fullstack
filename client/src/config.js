const config = {
  // Development
  development: {
    apiUrl: 'http://localhost:5000'
  },
  // Production - updated with new backend URL
  production: {
    apiUrl: 'https://healthcare-backend-27ik.onrender.com'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = config[environment].apiUrl; 