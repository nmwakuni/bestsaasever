# SignaturePro Setup Guide

Complete guide to set up and deploy SignaturePro with Better Auth, Neon, and Pesapal.

## 🚀 Quick Start

### 1. Set Up Neon Database (FREE)

1. Go to [Neon.tech](https://neon.tech) and create a free account
2. Create a new project called "signaturepro"
3. Copy your connection string (looks like: `postgresql://user:password@ep-xxx.neon.tech/signaturepro`)
4. Save it - you'll need it in step 3

**Why Neon?**
- FREE tier: 0.5 GB storage, 1 project
- Serverless Postgres (auto-scales)
- No credit card required
- Better performance than Supabase for this use case

---

### 2. Set Up Pesapal Account

1. Go to [Pesapal.com](https://www.pesapal.com)
2. Sign up for a merchant account
3. Complete KYC verification (takes 1-2 days)
4. Get your API credentials:
   - Consumer Key
   - Consumer Secret
5. Note: Start with **Sandbox** environment for testing

**Pesapal Pricing:**
- M-Pesa: 1.5% - 3% per transaction
- Card payments: 3.5% - 4% per transaction
- No monthly fees
- Supports: M-Pesa, Airtel Money, Visa, Mastercard

---

### 3. Set Up UploadThing (Image Uploads)

1. Go to [UploadThing.com](https://uploadthing.com)
2. Sign in with GitHub
3. Create a new app
4. Copy your:
   - App ID
   - Secret Key

**UploadThing Free Tier:**
- 2 GB storage
- 100 GB bandwidth
- Perfect for logos and profile photos

---

### 4. Configure Environment Variables

Create a `.env.local` file in the `signature-generator/` directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database (Neon)
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/signaturepro?sslmode=require

# Better Auth
BETTER_AUTH_SECRET=generate-a-super-secret-key-here-use-openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:3000

# Pesapal (use sandbox for testing)
PESAPAL_CONSUMER_KEY=your-consumer-key
PESAPAL_CONSUMER_SECRET=your-consumer-secret
PESAPAL_BASE_URL=https://cybqa.pesapal.com/pesapalv3

# UploadThing
UPLOADTHING_SECRET=your-secret
UPLOADTHING_APP_ID=your-app-id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### 5. Initialize Database

Run migrations to create all tables:

```bash
cd signature-generator

# Install dependencies (if not already done)
npm install

# Generate migration files
npx drizzle-kit generate

# Push schema to Neon database
npx drizzle-kit push
```

This creates:
- `users` table
- `sessions` table
- `accounts` table (for OAuth)
- `signatures` table
- `subscriptions` table
- `transactions` table
- `click_analytics` table

---

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the landing page!

---

## 📦 Database Schema

### Users
- id, email, name, image, emailVerified
- Managed by Better Auth

### Signatures
- All signature data (name, email, social links, etc.)
- Custom colors, logo, QR code
- Template selection
- Click tracking

### Subscriptions
- User subscription tier (free, pro, business)
- Pesapal transaction IDs
- Start/end dates

### Transactions
- Payment records
- Pesapal order tracking
- Status updates

### Click Analytics
- Track signature link clicks
- IP, location, device info
- For premium analytics dashboard

---

## 💰 Pesapal Integration

### Test Mode (Sandbox)

1. Use sandbox credentials
2. Base URL: `https://cybqa.pesapal.com/pesapalv3`
3. Test with these M-Pesa numbers:
   - **Success**: 0722000000
   - **Failure**: 0722000001

### Production Mode

1. Complete merchant verification
2. Switch to production credentials
3. Base URL: `https://pay.pesapal.com/v3`
4. Update `.env.local`:

```env
PESAPAL_BASE_URL=https://pay.pesapal.com/v3
```

### Register IPN (Instant Payment Notification)

The app automatically registers an IPN URL on first payment.
You can also manually register:

```bash
# In your code or via Pesapal dashboard
IPN URL: https://yourapp.com/api/pesapal/callback
```

---

## 🎨 Features Implemented

### ✅ Authentication
- Email/password login with Better Auth
- Secure sessions
- Protected routes

### ✅ Payments
- Pesapal integration (M-Pesa, Cards, Airtel Money)
- Subscription management
- Transaction tracking
- Automatic subscription activation

### ✅ Signature Builder
- 4 templates (more coming)
- Real-time preview
- Social media links
- Copy to clipboard

### 🚧 Coming Next
- Image uploads (logos, photos)
- Color customization
- 6 more templates
- QR code generation
- Analytics dashboard
- Team management

---

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Pesapal and Better Auth integration"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `signature-generator`
   - **Build Command**: `npm run build`

### 3. Add Environment Variables

In Vercel dashboard, add all variables from `.env.local`:

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://your-app.vercel.app
PESAPAL_CONSUMER_KEY=...
PESAPAL_CONSUMER_SECRET=...
PESAPAL_BASE_URL=https://pay.pesapal.com/v3
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important:** Update URLs to your production domain!

### 4. Deploy

Click "Deploy" and wait 2-3 minutes.

Your app is live! 🎉

---

## 💵 Pricing Strategy

### Free Tier
- 1 signature
- Basic templates
- No analytics

### Pro Tier (KES 999 one-time)
- Unlimited signatures
- All templates
- Custom branding
- Basic analytics

### Business Tier (KES 4,999/month)
- Everything in Pro
- Team management (up to 10 users)
- Advanced analytics
- Priority support
- Custom templates

**Adjust pricing in:** `app/api/pesapal/initiate/route.ts`

---

## 📊 Revenue Model

### Transaction Fees (Pesapal)
- M-Pesa: ~1.5% - 3%
- Cards: ~3.5% - 4%

### Example:
**Pro Plan** @ KES 999:
- Customer pays: KES 999
- Pesapal fee (2%): KES 20
- **Your profit**: KES 979

**Business Plan** @ KES 4,999/month:
- Customer pays: KES 4,999
- Pesapal fee (2%): KES 100
- **Your profit**: KES 4,899/month

### Target: 100 customers in 6 months
- 70 Pro (one-time): KES 68,530
- 30 Business (monthly): KES 146,970/month

**Total potential**: KES 215,500 in 6 months

---

## 🛠 Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database
npx drizzle-kit generate    # Generate migrations
npx drizzle-kit push        # Push schema to database
npx drizzle-kit studio      # View database in browser

# Linting
npm run lint
```

---

## 🐛 Troubleshooting

### Database Connection Error
- Check your `DATABASE_URL` is correct
- Ensure Neon project is active
- Verify SSL mode: `?sslmode=require`

### Pesapal Authentication Failed
- Verify consumer key/secret
- Check you're using correct environment (sandbox vs production)
- Ensure base URL matches environment

### Better Auth Session Issues
- Clear cookies
- Check `BETTER_AUTH_SECRET` is set
- Verify `BETTER_AUTH_URL` matches your domain

### Deployment Fails
- Check all environment variables are set in Vercel
- Verify build succeeds locally: `npm run build`
- Check Vercel logs for specific errors

---

## 📞 Support Resources

- **Better Auth Docs**: https://www.better-auth.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Pesapal API Docs**: https://developer.pesapal.com/
- **Drizzle ORM**: https://orm.drizzle.team/docs
- **Next.js**: https://nextjs.org/docs

---

## 🎯 Next Steps

1. **Test locally** - Create account, make signature
2. **Test payments** - Use Pesapal sandbox
3. **Deploy** - Push to Vercel
4. **Market** - Share on social media
5. **Iterate** - Add features based on user feedback

---

Good luck! You're about to make your first dollar online! 💰🚀
