# 🚀 Developer-OS Deployment Checklist

## Quick Summary
- **AI**: DevAI (free, no API keys needed) ✅
- **Auth**: Google + GitHub OAuth + Demo login ✅
- **Database**: Supabase (free tier) ✅
- **Hosting**: Vercel (free tier) ✅

---

## Step 1: Set Up Database (Supabase)

1. Go to [supabase.com](https://supabase.com) → Sign up / Log in
2. Click **"New Project"**
   - **Project name**: `developer-os`
   - **Database password**: Choose a strong password (save it!)
   - **Region**: Closest to your users
3. Wait for project to be created (~2 minutes)
4. Go to **Settings → Database** → Copy the **Connection string (URI)**
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

---

## Step 2: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Go to **APIs & Services → Credentials**
4. Click **"+ Create Credentials" → "OAuth client ID"**
5. If prompted, configure OAuth consent screen first:
   - User type: **External**
   - App name: `Developer OS`
   - Add your email as developer contact
   - Save
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `Developer OS`
   - **Authorized redirect URIs** → Add:
     - `https://YOUR-APP.vercel.app/api/auth/callback/google`
   - Click **Create**
7. Copy the **Client ID** and **Client Secret**

---

## Step 3: Set Up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `Developer OS`
   - **Homepage URL**: `https://YOUR-APP.vercel.app`
   - **Authorization callback URL**: `https://YOUR-APP.vercel.app/api/auth/callback/github`
4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** → Copy the **Client Secret**

---

## Step 4: Deploy to Vercel

1. Push your code to GitHub (if not already):
   ```bash
   cd Developer-OS
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/Developer-OS.git
   git push -u origin main
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Click **"Import Git Repository"**
4. Select your `Developer-OS` repository
5. **⚠️ IMPORTANT Configuration**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `developer-os` ← **MUST SET THIS!**
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`

6. **Add Environment Variables** (click to expand and add each):

   | Variable | Value | Notes |
   |----------|-------|-------|
   | `DATABASE_URL` | Your Supabase connection string | From Step 1 |
   | `AUTH_SECRET` | Generate with: `openssl rand -base64 32` | Any random 32+ char string works |
   | `NEXTAUTH_URL` | `https://YOUR-APP.vercel.app` | Your Vercel URL (no trailing slash) |
   | `AUTH_GOOGLE_ID` | Google Client ID | From Step 2 |
   | `AUTH_GOOGLE_SECRET` | Google Client Secret | From Step 2 |
   | `AUTH_GITHUB_ID` | GitHub Client ID | From Step 3 |
   | `AUTH_GITHUB_SECRET` | GitHub Client Secret | From Step 3 |

7. Click **"Deploy"**

---

## Step 5: Run Database Migrations

After first deploy, you need to set up the database schema:

### Option A: Via Vercel CLI (recommended)
```bash
cd developer-os
npx vercel env pull .env.local
npx prisma migrate deploy
```

### Option B: Via Supabase SQL Editor
1. Go to Supabase Dashboard → SQL Editor
2. Run: `npx prisma db push` locally with the Vercel env vars

---

## Step 6: Update OAuth Redirect URIs

After deployment, your app will be at `https://YOUR-APP.vercel.app`. Update:

1. **Google Cloud Console** → OAuth client → Add redirect URI:
   - `https://YOUR-APP.vercel.app/api/auth/callback/google`

2. **GitHub** → OAuth App → Update callback URL:
   - `https://YOUR-APP.vercel.app/api/auth/callback/github`

3. **Vercel** → Environment Variables → Update `NEXTAUTH_URL`:
   - `https://YOUR-APP.vercel.app`

4. Redeploy the app

---

## 🔒 Security Notes

- **API Keys**: Your API keys (if any) are stored as Vercel environment variables and are NEVER exposed to the client. They're only used server-side.
- **Auth**: Users log in with their own Google/GitHub accounts. Their data is isolated per user.
- **Demo Mode**: The demo login creates a temporary session. No real data persists without a database.
- **Database**: Supabase Row Level Security (RLS) is recommended for production.

---

## 🧪 Test Checklist

After deployment, verify:

- [ ] Landing page loads at `https://YOUR-APP.vercel.app`
- [ ] Click "Sign in with Google" → redirects to Google → redirects back to dashboard
- [ ] Click "Sign in with GitHub" → redirects to GitHub → redirects back to dashboard
- [ ] Demo login works (any email/password)
- [ ] Dashboard loads with all widgets
- [ ] AI Chat works (type a message, get a response)
- [ ] Settings page shows correct login provider
- [ ] Logout works and redirects to login page

---

## 🐛 Troubleshooting

### "Configuration" error on login
- Check that `AUTH_SECRET` is set in Vercel
- Check that `NEXTAUTH_URL` matches your deployed URL exactly

### Database connection error
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure you ran `prisma migrate deploy`

### Build fails
- Make sure **Root Directory** is set to `developer-os` in Vercel
- Check build logs for specific errors

### 404 on page refresh
- This shouldn't happen with Next.js App Router
- If it does, check `next.config.ts` doesn't have `output: 'export'`

---

## 📊 What Works After Deployment

| Feature | Status | Notes |
|---------|--------|-------|
| Next.js App Router | ✅ | Full SSR support |
| Authentication | ✅ | Google + GitHub + Demo |
| AI Chat (DevAI) | ✅ | Free, no API keys |
| Dashboard | ✅ | All widgets functional |
| DSA Tracker | ✅ | Client-side state |
| Learning Hub | ✅ | Notes + voting |
| Weekly Schedule | ✅ | Client-side state |
| Theme Toggle | ✅ | Dark/Light/System |
| Responsive Design | ✅ | Mobile-friendly |

---

**Need help?** Check the [Vercel Docs](https://vercel.com/docs) or [NextAuth.js Docs](https://next-auth.js.org)
