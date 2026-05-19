# 📑 AXXION STORE - Project Index

Complete directory structure and documentation guide untuk AXXION STORE.

---

## 🗂️ Project Structure

```
WebsiteAxxion/
│
├── 📁 Backend/                    (Railway Deployment)
│   ├── server.js                  ✅ Express app entry point
│   ├── package.json               ✅ Node dependencies
│   ├── .env.example               ✅ Environment template
│   ├── .gitignore                 ✅ Git exclude rules
│   │
│   ├── 📁 db/
│   │   ├── connection.js          ✅ PostgreSQL connection pool
│   │   └── init.js                ✅ Database initialization & schema
│   │
│   ├── 📁 routes/
│   │   └── products.js            ✅ CRUD API endpoints
│   │       ├── GET /api/products
│   │       ├── GET /api/products/:id
│   │       ├── POST /api/products
│   │       ├── PUT /api/products/:id
│   │       └── DELETE /api/products/:id
│   │
│   └── 📁 middleware/
│       └── errorHandler.js        ✅ Global error handling
│
├── 📁 Website/                    (Vercel Deployment)
│   ├── index.html                 ✅ Main UI (futuristic design)
│   ├── api.js                     ✅ API service layer
│   ├── config.js                  ✅ Configuration manager
│   ├── vercel.json                ✅ Vercel deployment config
│   └── .gitignore                 ✅ Git exclude rules
│
├── 📄 README.md                   ✅ Main documentation
├── 📄 QUICK_START.md              ✅ 5-minute setup guide
├── 📄 SETUP.md                    ✅ Detailed step-by-step setup
├── 📄 INTEGRATION.md              ✅ Frontend-Backend integration code
├── 📄 RAILWAY_DEPLOYMENT.md       ✅ Railway deployment guide
└── 📄 INDEX.md                    ✅ This file - project overview
```

---

## 📚 Documentation Guide

### 🚀 **Getting Started**
Start with these in order:

1. **[QUICK_START.md](./QUICK_START.md)** 
   - 5-minute local setup
   - Quick API testing
   - For impatient developers

2. **[SETUP.md](./SETUP.md)** (Recommended)
   - Complete step-by-step guide
   - Neon database setup
   - Local development
   - Production deployment

### 🔌 **Integration & Code**

3. **[INTEGRATION.md](./INTEGRATION.md)**
   - JavaScript code examples
   - Frontend-Backend integration
   - Real-time updates implementation
   - Admin product management

4. **[README.md](./README.md)**
   - Full API documentation
   - Architecture overview
   - Troubleshooting guide
   - Monitoring checklist

### 🚀 **Deployment**

5. **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)**
   - Deploy backend to Railway
   - Environment variables setup
   - Debugging & monitoring
   - Production checklist

---

## 🎯 Quick Navigation

### Backend Files

| File | Purpose |
|------|---------|
| `Backend/server.js` | Express.js main server |
| `Backend/package.json` | Dependencies & scripts |
| `Backend/db/connection.js` | PostgreSQL pool setup |
| `Backend/db/init.js` | Database schema initialization |
| `Backend/routes/products.js` | Product API endpoints |
| `Backend/middleware/errorHandler.js` | Error handling middleware |

### Frontend Files

| File | Purpose |
|------|---------|
| `Website/index.html` | Main UI (HTML) |
| `Website/api.js` | API service layer |
| `Website/config.js` | Environment configuration |
| `Website/vercel.json` | Vercel deployment settings |

### Configuration Files

| File | Purpose |
|------|---------|
| `Backend/.env.example` | Backend env template |
| `Backend/.gitignore` | Backend git excludes |
| `Website/.gitignore` | Frontend git excludes |
| `Website/vercel.json` | Vercel build config |

---

## 🔄 Architecture Overview

```
┌─────────────────────────────────────┐
│   FRONTEND - Vercel                 │
│   - Static HTML/JS/CSS              │
│   - Auto-refresh every 5 seconds    │
│   - Polling via REST API            │
└──────────────┬──────────────────────┘
               │
               │ HTTPS REST API
               │ (Firebase/Railway)
               ▼
┌─────────────────────────────────────┐
│   BACKEND - Railway                 │
│   - Node.js + Express.js            │
│   - Business logic                  │
│   - Database queries                │
│   - Error handling                  │
└──────────────┬──────────────────────┘
               │
               │ Connection Pool
               │
               ▼
┌─────────────────────────────────────┐
│   DATABASE - Neon PostgreSQL        │
│   - Shared data for all users       │
│   - Real-time updates               │
│   - Automatic backups               │
└─────────────────────────────────────┘
```

### Data Flow

1. **User visits frontend** (Vercel)
2. **Frontend polls API** every 5 seconds
3. **API fetches from database** (Neon)
4. **Frontend displays products** to user
5. **Admin updates product** (price/stock)
6. **Update saved to database**
7. **All users see update** on next poll

---

## 📋 Key Features

