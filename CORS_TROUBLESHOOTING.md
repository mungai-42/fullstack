# CORS Troubleshooting Guide

## Problem
Your healthcare application is experiencing CORS (Cross-Origin Resource Sharing) errors when the frontend tries to communicate with the backend.

## Error Messages
- `Access to XMLHttpRequest has been blocked by CORS policy`
- `No 'Access-Control-Allow-Origin' header is present`
- `Response to preflight request doesn't pass access control check`

## Solutions

### 1. Updated Server Configuration
The `server.js` file has been updated with a more robust CORS configuration:

```javascript
// CORS configuration for Vercel deployment
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://healthcare-frontend-eight.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
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
  ]
};
```

### 2. New API Handler
A new `api/index.js` file has been created specifically for Vercel's serverless environment.

### 3. Updated Vercel Configuration
The `vercel.json` file has been updated to use the new API handler:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

## Deployment Steps

### 1. Redeploy the Backend
```bash
# Make sure you're in the root directory
vercel --prod
```

### 2. Set Environment Variables in Vercel
In your Vercel dashboard, set these environment variables:
- `MONGODB_URI`: Your MongoDB connection string
- `NODE_ENV`: `production`

### 3. Test the API
After deployment, test the API endpoints:
- `https://your-backend-url.vercel.app/api/test`
- `https://your-backend-url.vercel.app/api/dashboard/stats`

### 4. Update Frontend Configuration
Make sure your `client/src/config.js` has the correct backend URL:

```javascript
const config = {
  production: {
    apiUrl: 'https://your-backend-url.vercel.app'
  }
};
```

## Alternative Solutions

### Option 1: Use a CORS Proxy
If the above doesn't work, you can use a CORS proxy:

```javascript
// In client/src/config.js
const config = {
  production: {
    apiUrl: 'https://cors-anywhere.herokuapp.com/https://your-backend-url.vercel.app'
  }
};
```

### Option 2: Vercel Functions
Create individual API functions in the `api/` directory:

```javascript
// api/dashboard-stats.js
const cors = require('cors')({ origin: true });

module.exports = (req, res) => {
  cors(req, res, () => {
    // Your API logic here
    res.json({ stats: 'data' });
  });
};
```

## Testing

### 1. Test CORS with curl
```bash
curl -H "Origin: https://healthcare-frontend-eight.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://your-backend-url.vercel.app/api/test
```

### 2. Test in Browser Console
```javascript
fetch('https://your-backend-url.vercel.app/api/test')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## Common Issues

### 1. Preflight Requests
Make sure your server handles OPTIONS requests properly:
```javascript
if (req.method === 'OPTIONS') {
  res.status(200).end();
  return;
}
```

### 2. Multiple CORS Headers
Avoid setting multiple CORS headers. Use either the cors middleware or manual headers, not both.

### 3. Vercel Environment
Vercel's serverless environment might require different CORS handling than traditional Express servers.

## Support
If you're still experiencing issues:
1. Check the Vercel deployment logs
2. Test the API endpoints directly
3. Verify environment variables are set correctly
4. Ensure MongoDB connection is working

## Files Modified
- `server.js` - Updated CORS configuration
- `api/index.js` - New API handler for Vercel
- `vercel.json` - Updated routing configuration
- `deploy.sh` - Updated deployment script 