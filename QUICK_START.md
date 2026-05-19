# 🚀 QUICK START - AXXION STORE

Panduan cepat untuk mulai development AXXION STORE dengan database terpusat.

---

## ⚡ 5 MENIT SETUP (Local Development)

### 1. Setup Neon Database

```bash
# Buka https://neon.tech dan buat project gratis
# Copy connection string: postgresql://...
```

### 2. Setup Backend

```bash
cd Backend
npm install
# Buat file .env dengan isi:
# PORT=3000
# DATABASE_URL=postgresql://...
# NODE_ENV=development

npm start
# Tunggu: ✅ Server running on port 3000
```

### 3. Setup Frontend

```bash
cd Website
python3 -m http.server 5000
# Buka http://localhost:5000
```

**DONE! Frontend akan fetch products dari database.** ✅

---

## 📝 Test API (Wajib!)

```bash
# Terminal baru - Test backend healthy
curl http://localhost:3000/api/health

# Lihat products (kosong di awal)
curl http://localhost:3000/api/products

# Buat product (ganti values)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming",
    "price": 25000000,
    "stock": 5,
    "category": "Electronics"
  }'

# Refresh frontend - produk muncul!
```

---

## 🌐 Deploy (5 Langkah)

### Step 1: Create GitHub Repo
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Step 2: Deploy Backend ke Railway
- Buka https://railway.app
- Login dengan GitHub
- "Create New Project" > "Deploy from GitHub"
- Select Backend folder
- Set DATABASE_URL env variable
- **Get Production URL** (simpan!)

### Step 3: Update Frontend API URL
Edit `Website/api.js`:
```javascript
const API_URL = 'https://your-railway-url.railway.app/api';
```

### Step 4: Deploy Frontend ke Vercel
- Buka https://vercel.com
- "Import Project" > Select Website folder
- Deploy selesai!

### Step 5: Test Production
- Buka https://your-vercel-url.vercel.app
- Cek products muncul dari database ✅

---

## 🔄 Real-time Workflow

**User 1 + Admin melihat perubahan yang sama:**

```
Admin: Update price/stock di panel
    ↓
Submit ke API
    ↓
Update Database Neon
    ↓
Semua user auto-refresh (polling 5s)
    ↓
User 1 & User 2 lihat perubahan yang sama! ✅
```

---

## 📚 File Structure

```
WebsiteAxxion/
├── Backend/
│   ├── server.js          (Main server)
│   ├── package.json       (Dependencies)
│   ├── .env               (Local env vars)
│   ├── .env.example       (Template)
│   ├── .gitignore         (Exclude from git)
│   ├── db/
│   │   ├── connection.js  (Postgres pool)
│   │   └── init.js        (Create tables)
│   ├── routes/
│   │   └── products.js    (API endpoints)
│   └── middleware/
│       └── errorHandler.js
│
├── Website/
│   ├── index.html         (Main UI)
│   ├── api.js             (API service)
│   ├── config.js          (Config)
│   ├── vercel.json        (Vercel config)
│   └── .gitignore
│
├── README.md              (Full documentation)
├── SETUP.md               (Detailed setup)
├── INTEGRATION.md         (Frontend integration guide)
└── QUICK_START.md         (This file)
```

---

## 🎯 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Ambil semua products |
| GET | `/api/products/:id` | Ambil 1 product |
| POST | `/api/products` | Buat product baru |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Hapus product |
| GET | `/api/health` | Check server status |

---

## 🐛 Common Issues

### ❌ "Cannot connect to database"
```bash
# Check .env file punya DATABASE_URL yang benar
# Test connection: psql "postgresql://..."
```

### ❌ "CORS error"
```bash
# Backend include CORS - pastikan API_URL di api.js benar
```

### ❌ "Frontend tidak load products"
```bash
# Check browser console
# Backend harus running: npm start
# API_URL harus benar di api.js
```

---

## 📊 Monitoring

- **Railway Logs**: https://railway.app > Logs
- **Neon Dashboard**: https://neon.tech > Project
- **Vercel Deployments**: https://vercel.com > Deployments

---

## 📞 Documentation Links

- Full Setup: [SETUP.md](./SETUP.md)
- Integration Guide: [INTEGRATION.md](./INTEGRATION.md)
- Main README: [README.md](./README.md)

---

## ✅ Checklist Sebelum Production

- [ ] Backend running lokal dengan database connect
- [ ] Frontend loading products dari API
- [ ] Test create/update/delete products
- [ ] Backend deployed ke Railway
- [ ] Frontend deployed ke Vercel  
- [ ] API_URL di frontend pointing ke Railway
- [ ] Cek Railway logs - no errors
- [ ] Cek Vercel deployment - "Ready" status
- [ ] Test production URL - working

---

**ALL SET! AXXION STORE READY TO GO! 🎉**

Pertanyaan? Check docs di atas atau lihat logs di Railway/Vercel dashboard.

---

*Last Updated: May 2026*
