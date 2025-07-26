# Deployment Guide - Healthcare System to Vercel

This guide will help you deploy your MERN stack healthcare system to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a cloud database at [mongodb.com](https://mongodb.com)
3. **GitHub Account**: For version control

## Step 1: Set up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com](https://mongodb.com)
   - Sign up for a free account
   - Create a new cluster (free tier)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `healthcare-system`

## Step 2: Deploy Backend to Vercel

1. **Prepare Backend**
   ```bash
   # Make sure you're in the root directory
   cd /path/to/your/healthcare-system
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy Backend**
   ```bash
   vercel
   ```

5. **Set Environment Variables**
   - Go to your Vercel dashboard
   - Select your backend project
   - Go to Settings → Environment Variables
   - Add:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `NODE_ENV`: `production`

6. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

7. **Copy Backend URL**
   - Note the URL provided by Vercel (e.g., `https://your-backend.vercel.app`)

## Step 3: Update Frontend Configuration

1. **Update API URL**
   - Edit `client/src/config.js`
   - Replace `your-backend-url.vercel.app` with your actual backend URL

2. **Commit Changes**
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

## Step 4: Deploy Frontend to Vercel

1. **Navigate to Client Directory**
   ```bash
   cd client
   ```

2. **Deploy Frontend**
   ```bash
   vercel
   ```

3. **Set Frontend Environment Variables**
   - Go to your frontend Vercel dashboard
   - Add environment variable:
     - `REACT_APP_API_URL`: Your backend URL

4. **Redeploy Frontend**
   ```bash
   vercel --prod
   ```

## Step 5: Alternative Deployment Methods

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/healthcare-system.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure settings:
     - **Root Directory**: `./` (for backend) or `./client` (for frontend)
     - **Build Command**: `npm run build` (for frontend)
     - **Output Directory**: `build` (for frontend)

### Method 2: Separate Repositories

1. **Backend Repository**
   ```bash
   # Create backend repo
   mkdir healthcare-backend
   cp server.js package.json models/ routes/ vercel.json ./
   git init
   git add .
   git commit -m "Backend initial commit"
   git remote add origin https://github.com/yourusername/healthcare-backend.git
   git push -u origin main
   ```

2. **Frontend Repository**
   ```bash
   # Create frontend repo
   mkdir healthcare-frontend
   cp -r client/* ./
   git init
   git add .
   git commit -m "Frontend initial commit"
   git remote add origin https://github.com/yourusername/healthcare-frontend.git
   git push -u origin main
   ```

## Step 6: Environment Variables Setup

### Backend Environment Variables (Vercel Dashboard)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare-system?retryWrites=true&w=majority
NODE_ENV=production
```

### Frontend Environment Variables (Vercel Dashboard)
```
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

## Step 7: Testing Deployment

1. **Test Backend API**
   - Visit: `https://your-backend-url.vercel.app/api/patients`
   - Should return JSON response

2. **Test Frontend**
   - Visit: `https://your-frontend-url.vercel.app`
   - Should load the healthcare system interface

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Make sure your backend CORS settings include your frontend domain
   - Update `server.js` CORS configuration

2. **MongoDB Connection Issues**
   - Verify your MongoDB Atlas connection string
   - Check if your IP is whitelisted in MongoDB Atlas

3. **Build Errors**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`

4. **API 404 Errors**
   - Verify your API routes are correct
   - Check if the backend is properly deployed

### Useful Commands:

```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs

# Remove deployment
vercel remove

# Update deployment
vercel --prod
```

## Final URLs

After successful deployment, you'll have:
- **Backend**: `https://your-backend.vercel.app`
- **Frontend**: `https://your-frontend.vercel.app`

## Next Steps

1. **Custom Domain**: Add a custom domain in Vercel dashboard
2. **SSL Certificate**: Automatically handled by Vercel
3. **Monitoring**: Set up Vercel Analytics
4. **Backup**: Set up MongoDB Atlas backups

Your healthcare system is now live and accessible worldwide! 🚀 