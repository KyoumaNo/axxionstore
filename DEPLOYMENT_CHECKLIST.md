# 📋 AXXION STORE - DEPLOYMENT CHECKLIST

Gunakan checklist ini untuk memastikan tidak ada step yang terlewat!

---

## ✅ PHASE 1: LOCAL SETUP (Do These First!)

### Database Setup
- [ ] Go to https://neon.tech
- [ ] Sign up with email or GitHub
- [ ] Create project named "axxion-store"
- [ ] Select region (pick Singapore/Tokyo for Indonesia)
- [ ] Create project
- [ ] Copy connection string from "Connection String" tab
- [ ] Connection string format: `postgresql://user:pass@ep-xxx.region.neon.tech/db?sslmode=require`
- [ ] **SAVE THIS STRING** - you'll need it multiple times!
- [ ] Optional: Test connection with `psql [connection_string]`

### Backend Local Setup
- [ ] Open terminal in `Backend` folder
- [ ] Run `npm install`
- [ ] Create `.env` file with:
  ```
  PORT=3000
  DATABASE_URL=postgresql://...
  NODE_ENV=development
  ```
- [ ] Run `npm start`
- [ ] Verify output: `✅ Server running on port 3000`
- [ ] **LEAVE RUNNING** in this terminal

### Backend API Testing
- [ ] Open new terminal
- [ ] Test: `curl http://localhost:3000/api/health`
- [ ] Should get: `{"status":"OK"}`
- [ ] Test: `curl http://localhost:3000/api/products`
- [ ] Should get: `{"success":true,"data":[],"count":0}`
- [ ] **All tests passed!** ✅

### Frontend Local Setup
- [ ] Open new terminal
- [ ] Go to `Website` folder
- [ ] Run: `python3 -m http.server 5000`
- [ ] Should see: `Serving HTTP on 0.0.0.0 port 5000`
- [ ] **LEAVE RUNNING** in this terminal

### Frontend Testing
- [ ] Open browser: `http://localhost:5000`
- [ ] Page should load (futuristic UI)
- [ ] Check browser console for errors
- [ ] Should be empty or no critical errors
- [ ] **Frontend loading!** ✅

### Create Test Product
- [ ] Open another terminal
- [ ] Run this curl command:
  ```bash
  curl -X POST http://localhost:3000/api/products \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test Product",
      "price": 100000,
      "stock": 10,
      "category": "Test"
    }'
  ```
- [ ] Should get success response with new product ID
- [ ] Go back to browser
- [ ] Refresh `http://localhost:5000`
- [ ] Product should appear in display! ✅
- [ ] **LOCAL SYSTEM WORKING!**

---

## ✅ PHASE 2: PRODUCTION DEPLOYMENT

### Backend - Railway Setup

#### Create Railway Account
- [ ] Go to https://railway.app
- [ ] Click "Login"
- [ ] Sign up with GitHub (easiest)
- [ ] Authorize Railway to access GitHub
- [ ] Create organization (or skip)

#### Prepare Backend for Railway
- [ ] Verify `Backend/package.json` has `"type": "module"`
- [ ] Verify `package.json` has `"start": "node server.js"`
- [ ] Verify `Backend/.env.example` exists
- [ ] Verify `Backend/.gitignore` exists with `node_modules/` and `.env`
- [ ] Verify `Backend/server.js` has error handling
- [ ] All files checked ✅

#### Push to GitHub
- [ ] Open terminal in root folder (`WebsiteAxxion`)
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit - AXXION STORE"`
- [ ] Run: `git branch -M main`
- [ ] Run: `git remote add origin https://github.com/YOUR_USERNAME/axxion-store.git`
- [ ] Run: `git push -u origin main`
- [ ] Wait for push to complete
- [ ] Repository ready ✅

