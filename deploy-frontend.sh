#!/bin/bash

# 🚀 Deploy Enhanced Healthcare Dashboard Frontend

echo "🏥 Deploying Enhanced Healthcare Dashboard Frontend..."
echo "✨ Features: Modern design, comprehensive icons, responsive layout"

# Navigate to client directory
cd client

# Build the React application
echo "📦 Building React application..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod --yes

echo "✅ Frontend deployment complete!"
echo "🎉 Your enhanced healthcare dashboard is now live!"
echo ""
echo "📊 Dashboard Features Available:"
echo "  🎨 Modern gradient background design"
echo "  🏥 Medical-themed icons throughout"
echo "  📱 Fully responsive mobile design"
echo "  ⚡ Smooth animations and hover effects"
echo "  📈 Real-time data visualization"
echo "  👨‍⚕️ Enhanced appointment management"
echo ""
echo "🔗 Next Steps:"
echo "  1. Visit your deployed frontend URL"
echo "  2. Check that it connects to your backend API"
echo "  3. Test the enhanced dashboard features"