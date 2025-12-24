# 🚀 Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Free tier with generous limits
- Made by the creators of Next.js
- Automatic HTTPS
- Global CDN
- Zero configuration needed

**Steps:**

1. **Push your code to GitHub** (already done!)

2. **Go to [Vercel](https://vercel.com)**
   - Sign up with GitHub
   - Click "Add New Project"
   - Import your `WB_Hack1_Legal` repository

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add these from your `.env.local`:
   ```
   OPENAI_API_KEY=your_key_here
   MONGODB_URI=your_mongodb_uri_here
   MONGODB_DB_NAME=LegalAnalyzer
   MONGODB_COLLECTION_NAME=legal_clauses
   ```

4. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your live URL: `https://your-project.vercel.app`

**Auto-Deploy:**
- Every `git push` to main automatically deploys
- Preview deployments for pull requests

---

### Option 2: Render

**Why Render?**
- Free tier available
- Supports Docker
- Easy database integration
- Background workers support

**Steps:**

1. **Go to [Render](https://render.com)**
   - Sign up with GitHub

2. **New Web Service**
   - Connect your repository
   - Choose "Docker" as environment
   - It will auto-detect your `Dockerfile`

3. **Configure:**
   - Name: `legal-analyzer`
   - Branch: `main`
   - Docker Command: (leave default)
   - Plan: Free

4. **Environment Variables:**
   ```
   OPENAI_API_KEY=your_key
   MONGODB_URI=your_uri
   MONGODB_DB_NAME=LegalAnalyzer
   MONGODB_COLLECTION_NAME=legal_clauses
   NODE_ENV=production
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - First deploy takes ~5-10 minutes
   - Get URL: `https://legal-analyzer.onrender.com`

---

### Option 3: Railway

**Why Railway?**
- $5 free credit/month
- Simple CLI deployment
- Excellent for Docker apps

**Steps:**

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Initialize:**
   ```bash
   railway init
   ```

4. **Add Environment Variables:**
   ```bash
   railway variables set OPENAI_API_KEY=your_key
   railway variables set MONGODB_URI=your_uri
   railway variables set MONGODB_DB_NAME=LegalAnalyzer
   railway variables set MONGODB_COLLECTION_NAME=legal_clauses
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Get URL:**
   ```bash
   railway domain
   ```

---

## MongoDB Atlas Setup for Production

**Important:** Your MongoDB needs to allow connections from anywhere for cloud deployment.

1. **Go to MongoDB Atlas** → Your Cluster
2. **Network Access** → IP Whitelist
3. **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Required for cloud platforms (they use dynamic IPs)
4. **Confirm**

---

## Environment Variables Checklist

Make sure these are set in your deployment platform:

```env
# Required
OPENAI_API_KEY=sk-proj-...
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=LegalAnalyzer
MONGODB_COLLECTION_NAME=legal_clauses

# Optional
LANGCHAIN_TRACING_V2=false
LANGCHAIN_API_KEY=
NODE_ENV=production
```

---

## Testing Your Deployment

1. **Health Check:**
   ```bash
   curl https://your-app-url.com/api/health
   ```
   Should return: `{"status":"healthy",...}`

2. **Analyze Endpoint:**
   ```bash
   curl -X POST https://your-app-url.com/api/analyze \
     -H "Content-Type: application/json" \
     -d '{"source":"test terms", "type":"text", "mode":"pattern"}'
   ```

3. **Open in Browser:**
   - Visit your URL
   - Try analyzing a document
   - Check the search feature

---

## Troubleshooting

### "Application Error" or 500 Error

**Check:**
1. Environment variables are set correctly
2. MongoDB Atlas IP whitelist includes `0.0.0.0/0`
3. OpenAI API key is valid and has credits
4. View logs in your platform's dashboard

### "Database Connection Failed"

**Fix:**
- MongoDB Atlas → Network Access → Allow 0.0.0.0/0
- Check MONGODB_URI is correct
- Test connection: `curl https://your-app-url.com/api/db-test`

### "OpenAI API Error"

**Fix:**
- Verify OPENAI_API_KEY in environment variables
- Check API key has remaining credits
- Visit https://platform.openai.com/usage

### Build Fails

**Common Issues:**
- Missing `output: 'standalone'` in next.config.js (✓ already added)
- npm ci fails → Use `npm install --legacy-peer-deps` locally first
- TypeScript errors → Run `npm run build` locally to catch them

---

## Performance Optimization

### Cold Starts (Free Tiers)
- Vercel/Render free tiers may "sleep" after inactivity
- First request after sleep takes ~10-30 seconds
- Subsequent requests are fast

### Keep Alive (Optional)
Use a service like [UptimeRobot](https://uptimerobot.com) to ping your app every 5 minutes and prevent sleeping.

---

## Custom Domain (Optional)

### Vercel:
1. Project Settings → Domains
2. Add your domain
3. Update DNS records (A/CNAME)

### Render:
1. Settings → Custom Domain
2. Follow DNS instructions

---

## Monitoring

### Built-in Health Endpoint
- `/api/health` - System status
- `/api/db-test` - Database connectivity

### External Monitoring
- [Better Uptime](https://betteruptime.com)
- [Pingdom](https://www.pingdom.com)
- [UptimeRobot](https://uptimerobot.com)

Set up alerts for downtime!

---

## Cost Estimates

### Vercel (Recommended)
- **Free Tier:** 100GB bandwidth, unlimited requests
- **Hobby:** $20/month if you exceed free tier

### Render
- **Free:** Good for demos, sleeps after 15min inactivity
- **Starter:** $7/month, always on

### OpenAI API (Pay-as-you-go)
- GPT-4 Turbo: ~$0.01 per 1K tokens
- Embeddings: ~$0.0001 per 1K tokens
- **Estimate:** $0.03-0.10 per document analysis
- **Budget:** $10-20 for hackathon demo should be plenty

### MongoDB Atlas
- **Free Tier:** 512MB storage (thousands of documents)
- Free forever, perfect for this project

---

## Post-Deployment Checklist

- [ ] App is accessible at public URL
- [ ] `/api/health` returns `"status":"healthy"`
- [ ] Document analysis works (test with sample T&C)
- [ ] Clause search works
- [ ] Risk report generates correctly
- [ ] Export functionality works
- [ ] No console errors in browser
- [ ] MongoDB Atlas shows incoming connections
- [ ] OpenAI dashboard shows API usage

---

## Demo Tips for Hackathon

1. **Have backup screenshots/video** in case of demo issues
2. **Pre-load interesting example** (controversial T&C)
3. **Show the risk report** - it's visually impressive
4. **Highlight unique features:**
   - AI vs Pattern matching modes
   - Plain English translation
   - Risk scoring algorithm
   - Export functionality
5. **Mention tech stack:** Next.js 15, GPT-4, MongoDB Atlas Vector Search

---

## 🎉 You're Live!

Share your URL:
- Add to README.md
- Post in hackathon Discord/Slack
- Update your GitHub repo description

**Congratulations on completing your deployment!** 🚀