#### Deploy to Railway
- [ ] Go to Railway dashboard
- [ ] Click "New Project"
- [ ] Click "Deploy from GitHub"
- [ ] Click "Configure GitHub App" (first time only)
- [ ] Install Railway GitHub app
- [ ] Select your repository
- [ ] Wait for Railway to detect and auto-build
- [ ] Wait 3-5 minutes for deployment
- [ ] Status should show "Running"
- [ ] **Backend deployed!** ✅

#### Configure Environment Variables
- [ ] In Railway dashboard, select your project
- [ ] Go to "Variables" tab
- [ ] Add variable:
  - Name: `DATABASE_URL`
  - Value: `postgresql://user:pass@ep-xxx.region.neon.tech/db?sslmode=require`
- [ ] Add variable:
  - Name: `PORT`
  - Value: `3000`
- [ ] Add variable:
  - Name: `NODE_ENV`
  - Value: `production`
- [ ] Click "Add" for each
- [ ] Railway auto-restarts with new variables
- [ ] Wait for "Running" status again
- [ ] Variables configured ✅

#### Get Railway Production URL
- [ ] In Railway, go to Settings tab
- [ ] Find "Domains" section
- [ ] Copy the auto-generated domain
- [ ] Format: `https://axxion-store-production-xxxx.railway.app`
- [ ] **SAVE THIS URL** - needed for frontend!

#### Test Railway Deployment
- [ ] Open terminal
- [ ] Test health: `curl https://axxion-store-production-xxxx.railway.app/api/health`
- [ ] Should respond: `{"status":"OK"}`
- [ ] Test products: `curl https://axxion-store-production-xxxx.railway.app/api/products`
- [ ] Should respond with products list
- [ ] **Backend production working!** ✅

### Frontend - Vercel Setup

#### Update Frontend API URL
- [ ] Open `Website/api.js` in editor
- [ ] Find line: `const API_URL = 'http://localhost:3000/api'`
- [ ] Change to: `const API_URL = 'https://axxion-store-production-xxxx.railway.app/api'`
- [ ] Replace `xxxx` with your actual Railway domain
- [ ] Save file
- [ ] **API URL updated** ✅

#### Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Click "Sign Up"
- [ ] Sign up with GitHub
- [ ] Authorize Vercel to access GitHub
- [ ] Account created ✅

#### Deploy to Vercel
- [ ] Make sure you saved the api.js change
- [ ] Go back to terminal
- [ ] Commit changes: `git add Website/api.js`
- [ ] `git commit -m "Update API URL for production"`
- [ ] `git push`
- [ ] Go to Vercel dashboard
- [ ] Click "Add New..." > "Project"
- [ ] Click "Import Project"
- [ ] Select your GitHub repository
- [ ] Vercel auto-detects project
- [ ] Root Directory: select `Website` folder
- [ ] Framework: Leave as "Other"
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes for deployment
- [ ] Should show "Ready"
- [ ] **Frontend deployed!** ✅

#### Get Vercel Production URL
- [ ] In Vercel dashboard, find your project
- [ ] Copy the domain shown
- [ ] Format: `https://your-domain.vercel.app`
- [ ] This is your live website!

#### Test Vercel Deployment
- [ ] Open browser: `https://your-domain.vercel.app`
- [ ] Page should load (futuristic UI)
- [ ] Check browser console - no critical errors
- [ ] **Frontend live!** ✅

---

## ✅ PHASE 3: INTEGRATION & TESTING

### Full System Test
- [ ] Open Vercel URL in browser
- [ ] Check if products display (from Railway database)
- [ ] Create new product via curl:
  ```bash
  curl -X POST https://your-railway-url/api/products \
    -H "Content-Type: application/json" \
    -d '{"name":"New Product","price":50000,"stock":5}'
  ```
- [ ] Refresh Vercel frontend
- [ ] New product should appear
- [ ] **Real-time system working!** ✅

### Real-time Updates Test
- [ ] Keep Vercel frontend open in browser
- [ ] Update product via curl:
  ```bash
  curl -X PUT https://your-railway-url/api/products/1 \
    -H "Content-Type: application/json" \
    -d '{"price":60000}'
  ```
