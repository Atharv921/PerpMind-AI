# 🚀 Deployment Checklist — PrepMind AI

## ✅ Code Quality
- [x] No TypeScript compilation errors
- [x] No ESLint errors
- [x] All imports resolved correctly
- [x] Navbar async/await fixed
- [x] SearchParams null-checks added
- [x] Environment variables properly configured

## 📋 Environment Variables Required
**Add ALL of these in Vercel before deploying:**

```
CLAUDE_API_KEY=your_anthropic_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RAZORPAY_KEY_ID=your_razorpay_live_key_id
RAZORPAY_KEY_SECRET=your_razorpay_live_secret
PAYMENT_PROVIDER=razorpay
NEXT_PUBLIC_APP_URL=https://prepmind-*.vercel.app
```

⚠️ **Missing any of these will cause runtime errors!**

## 🗄️ Database Requirements
Before deploying, ensure Supabase has:
- `users` table with auth integration
- `tests` table for storing test records
- `test_results` table for results
- `usage` table for daily usage tracking
- `subscriptions` table for pro subscriptions
- `payments` table for payment records

Run: `supabase-schema.sql` in Supabase

## 🔧 API Routes to Test
- ✅ `POST /api/generate-questions` — Generate MCQs from notes
- ✅ `POST /api/analyze-results` — Analyze test performance
- ✅ `POST /api/create-order` — Create Razorpay order
- ✅ `POST /api/verify-payment` — Verify payment
- ✅ `POST /api/webhook` — Razorpay webhook

## 🔐 Authentication Setup
1. **Supabase Auth:**
   - Go to **Authentication → URL Configuration**
   - Set **Site URL**: `https://your-vercel-domain.vercel.app`
   - Add **Redirect URLs**: `https://your-vercel-domain.vercel.app/**`

2. **Middleware Protection:**
   - Routes `/dashboard`, `/upload`, `/test`, `/result` are protected
   - Unauthenticated users redirect to `/login`
   - Authenticated users on `/login` redirect to `/dashboard`

## 💳 Razorpay Setup
1. Enable webhooks in Razorpay Dashboard
2. Set webhook URL: `https://your-domain.vercel.app/api/webhook`
3. Enable events: `payment.authorized`, `payment.failed`
4. Use LIVE keys (not test keys)

## 🎯 Common Deployment Issues

### Issue: "Missing Supabase URL"
**Solution:** Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` in Vercel

### Issue: "CLAUDE_API_KEY not found"
**Solution:** Add `CLAUDE_API_KEY` from console.anthropic.com in Vercel

### Issue: Auth not working after deploy
**Solution:** Update Supabase URL Configuration with your Vercel domain

### Issue: Payment creation fails with 401
**Solution:** Add `SUPABASE_SERVICE_ROLE_KEY` and `RAZORPAY_KEY_ID` in Vercel

### Issue: "Cannot POST /api/webhook"
**Solution:** Webhook URL in Razorpay must be `https://your-domain.vercel.app/api/webhook`

## 📦 Built Files
- `.next/` folder is generated during build
- `.env.local` is NOT deployed (use Vercel env vars instead)
- `node_modules/` is NOT deployed (npm install runs on Vercel)

## ✨ Before You Click Deploy

1. **Push all changes to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy: ready for production"
   git push
   ```

2. **Test build locally:**
   ```bash
   npm run build
   ```

3. **Check no console errors:**
   - No 404s on page load
   - No TypeScript errors
   - Auth working

4. **Vercel import settings:**
   - Framework: Next.js (auto-detected)
   - Root: `./`
   - Output: `.next`

5. **Set env vars BEFORE clicking Deploy**

## 🚀 Post-Deployment
1. Update `NEXT_PUBLIC_APP_URL` with actual Vercel domain
2. Redeploy after env var update
3. Update Supabase URL Configuration
4. Test login/signup flow
5. Test payment creation
6. Check Razorpay webhook logs

---
**Ready?** Go to [vercel.com/new](https://vercel.com/new) and start deploying! 🎉
