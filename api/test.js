const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://healthcare-frontend-eight.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ]
}));

// Additional CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://healthcare-frontend-eight.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'CORS test successful!',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Healthcare System API Test is running!',
    timestamp: new Date().toISOString()
  });
});

module.exports = app; 