- [ ] Wait 5 seconds (polling interval)
- [ ] Product price should update automatically
- [ ] No refresh needed!
- [ ] **Real-time working!** ✅

### Admin Panel Test
- [ ] In Vercel frontend, find admin panel (if shown)
- [ ] Test add product feature
- [ ] Test edit product feature
- [ ] Test delete product feature
- [ ] Check Railway logs for errors
- [ ] All operations working ✅

### Error Handling Test
- [ ] Try to delete non-existent product
- [ ] Should get error message (not crash)
- [ ] Try invalid product data
- [ ] Should get validation error
- [ ] **Error handling working!** ✅

---

## ✅ PHASE 4: FINAL VERIFICATION

### Railway Health Check
- [ ] Go to Railway dashboard
- [ ] Check "Logs" tab
- [ ] Should show: `✅ Server running`
- [ ] Should show: `✅ Database initialized`
- [ ] No error messages
- [ ] Check "Metrics" tab
- [ ] CPU usage should be low
- [ ] Memory usage normal
- [ ] **Backend healthy!** ✅

### Vercel Health Check
- [ ] Go to Vercel dashboard
- [ ] Check "Deployments" tab
- [ ] Latest deployment should show "Ready"
- [ ] Status should be successful
- [ ] **Frontend healthy!** ✅

### Database Health Check
- [ ] Go to Neon dashboard
- [ ] Find your project
- [ ] Check connection status
- [ ] Should show "Active"
- [ ] Click on "Tables"
- [ ] Should see `products` table
- [ ] Should see test data inside
- [ ] **Database healthy!** ✅

---

## ✅ FINAL CHECKLIST

Before declaring DONE:

- [ ] Backend running on Railway
- [ ] Frontend running on Vercel
- [ ] Database connected to Railway
- [ ] Frontend API URL points to Railway
- [ ] Products display on frontend
- [ ] Create product works
- [ ] Update product works
- [ ] Delete product works
- [ ] Real-time updates working (5s polling)
- [ ] No error messages in logs
- [ ] All docs read and understood
- [ ] GitHub repo created and pushed
- [ ] Environment variables set correctly

---

## 🎉 SUCCESS!

If all items above are checked:

**YOUR AXXION STORE IS LIVE!** 🎊

### What You Have:
- ✅ Live website at: `https://your-domain.vercel.app`
- ✅ Live API at: `https://your-railway-url.railway.app/api`
- ✅ Live database at: Neon PostgreSQL
- ✅ Real-time updates for all users
- ✅ Shared database (not local device data)
- ✅ Production-grade deployment
- ✅ Full documentation
- ✅ 0 cost (free tier!)

### Next Steps:
1. Share your live URL!
2. Add authentication (Phase 2)
3. Add user accounts
4. Add payment system
5. Scale as needed

---

## 📞 TROUBLESHOOTING QUICK REFERENCE

| Problem | Solution |
|---------|----------|
| Can't connect to database | Check DATABASE_URL in Railway variables |
| Frontend shows blank | Check browser console, check api.js URL |
| API returns 404 | Verify endpoint path, check Railway logs |
| Slow updates | Polling interval can be customized in api.js |
| Railway deployment fails | Check Backend/.gitignore, check logs |
| Vercel shows 404 | Select Website folder as root, redeploy |

---

## 📚 DOCUMENTATION REFERENCE

- **[00_START_HERE.md](./00_START_HERE.md)** - Overview
- **[SETUP.md](./SETUP.md)** - Detailed guide
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference
- **[INTEGRATION.md](./INTEGRATION.md)** - Code examples
- **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** - Backend deploy
- **[README.md](./README.md)** - API reference
- **[INDEX.md](./INDEX.md)** - Project index

---

## ✅ YOU'RE DONE!

Print this checklist, check each box, and celebrate when done! 🎉

**Timeline: ~1 hour from 0 to LIVE!** ⚡

Good luck! 🚀
