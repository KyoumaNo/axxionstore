# 📖 PANDUAN LENGKAP SETUP AXXION STORE

## 🌍 Overview Arsitektur

```
┌─────────────────────────────────────┐
│   FRONTEND (Vercel)                 │
│   - index.html                      │
│   - Real-time UI Updates            │
│   - Polling dari Backend setiap 5s  │
└──────────────┬──────────────────────┘
               │ HTTPS REST API
               ▼
┌─────────────────────────────────────┐
│   BACKEND (Railway)                 │
│   - Express.js Server               │
│   - API Endpoints                   │
│   - Business Logic                  │
└──────────────┬──────────────────────┘
               │ Connection Pool
               ▼
┌─────────────────────────────────────┐
│   DATABASE (Neon Postgres)          │
│   - Shared Database                 │
│   - Real-time untuk semua user      │
│   - Backup otomatis                 │
└─────────────────────────────────────┘
```

---

## ✅ CHECKLIST SETUP

- [ ] **1. Setup Neon Database**
- [ ] **2. Setup Backend di Local**
- [ ] **3. Deploy Backend ke Railway**
- [ ] **4. Setup Frontend di Local**
- [ ] **5. Deploy Frontend ke Vercel**
- [ ] **6. Test Integration**

---

## 🟣 STEP 1: Setup Neon Postgres Database

### 1A. Create Account di Neon

1. Buka https://neon.tech/
2. Click "Sign Up" atau "Get Started Free"
3. Pilih sign up dengan Email atau GitHub
4. Verify email
5. Create organization

### 1B. Create Project

1. Di dashboard, click "Create Project"
2. Isi nama project: `axxion-store`
3. Pilih region terdekat (untuk Indonesia pilih Singapore/Tokyo)
4. Click "Create Project"

### 1C. Get Connection String

1. Buka project yang baru dibuat
2. Di sidebar, click "Connection String"
3. Pilih mode: "Pooled connection"
4. Copy connection string:
   ```
   postgresql://neondb_owner:xxxxx@ep-xxx.region.neon.tech/neondb?sslmode=require
   ```
5. **SIMPAN STRING INI - AKAN DIPAKAI DI BACKEND**

### 1D. Test Connection (Optional)

Download psql (PostgreSQL client):
```bash
# macOS
brew install postgresql

# Windows (download dari https://www.postgresql.org/download/windows/)
# Linux
sudo apt install postgresql-client
```

Test connection:
```bash
psql "postgresql://neondb_owner:xxxxx@ep-xxx.region.neon.tech/neondb?sslmode=require"
# Jika berhasil, akan masuk ke psql console
\dt  # List tables
\q  # Quit
```

---

## 🟠 STEP 2: Setup Backend di Local

### 2A. Install Dependencies

```bash
cd Backend
npm install
```

Output yang diharapkan:
```
added 58 packages in 2s
```

### 2B. Create .env File

Buat file `Backend/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://neondb_owner:xxxxx@ep-xxx.region.neon.tech/neondb?sslmode=require
NODE_ENV=development
```

**PENTING**: Ganti xxx dengan connection string dari Neon!

### 2C. Test Backend Lokal

```bash
cd Backend
npm start
```

Seharusnya output:
```
✅ Server running on port 3000
📍 API: http://localhost:3000/api
✅ Database initialized successfully
```

### 2D. Test API Endpoints

**Terminal baru:**

```bash
# Check health
curl http://localhost:3000/api/health
# Output: {"status":"OK","message":"Server is running"}

# Get all products (empty di awal)
curl http://localhost:3000/api/products
# Output: {"success":true,"data":[],"count":0}

# Create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 100000,
    "stock": 10,
    "category": "Test"
  }'

# Get all products (sekarang ada 1)
curl http://localhost:3000/api/products
```

Jika semua berjalan, **backend siap!** ✅

---

## 🔵 STEP 3: Deploy Backend ke Railway

### 3A. Create Railway Account

1. Buka https://railway.app/
2. Click "Login"
3. Sign up dengan GitHub (paling mudah)
4. Authorize Railway untuk akses GitHub

### 3B. Create New Project

1. Di Railway dashboard, click "New Project"
2. Pilih "Deploy from GitHub"
3. Authorize GitHub access
4. Pilih repository kalian
5. Pilih branch: `main` atau `master`
6. Select source: Pilih folder `Backend`

### 3C. Add Environment Variables

1. Di Railway, tab "Variables"
2. Add variables:
   - `DATABASE_URL`: Paste connection string dari Neon
   - `PORT`: `3000`
   - `NODE_ENV`: `production`
3. Click "Save"

### 3D. Deploy

1. Railway akan auto-detect `package.json`
2. Tunggu proses deploy (2-5 menit)
3. Setelah sukses, copy production URL:
   ```
   https://axxion-store-production-xxxx.railway.app
   ```
   **SIMPAN URL INI - AKAN DIPAKAI DI FRONTEND**

