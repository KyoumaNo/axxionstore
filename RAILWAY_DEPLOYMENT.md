# 🚀 RAILWAY DEPLOYMENT GUIDE

Panduan lengkap untuk deploy AXXION STORE Backend ke Railway.

---

## Step 1: Create Railway Account

1. Buka https://railway.app
2. Click "Login" / "Sign Up"
3. Pilih "Sign up with GitHub" (most convenient)
4. Authorize Railway untuk akses GitHub
5. Create organization (atau skip)

---

## Step 2: Prepare Backend for Railway

### 2A. Verify package.json

Pastikan `Backend/package.json` punya:

```json
{
  "name": "axxion-store-backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2"
  }
}
```

Railway akan auto-detect npm scripts.

### 2B. Verify .env.example

Pastikan file ada `Backend/.env.example`:

```
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database_name
NODE_ENV=production
```

### 2C. Verify .gitignore

File `Backend/.gitignore` harus ada:

```
node_modules/
.env
.env.local
*.log
```

---

## Step 3: Push ke GitHub

```bash
# Di root folder
git init
git add .
git commit -m "Initial commit - AXXION STORE"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/axxion-store.git
git push -u origin main
```

---

## Step 4: Create Railway Project

### 4A. New Project di Railway Dashboard

1. Buka https://railway.app
2. Click "New Project"
3. Pilih "Deploy from GitHub"
4. Click "Configure GitHub App"
5. Install Railway app di repository
6. Select repository: `axxion-store`
7. Click "Deploy"

### 4B. Select Branch & Service

- Branch: `main`
- Service: Biarkan kosong (Railway auto-detect)
- Click "Deploy"

### 4C. Wait for Build

Railway akan:
1. Clone repository
2. Detect Node.js project
3. Install dependencies (`npm install`)
4. Run `npm start`
5. Assign domain

Tunggu 3-5 menit sampai status "Running".

---

## Step 5: Configure Environment Variables

### 5A. Add Variables di Railway

1. Di Railway dashboard, click project
2. Tab "Variables"
3. Click "Add Variable"
4. Tambahkan:

   ```
   NAME: DATABASE_URL
   VALUE: postgresql://neondb_owner:xxxxx@ep-xxx.region.neon.tech/neondb?sslmode=require
   ```

   ```
   NAME: PORT
   VALUE: 3000
   ```

   ```
   NAME: NODE_ENV
   VALUE: production
   ```

5. Click "Add" untuk setiap variable

### 5B. Railway Auto-Update

Setelah add variables, Railway akan auto-restart service dengan env baru.

---

## Step 6: Get Production URL

1. Di Railway dashboard, buka project
2. Tab "Settings"
3. Cari "Domains"
4. Copy domain yang auto-generated:
   ```
   https://axxion-store-production-xxxx.railway.app
   ```
5. **SIMPAN URL INI** - akan dipakai di frontend

---

## Step 7: Test Production Deployment

```bash
# Test health endpoint
curl https://axxion-store-production-xxxx.railway.app/api/health
# Response: {"status":"OK","message":"Server is running"}

# Test get products
curl https://axxion-store-production-xxxx.railway.app/api/products
# Response: {"success":true,"data":[],"count":0}
```

---

## Step 8: Enable Auto-Deployment

Railway sudah auto-setup GitHub integration:

- Setiap push ke `main` branch → Auto-redeploy
- Status di Railway dashboard
- Check logs untuk debugging

---

## 🔍 Monitoring & Debugging

### Check Logs

1. Railway dashboard > Project
2. Tab "Logs"
3. Real-time logs dari server

Common log messages:
```
✅ Server running on port 3000
✅ Database initialized successfully
❌ Error: ECONNREFUSED (database not connected)
```

### View Metrics

1. Tab "Metrics"
2. Monitor CPU, Memory, Network
3. Check uptime

### Redeploy

1. Tab "Deployments"
2. Click "Redeploy" untuk force rebuild

---

## 🚨 Troubleshooting

### Build Failed
```
Error: npm ERR! code ERESOLVE
```
✅ **Fix**: 
- Update package.json dependencies
- Check Node version
- Rebuild: Railway > Redeploy

### Database Connection Error
```
Error: connect ECONNREFUSED
Error: FATAL: invalid_authorization_specification
```
✅ **Fix**:
- Check DATABASE_URL di Variables
- Verify Neon connection string correct
- Test: `psql [CONNECTION_STRING]`
- Redeploy

### Service Not Running
```
Status: Crashed / Unhealthy
```
✅ **Fix**:
- Check logs untuk error message
- Verify PORT=3000
- Verify server.js exists
- Redeploy

### Timeout / Slow Response
```
504 Gateway Timeout
```
✅ **Fix**:
- Check database performance
- Check Neon logs
- Increase timeout di frontend (optional)

---

## 📊 Production Checklist

- [ ] GitHub repo created
- [ ] Backend pushed to main branch
- [ ] Railway project created
- [ ] DATABASE_URL set correctly
- [ ] PORT=3000 set
- [ ] NODE_ENV=production set
- [ ] Service status = "Running"
- [ ] Logs show no errors
- [ ] Health endpoint responds
- [ ] Products endpoint responds
- [ ] Production URL works

---

## 🔐 Security Notes

- ✅ **DO**: Use environment variables untuk secrets
- ✅ **DO**: Enable Railway "Public URL" protection jika perlu
- ✅ **DO**: Monitor Railway logs untuk suspicious activity
- ✅ **DO**: Use Neon IP whitelist (allow all untuk development)
- ❌ **DON'T**: Commit .env ke GitHub
- ❌ **DON'T**: Share DATABASE_URL di channel publik

---

## 📚 Railway Resources

- Docs: https://docs.railway.app
- CLI: https://docs.railway.app/reference/cli
- Support: https://railway.app/support

---

## ✅ Next Steps

After backend deployed:
1. Copy production URL
2. Update `Website/api.js` dengan URL
3. Deploy frontend ke Vercel
4. Test full integration

---

**RAILWAY DEPLOYMENT COMPLETE! 🎉**

Backend siap untuk production. Update frontend dan deploy!

---

*Last Updated: May 2026*
