#!/bin/bash

echo "🚀 Deploying CORS fixes to Vercel..."

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please run this script from the project root."
    exit 1
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Error: Vercel CLI not found. Please install it first:"
    echo "   npm i -g vercel"
    exit 1
fi

# Check git status
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes. Consider committing them first."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

echo "📝 Summary of CORS changes:"
echo "   ✅ Added 'https://fullstack-seven-navy.vercel.app' to allowed origins"
echo "   ✅ Updated vercel.json with CORS headers"
echo "   ✅ Added route-level CORS middleware to appointments"
echo "   ✅ Added OPTIONS preflight handling"

echo ""
echo "🔄 Deploying to Vercel..."

# Deploy to Vercel
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ CORS fixes deployed successfully!"
    echo ""
    echo "🔗 Test your CORS configuration:"
    echo "   1. Open test-cors.html in your browser"
    echo "   2. Click 'Test GET /api/appointments'"
    echo "   3. Check if the request succeeds"
    echo ""
    echo "📱 Your frontend at 'https://fullstack-seven-navy.vercel.app' should now be able to access:"
    echo "   https://fullstack-mungai-42s-projects.vercel.app/api/appointments"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi