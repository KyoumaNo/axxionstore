# 🚀 AXXION STORE - Full Stack Setup Guide

Store online dengan database terpusat menggunakan **Neon Postgres**, **Railway** (Backend), dan **Vercel** (Frontend).

---

## 📋 Struktur Project

```
WebsiteAxxion/
├── Backend/                 (Railway Deployment)
│   ├── server.js           (Entry point Express)
│   ├── package.json        
│   ├── .env.example        (Copy ke .env untuk local)
│   ├── db/
│   │   ├── connection.js   (Postgres connection pool)
│   │   └── init.js         (Database initialization)
│   ├── routes/
│   │   └── products.js     (CRUD API endpoints)
│   └── middleware/
│       └── errorHandler.js (Error handling)
│
└── Website/                (Vercel Deployment)
    ├── index.html          (Main UI)
    ├── api.js              (API Service Layer)
    ├── config.js           (Configuration)
    └── vercel.json         (Vercel config)
```

---

## 🔧 SETUP LOCAL DEVELOPMENT

### 1. **Setup Backend (Node.js)**

```bash
cd Backend
npm install
```

### 2. **Setup Neon Postgres Database**

1. Buka [neon.tech](https://neon.tech)
2. Sign up / Login
3. Create new project
4. Copy connection string format:
   ```
   postgresql://user:password@ep-xxxxx.region.neon.tech/database_name?sslmode=require
   ```

### 3. **Environment Variables Backend**

Buat file `.env` di folder `Backend/`:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@ep-xxxxx.region.neon.tech/database_name?sslmode=require
NODE_ENV=development
```

### 4. **Jalankan Backend Lokal**

```bash
cd Backend
npm start
# atau untuk development dengan auto-reload:
npm run dev
```

Output yang diharapkan:
```
✅ Server running on port 3000
📍 API: http://localhost:3000/api
✅ Database initialized successfully
```

### 5. **Test API Health**

```bash
curl http://localhost:3000/api/health
# Response: { "status": "OK", "message": "Server is running" }
```

### 6. **Update Frontend API URL**

Edit `Website/api.js`:

```javascript
const API_URL = 'http://localhost:3000/api'; // Local development
```

---

## 🎯 API ENDPOINTS

### **GET - Ambil Semua Products**
```
GET /api/products
Response: { success: true, data: [...], count: 5 }
```

### **GET - Ambil Product by ID**
```
GET /api/products/:id
Response: { success: true, data: {...} }
```

### **POST - Buat Product Baru**
```
POST /api/products
Body: {
  "name": "Laptop Gaming",
  "description": "RTX 4090",
  "price": 25000000,
  "stock": 10,
  "image_url": "https://...",
  "category": "Electronics"
}
Response: { success: true, message: "Product created successfully", data: {...} }
```

### **PUT - Update Product (Berlaku ke semua user)**
```
PUT /api/products/:id
Body: {
  "price": 24000000,
  "stock": 8
}
Response: { success: true, message: "Product updated successfully", data: {...} }
```

### **DELETE - Hapus Product**
```
DELETE /api/products/:id
Response: { success: true, message: "Product deleted successfully" }
```

---

## 🚀 DEPLOYMENT

### **1. Deploy Backend ke Railway**

#### Step 1: Prepare Repository
```bash
cd Backend
npm install
```

#### Step 2: Push ke Railway

**Option A: Railway CLI**
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

**Option B: GitHub Integration**
1. Buat folder `.github/workflows/` (optional, Railway auto-deploy)
2. Push ke GitHub
3. Connect GitHub repo di Railway dashboard
4. Set environment variables di Railway:
   - `DATABASE_URL`: Connection string Neon
   - `PORT`: 3000
   - `NODE_ENV`: production

#### Step 3: Get Production URL
Railway akan generate URL seperti: `https://your-app.railway.app`

---

### **2. Deploy Frontend ke Vercel**

#### Step 1: Create Folder Structure untuk Vercel
```bash
# Di folder Website, buat file ini:
```

Buat `Website/vercel.json`:
```json
{
  "buildCommand": "",
  "outputDirectory": ".",
  "devCommand": "python3 -m http.server 3001",
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

#### Step 2: Update Frontend API URL untuk Production

Edit `Website/api.js`:
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-railway-backend.railway.app/api'
  : 'http://localhost:3000/api';
```

#### Step 3: Deploy ke Vercel

**Option A: Vercel CLI**
```bash
npm i -g vercel
cd Website
vercel
```

**Option B: Git Integration**
1. Push folder `Website` ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Connect GitHub repo
5. Select `Website` folder
6. Set environment variables:
   - Tidak butuh env variables (hardcoded di api.js)
7. Deploy

Vercel akan generate URL seperti: `https://your-domain.vercel.app`

---

## 🔗 INTEGRASI REAL-TIME UPDATES

### **Polling (Recommended untuk mulai)**

Di `Website/index.html`, tambahkan di bagian `<script>`:

```javascript
// Auto-refresh products setiap 5 detik
setInterval(async () => {
  const products = await APIService.getAllProducts();
  renderProducts(products);
}, 5000);
```

### **WebSocket (Advanced - Optional)**

Untuk real-time yang lebih instant, gunakan WebSocket di backend (optional expansion):

```bash
npm install ws
```

---

## 📝 CONTOH DATA UNTUK TESTING

Buat product via API:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "description": "Latest Apple device",
    "price": 999,
    "stock": 50,
    "image_url": "https://via.placeholder.com/300",
    "category": "Electronics"
  }'
```

---

## 🛠️ TROUBLESHOOTING

### Database Connection Error
```
Error: ENOENT: no such file or directory
```
✅ **Solusi**: Pastikan DATABASE_URL di `.env` sudah benar dari Neon

### CORS Error di Frontend
```
Access to XMLHttpRequest blocked by CORS
```
✅ **Solusi**: Backend sudah include `cors()` - pastikan API_URL di api.js benar

### Backend tidak bisa connect ke Neon
```
Error: could not connect to server
```
✅ **Solusi**: 
- Pastikan Neon IP whitelist sudah allow all
- Test connection: `psql [CONNECTION_STRING]`

### Vercel build error
```
Error: Cannot find module 'api.js'
```
✅ **Solusi**: Website hanya static file - tidak butuh build, jsudah bisa di-deploy

---

## 📊 MONITORING

### Railway Dashboard
- Monitor logs: `Railway > Logs`
- Check uptime: `Railway > Status`
- View metrics: `Railway > Metrics`

### Vercel Dashboard
- Check deployments: `Vercel > Deployments`
- View analytics: `Vercel > Analytics`

---

## 🔐 SECURITY NOTES

- ❌ **JANGAN** share `.env` file
- ✅ **LAKUKAN** set env variables di Railway & Vercel dashboard
- ✅ **LAKUKAN** enable SSL/TLS di Neon
- ✅ **LAKUKAN** validate input di backend
- ✅ **LAKUKAN** implement authentication (future)

---

## 📚 QUICK START COMMANDS

```bash
# Local Development
cd Backend && npm start

# Deploy Backend
railway up

# Deploy Frontend
cd Website && vercel

# Test API
curl http://localhost:3000/api/products

# Check Backend
curl http://localhost:3000/api/health
```

---

## 🎉 DONE!

Website sudah siap:
- ✅ Database terpusat Neon Postgres
- ✅ Backend di Railway
- ✅ Frontend di Vercel
- ✅ Real-time updates (polling)
- ✅ Semua perubahan berlaku ke semua user

Akses di: `https://your-domain.vercel.app`

---

**Questions? Check logs di Railway & Vercel dashboard!** 🚀
# axxionstore
