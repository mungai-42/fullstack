#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating one with default values..."
    cat > .env << EOF
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/healthcare-system

# Node Environment
NODE_ENV=production

# Port
PORT=5000
EOF
    echo "✅ Created .env file with default values"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

# Build the client
echo "🔨 Building client..."
cd client && npm run build && cd ..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "🔧 Important: Make sure to set the following environment variables in Vercel:"
echo "   - MONGODB_URI: Your MongoDB connection string"
echo "   - NODE_ENV: production"
echo ""
echo "🌐 Your application should now be live!" 