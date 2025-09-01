const config = {
  // Development
  development: {
    apiUrl: 'http://localhost:5000'
  },
  // Production - Vercel backend deployment
  production: {
    apiUrl: 'https://fullstack-mungai-42s-projects.vercel.app'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_BASE_URL = config[environment].apiUrl; 