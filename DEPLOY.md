# 🚀 PrepMind AI — Vercel Deployment Guide

Complete deployment in under 10 minutes.

---

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Vercel account (free at vercel.com)
- Supabase project set up (schema + payment-migration run)
- Razorpay account (live keys)
- Anthropic API key

---

## Step 1 — Push to GitHub

Open your terminal in the `prepmind` project folder:

```bash
# Initialize git (skip if already done)
git init
git add .
git commit -m "Initial commit — PrepMind AI"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/prepmind-ai.git
git push -u origin main
```

---

## Step 2 — Import to Vercel

1. Go to **vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your `prepmind-ai` repo
4. Framework: **Next.js** (auto-detected)
5. Root directory: leave as **`./`** (do NOT change this)
6. **Do NOT click Deploy yet** — add env vars first (Step 3)

---

## Step 3 — Add Environment Variables

In the Vercel import screen, click **"Environment Variables"** and add all 8:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `CLAUDE_API_KEY` | `sk-ant-api03-...` | From console.anthropic.com |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase service_role key |
| `PAYMENT_PROVIDER` | `razorpay` | Literal string |
| `RAZORPAY_KEY_ID` | `rzp_live_...` | Razorpay Dashboard → API Keys |
| `RAZORPAY_KEY_SECRET` | `...` | Razorpay Dashboard → API Keys |
| `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` | Your Vercel domain (update after first deploy) |

> ⚠️ Add ALL variables before clicking Deploy. Missing variables will cause runtime errors.

---

## Step 4 — Deploy

Click **"Deploy"**. Vercel will:
1. Install dependencies (`npm install`)
2. Build the Next.js app (`next build`)
3. Deploy to a `.vercel.app` domain (~2 minutes)

---

## Step 5 — Post-Deploy Configuration

### 5a. Update NEXT_PUBLIC_APP_URL

After the first deploy you'll have a real URL like `https://prepmind-ai.vercel.app`.

1. Vercel → Your project → **Settings → Environment Variables**
2. Edit `NEXT_PUBLIC_APP_URL` → set to your actual domain
3. Click **Redeploy** (Deployments tab → three dots → Redeploy)

### 5b. Update Supabase Auth URLs

1. Supabase → Authentication → **URL Configuration**
2. Set **Site URL** to `https://prepmind-ai.vercel.app`
3. Add to **Redirect URLs**: `https://prepmind-ai.vercel.app/**`

### 5c. Set Up Razorpay Webhook (optional but recommended)

1. Razorpay Dashboard → **Webhooks → Add New Webhook**
2. Webhook URL: `https://prepmind-ai.vercel.app/api/webhook`
3. Events: `payment.authorized`, `payment.failed`

---

## Verify Deployment Works

Test this flow after deploying:

```
1. Visit https://prepmind-ai.vercel.app
2. Sign up with a new email
3. Confirm email (check inbox)
4. Log in → go to Dashboard
5. Upload notes → Generate Test
6. Take test → Submit → see results
7. Click Upgrade → Razorpay modal opens
8. Pay with test card 4111 1111 1111 1111
9. Dashboard shows "Pro Unlocked" ✓
```

---

## Custom Domain (Optional)

1. Vercel → Your project → **Settings → Domains**
2. Add your domain (e.g., `prepmind.ai`)
3. Follow the DNS instructions shown
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain
5. Update Supabase Auth URLs to your custom domain
6. Redeploy

---

## Re-deploying After Code Changes

```bash
git add .
git commit -m "your change description"
git push
```

Vercel auto-deploys on every push to `main`. No extra steps needed.

---

## Troubleshooting

**Build fails with "Module not found: @frontend-or-backend/..."**
→ Check `next.config.js` has the webpack alias block. Redeploy.

**"supabaseAdmin is not defined" / Auth errors**
→ `SUPABASE_SERVICE_ROLE_KEY` is missing or wrong. Check Vercel env vars.

**Razorpay modal doesn't open**
→ `RAZORPAY_KEY_ID` is missing `NEXT_PUBLIC_` prefix — it's fine, it's sent from the server-side order API. Check `RAZORPAY_KEY_ID` is set correctly.

**"Daily limit reached" immediately after signup**
→ `payment-migration.sql` wasn't run in Supabase. Run it now in the SQL Editor.

**Blank page / 500 error**
→ Check Vercel → Deployments → your deploy → **Function Logs** for the exact error.