✅ **Shared Database**
- All users see same data
- Real-time product updates
- Synchronized across devices

✅ **Admin Panel**
- Add new products
- Edit price/stock
- Delete products
- View analytics

✅ **Real-time Updates**
- Polling mechanism (5-second refresh)
- Automatic UI updates
- No manual refresh needed

✅ **Public Store**
- Browse products
- Add to cart
- View categories
- Responsive design

✅ **Production Ready**
- Railway backend
- Vercel frontend
- Neon database
- SSL/TLS security

---

## 🚀 Deployment Stack

| Component | Service | URL Pattern |
|-----------|---------|-------------|
| Frontend | Vercel | `https://your-domain.vercel.app` |
| Backend | Railway | `https://your-app.railway.app` |
| Database | Neon | PostgreSQL connection string |

---

## 📦 Dependencies

### Backend (Node.js)
```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "body-parser": "^1.20.2"
}
```

### Frontend
- No build required
- Pure HTML/JavaScript/CSS
- Fetch API (native browser)

---

## 🔑 API Endpoints

All endpoints are prefixed with `/api`

### Products

```
GET    /api/products              Get all products
GET    /api/products/:id          Get single product
POST   /api/products              Create new product
PUT    /api/products/:id          Update product
DELETE /api/products/:id          Delete product
```

### Health

```
GET    /api/health                Check server status
```

Response format:
```json
{
  "success": true,
  "data": [...],
  "count": 5,
  "message": "Operation successful"
}
```

---

## 💾 Database Schema

### products table

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
NODE_ENV=production
```

### Frontend `api.js`

```javascript
const API_URL = 'https://backend-url.railway.app/api';
```

---

## 📊 Development Workflow

### Local Development

```bash
# Terminal 1 - Backend
cd Backend
npm start

# Terminal 2 - Frontend
cd Website
python3 -m http.server 5000
```

### Production Workflow

1. **Develop locally** with npm start
2. **Test API** with curl
3. **Push to GitHub** with git
4. **Railway auto-deploys** backend
5. **Update frontend API URL**
6. **Vercel auto-deploys** frontend
7. **Monitor** in dashboards

---

## ✅ Setup Checklist

- [ ] GitHub account created
- [ ] Neon database project created
- [ ] Backend `.env` configured locally
- [ ] Backend running on `localhost:3000`
- [ ] Frontend running on `localhost:5000`
- [ ] API endpoints tested with curl
- [ ] Backend deployed to Railway
- [ ] Railway DATABASE_URL set correctly
- [ ] Frontend API URL updated
- [ ] Frontend deployed to Vercel
- [ ] Production endpoints tested
- [ ] Real-time updates working

---

## 🐛 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Database connection error | Check [SETUP.md](./SETUP.md#troubleshooting) |
| CORS error | Verify API URL in [api.js](./Website/api.js) |
| Railway deployment failed | See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md#troubleshooting) |
| Frontend not loading products | Check browser console & backend logs |
| Slow performance | Check Neon database metrics |

---

## 📞 Support Resources

- **Express.js**: https://expressjs.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Railway Docs**: https://docs.railway.app/
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs

---

## 🎓 Learning Path

1. Read **QUICK_START.md** (5 min)
2. Read **SETUP.md** (20 min)
3. Read **INTEGRATION.md** (15 min)
4. Try local development (30 min)
5. Deploy to Railway (15 min)
6. Deploy to Vercel (10 min)
7. Test production (10 min)

**Total: ~2 hours to production** ⏱️

---

## 📝 File Descriptions

### Backend

**server.js**
- Entry point for Express app
- Middleware setup (CORS, body-parser)
- Database initialization
- Route mounting
- Server startup

**db/connection.js**
- PostgreSQL connection pool
- SSL support for production
- Error handling
- Connection management

**db/init.js**
- Create tables if not exist
- Database schema definition
- Initial data setup

**routes/products.js**
- CRUD endpoints
- Input validation
- Error handling
- Response formatting

**middleware/errorHandler.js**
- Global error handler
- Error logging
- Consistent error responses

### Frontend

**index.html**
- Main UI page
- Responsive design
- Futuristic styling
- Product grid display
- Admin panel

**api.js**
- API service layer
- Fetch wrapper
- Error handling
- Toast notifications

**config.js**
- Environment configuration
- API URL management
- Settings constants

**vercel.json**
- Build configuration
- Routing rules
- Headers setup
- Cache management

---

## 🎯 Next Steps

1. **Start Here**: [QUICK_START.md](./QUICK_START.md)
2. **Then Read**: [SETUP.md](./SETUP.md)
3. **Integrate Code**: [INTEGRATION.md](./INTEGRATION.md)
4. **Deploy Backend**: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)
5. **Go Live**: [README.md](./README.md)

---

**EVERYTHING IS READY TO GO! 🚀**

Start with QUICK_START.md or SETUP.md.

---

*Generated: May 2026*
*Version: 1.0.0*
*Status: Production Ready ✅*