### 3E. Verify Production

```bash
# Test production endpoint
curl https://axxion-store-production-xxxx.railway.app/api/health
# Output: {"status":"OK","message":"Server is running"}
```

---

## 🟡 STEP 4: Setup Frontend di Local

### 4A. Update API URL

Edit `Website/api.js`, ubah baris:

```javascript
const API_URL = 'http://localhost:3000/api'; // UNTUK LOCAL

// Untuk production nanti:
// const API_URL = 'https://axxion-store-production-xxxx.railway.app/api';
```

### 4B. Test Frontend Lokal

**Option 1: Simple HTTP Server (Python)**
```bash
cd Website
python3 -m http.server 5000
# Buka http://localhost:5000
```

**Option 2: Node.js Server**
```bash
cd Website
npx http-server -p 5000
# Buka http://localhost:5000
```

### 4C. Test Perubahan Data

1. Buka `http://localhost:5000` di browser
2. Buka backend di tab lain yang sedang running
3. Di backend, buat product baru via curl
4. Refresh frontend - produk baru akan muncul! ✅

---

## 🟢 STEP 5: Deploy Frontend ke Vercel

### 5A. Create Vercel Account

1. Buka https://vercel.com/
2. Click "Sign Up"
3. Pilih sign up dengan GitHub (paling mudah)
4. Authorize Vercel

### 5B. Deploy Project

**Option 1: Vercel CLI**
```bash
npm i -g vercel
cd Website
vercel
# Follow prompts dan deploy
```

**Option 2: Git Integration**
1. Push `Website` folder ke GitHub
2. Di Vercel dashboard, click "Add New..." > "Project"
3. Import repository
4. Select `Website` folder sebagai root
5. Vercel akan auto-detect HTML file
6. Click "Deploy"

### 5C. Update Backend URL untuk Production

1. Setelah Vercel deploy sukses, dapat URL: `https://your-domain.vercel.app`
2. Edit `Website/api.js`:
   ```javascript
   const API_URL = 'https://axxion-store-production-xxxx.railway.app/api';
   ```
3. Push changes / re-deploy
4. Vercel auto-redeploy

---

## 🧪 STEP 6: Test Integration

### 6A. Full System Test

1. **Frontend**: Buka `https://your-domain.vercel.app`
2. **Backend**: Buka Railway logs untuk check status
3. **Database**: Check di Neon dashboard

### 6B. Create Product via Frontend (Future Feature)

Untuk sekarang, create product via backend API:

```bash
curl -X POST https://axxion-store-production-xxxx.railway.app/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming",
    "description": "RTX 4090, Intel i9",
    "price": 25000000,
    "stock": 5,
    "category": "Electronics"
  }'
```

### 6C. Check Frontend Updates

1. Refresh frontend
2. Produk baru seharusnya muncul di display
3. **Sukses! System working!** 🎉

---

## 🔄 WORKFLOW DEVELOPMENT

### Local Development
```bash
# Terminal 1: Backend
cd Backend
npm start

# Terminal 2: Frontend
cd Website
python3 -m http.server 5000
```

Akses: `http://localhost:5000`

### Production Updates
```bash
# Push ke GitHub
git add .
git commit -m "Update products"
git push

# Auto-deploy di Railway & Vercel
# (Tunggu GitHub Action selesai)
```

---

## 🚨 TROUBLESHOOTING

### Error: "Cannot connect to database"
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
✅ **Fix**: 
- Pastikan `DATABASE_URL` di `.env` benar
- Neon database sudah running
- Test: `psql [CONNECTION_STRING]`

### Error: "CORS blocked"
```
Access to XMLHttpRequest from origin 'http://localhost:5000' 
has been blocked by CORS policy
```
✅ **Fix**: Backend sudah include `cors()` - pastikan API_URL benar di `api.js`

### Vercel build fails
```
Error: Cannot find module 'express'
```
✅ **Fix**: Vercel cuma host static files - gak butuh build. Upload HTML/JS langsung.

### Railway deployment stuck
```
Build logs: 0%
```
✅ **Fix**: 
- Check Railway logs: `Railway > Logs`
- Rebuild: `Railway > Redeploy`

---

## 📞 Support Resources

- **Neon Docs**: https://neon.tech/docs
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Express Docs**: https://expressjs.com/

---

## 📋 CHECKLIST FINAL

Sebelum production:
- [ ] Database Neon sudah connect
- [ ] Backend di Railway sudah live
- [ ] Frontend di Vercel sudah live
- [ ] API URL di frontend sudah pointing ke Railway
- [ ] Test endpoints semua working
- [ ] Cek logs di Railway - no errors
- [ ] Vercel deployment status "Ready"

**SELAMAT! AXXION STORE SUDAH LIVE! 🎉**

---

*Last Updated: May 2026*
