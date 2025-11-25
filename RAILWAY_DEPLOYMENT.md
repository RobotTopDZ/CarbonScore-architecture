# Railway Deployment Guide

## 🚂 Deploy to Railway

Follow these steps to deploy the CarbonScore Architecture Diagram to Railway:

### Step 1: Prerequisites
- A Railway account (sign up at https://railway.app)
- GitHub repository connected (already done: https://github.com/RobotTopDZ/CarbonScore-architecture)

### Step 2: Deploy from GitHub

1. **Login to Railway**
   - Go to https://railway.app
   - Click "Login" and authenticate with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `RobotTopDZ/CarbonScore-architecture`

3. **Configure Deployment**
   Railway will automatically detect the configuration from `railway.json`:
   - Builder: Nixpacks (auto-detected)
   - Start Command: `npm run dev -- --host 0.0.0.0 --port $PORT`
   - Port: Automatically assigned by Railway

4. **Deploy**
   - Railway will automatically:
     - Install dependencies (`npm install`)
     - Build the project
     - Start the development server
   - Wait for deployment to complete (usually 2-3 minutes)

5. **Access Your App**
   - Once deployed, Railway will provide a public URL
   - Click "Generate Domain" if not automatically generated
   - Your app will be available at: `https://your-app-name.up.railway.app`

### Step 3: Environment Variables (Optional)

No environment variables are required for this app, but you can add them if needed:
- Go to your project settings
- Click "Variables"
- Add any custom environment variables

### Configuration Files

The following files ensure Railway compatibility:

#### `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run dev -- --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### `vite.config.js`
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allow external connections
    port: process.env.PORT || 5173,  // Use Railway's PORT
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
  }
})
```

### Troubleshooting

**Issue: App not loading**
- Check Railway logs for errors
- Ensure all dependencies are in `package.json`
- Verify the start command in `railway.json`

**Issue: Port binding error**
- Railway automatically assigns a PORT environment variable
- The app is configured to use `process.env.PORT`

**Issue: Build fails**
- Check that Node.js version is compatible
- Ensure all dependencies are properly installed
- Review build logs in Railway dashboard

### Updates and Redeployment

To update your deployed app:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Railway will automatically detect the push and redeploy

### Custom Domain (Optional)

To add a custom domain:
1. Go to your Railway project
2. Click "Settings" → "Domains"
3. Click "Add Domain"
4. Follow the DNS configuration instructions

## 🎉 Success!

Your CarbonScore Architecture Diagram is now live on Railway!

## 📊 Monitoring

Railway provides:
- Real-time logs
- Metrics and analytics
- Deployment history
- Resource usage statistics

Access these from your Railway project dashboard.
