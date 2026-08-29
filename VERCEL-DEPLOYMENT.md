# 🚀 Vercel Deployment Guide for Developer-OS

This guide will help you deploy Developer-OS to Vercel.

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Account** - Your code should be on GitHub
3. **Supabase Account** - For PostgreSQL database (https://supabase.com)

---

## 🎯 Step-by-Step Deployment

### Step 1: Create Supabase Database

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Click **"+ New project"**
4. Fill in:
   - **Project name**: `developer-os`
   - **Database password**: (save this!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Once created, go to **Settings → Database**
7. Copy the **Connection string** (URI format)

---

### Step 2: Import to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select **`kenkaneki-ufx/Developer-OS`**
4. **Important Configuration**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `developer-os` ← **MUST SET THIS!**
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

---

### Step 3: Configure Environment Variables

Add these environment variables in Vercel:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | Your Supabase connection string | From Step 1 |
| `AUTH_SECRET` | Generate with: `openssl rand -base64 32` | Or use any random string |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Your Vercel URL |
| `AUTH_GITHUB_ID` | (Optional) GitHub OAuth ID | For GitHub login |
| `AUTH_GITHUB_SECRET` | (Optional) GitHub OAuth Secret | For GitHub login |

**Example DATABASE_URL:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

---

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your app is now live! 🎉

---

## 🔧 Post-Deployment Setup

### Run Database Migrations

After first deploy, you need to set up the database schema:

1. Go to Vercel Dashboard → Your Project → **Settings → General**
2. Scroll to **"Build & Development Settings"**
3. Add to **"Ignored Build Step"**: `exit 0`

Then run migrations locally:
```bash
cd developer-os
npx prisma migrate deploy
```

Or use Vercel CLI:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

---

## 📝 Important Notes

### Root Directory is Critical!

```
GitHub Repo: Developer-OS/
├── developer-os/      ← THIS IS YOUR ROOT DIRECTORY IN VERCEL!
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── ...
├── README.md
└── ...
```

**In Vercel, set Root Directory to: `developer-os`**

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ Yes | NextAuth secret key |
| `NEXTAUTH_URL` | ✅ Yes | Your deployed URL |
| `AUTH_GITHUB_ID` | ❌ Optional | GitHub OAuth |
| `AUTH_GITHUB_SECRET` | ❌ Optional | GitHub OAuth |

---

## 🐛 Troubleshooting

### Build Fails?

1. Check if **Root Directory** is set to `developer-os`
2. Check build logs in Vercel Dashboard
3. Ensure all environment variables are set

### Database Connection Error?

1. Verify `DATABASE_URL` is correct
2. Check if Supabase project is running
3. Ensure IP whitelist includes Vercel (Supabase allows all by default)

### 404 on Refresh?

This shouldn't happen with Next.js App Router, but if it does:
1. Check `next.config.ts` has no `output: 'export'`
2. Ensure you're not using static export

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Prisma Docs**: https://pris.ly/d/prisma-docs

---

## 📊 After Deployment

Your app will be available at:
```
https://developer-os-[your-username].vercel.app/
```

Features that will work:
- ✅ Next.js App Router
- ✅ Server-side rendering
- ✅ API routes
- ✅ Authentication (if configured)
- ✅ Database (Supabase PostgreSQL)
- ✅ Prisma ORM

---

**Need help?** Check the [Vercel Documentation](https://vercel.com/docs) or [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
