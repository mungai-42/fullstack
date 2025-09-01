const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration for Vercel
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://fullstack-frontend-mungai-42s-projects.vercel.app',
      'https://healthcare-frontend-eight.vercel.app',
      'https://fullstack-frontend-84q08x48i-mungai-42s-projects.vercel.app',
      'https://fullstack-seven-navy.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ],
  optionsSuccessStatus: 200
}));

// Additional CORS middleware with debugging
app.use((req, res, next) => {
  console.log('Request origin:', req.headers.origin);
  console.log('Request method:', req.method);
  console.log('Request path:', req.path);
  
  // Allow both old and new frontend URLs
  const allowedOrigins = [
    'https://fullstack-frontend-mungai-42s-projects.vercel.app',
    'https://healthcare-frontend-eight.vercel.app',
    'https://fullstack-frontend-84q08x48i-mungai-42s-projects.vercel.app',
    'https://fullstack-seven-navy.vercel.app'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    console.log('CORS origin allowed:', origin);
  } else {
    console.log('CORS origin not in allowed list:', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Import routes
const patientRoutes = require('../routes/patients');
const doctorRoutes = require('../routes/doctors');
const appointmentRoutes = require('../routes/appointments');
const dashboardRoutes = require('../routes/dashboard');

// Use routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);

// Special CORS handling for appointments endpoint
app.use('/api/appointments', (req, res, next) => {
  const origin = req.headers.origin;
  console.log('Appointments endpoint - Origin:', origin);
  
  const allowedOrigins = [
    'https://fullstack-frontend-mungai-42s-projects.vercel.app',
    'https://healthcare-frontend-eight.vercel.app',
    'https://fullstack-frontend-84q08x48i-mungai-42s-projects.vercel.app',
    'https://fullstack-seven-navy.vercel.app'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    console.log('Appointments CORS origin allowed:', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log('Appointments OPTIONS preflight handled');
    res.status(200).end();
    return;
  }
  
  next();
});

app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Healthcare System API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

module.exports = app; 