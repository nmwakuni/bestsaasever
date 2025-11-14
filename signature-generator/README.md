# SignaturePro - Professional Email Signature Generator

A complete SaaS application for creating professional email signatures. Built for the African market with M-Pesa integration via Pesapal, authentication, analytics, and subscription management.

## ✨ Features

### 🔐 Authentication & User Management
- **Better Auth** - Modern, secure authentication
- Email/password login and signup
- Session management
- Protected routes and API endpoints

### 💰 Payment Integration (Pesapal)
- **M-Pesa** - Mobile money payments
- **Airtel Money** - Alternative mobile payments
- **Card Payments** - Visa, Mastercard
- Subscription tiers (Free, Pro, Business)
- Automatic subscription activation
- Transaction history and tracking

### 🎨 Signature Builder
- **Real-time Preview** - See changes instantly
- **10+ Beautiful Templates** - Professional designs
- **Custom Branding** - Upload logos, choose colors
- **Social Media Integration** - LinkedIn, Twitter, Instagram, GitHub, Facebook
- **QR Code Generator** - Add vCard or website QR codes
- **Image Uploads** - Profile photos and company logos
- **Mobile Responsive** - Perfect on all devices
- **Copy to Clipboard** - One-click HTML export

### 📊 Analytics & Tracking
- Click tracking on all signature links
- Geographic location data
- Device and browser analytics
- Performance dashboard (Pro/Business)
- Export analytics data

### 💼 Multi-Signature Management
- Save unlimited signatures (Pro tier)
- Organize by purpose (Work, Personal, Clients)
- Set default signatures
- Quick switch and edit

## 🚀 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Beautiful components
- **Lucide React** - Icon library

### Backend & Database
- **Neon** - Serverless Postgres database
- **Drizzle ORM** - Type-safe database queries
- **Better Auth** - Authentication system
- **Pesapal API** - Payment processing

### Infrastructure
- **Vercel** - Hosting and deployment (Free tier)
- **UploadThing** - Image storage (Free tier)
- **Neon** - Database (Free tier - 0.5GB)

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd signature-generator

# Install dependencies
npm install

# Set up environment variables (see SETUP_GUIDE.md)
cp .env.example .env.local
# Edit .env.local with your credentials

# Initialize database
npm run db:push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Required Services

1. **Neon Database** (Free)
   - Sign up at [neon.tech](https://neon.tech)
   - Create a project and get connection string

2. **Pesapal Account** (Transaction fees only)
   - Register at [pesapal.com](https://pesapal.com)
   - Complete KYC verification
   - Get API credentials

3. **UploadThing** (Free tier)
   - Sign up at [uploadthing.com](https://uploadthing.com)
   - Create an app and get API keys

See **SETUP_GUIDE.md** for detailed setup instructions.

## 💻 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run linter

# Database
npm run db:generate      # Generate migration files
npm run db:push          # Push schema to database
npm run db:studio        # View database in browser
```

## 📁 Project Structure

```
signature-generator/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── create/page.tsx             # Signature builder
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   ├── dashboard/page.tsx          # User dashboard
│   ├── api/
│   │   ├── auth/[...all]/          # Better Auth endpoints
│   │   └── pesapal/                # Payment endpoints
│   └── globals.css                 # Global styles
├── components/
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── auth.ts                     # Auth configuration
│   ├── auth-client.ts              # Client-side auth
│   ├── pesapal.ts                  # Pesapal client
│   ├── db/
│   │   ├── index.ts                # Database connection
│   │   └── schema.ts               # Database schema
│   └── utils.ts                    # Utilities
├── drizzle.config.ts               # Drizzle configuration
├── SETUP_GUIDE.md                  # Detailed setup guide
└── MASTER_PLAN.md                  # Business strategy
```

## 💰 Pricing & Monetization

### Free Tier
- 1 signature
- Basic templates
- Social media links
- Copy to clipboard

### Pro Tier (KES 999 one-time)
- Unlimited signatures
- All premium templates
- Custom branding & colors
- Logo upload
- Basic analytics
- QR code generation

### Business Tier (KES 4,999/month)
- Everything in Pro
- Team management (10 users)
- Advanced analytics
- Priority support
- Custom template requests

**Pesapal Transaction Fees:**
- M-Pesa: 1.5% - 3%
- Cards: 3.5% - 4%
- No monthly platform fees

## 📈 Revenue Projections

### Target: 100 Customers in 6 Months

**Conservative Estimate:**
- 70 Pro users @ KES 999 = KES 69,930 (one-time)
- 30 Business @ KES 4,999/mo = KES 149,970/month

**Total Potential:** KES 220,000 in 6 months

**Year 1 Goal:** KES 300,000 - 500,000 MRR

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy automatically

**Environment Variables Required:**
```env
DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
PESAPAL_CONSUMER_KEY
PESAPAL_CONSUMER_SECRET
PESAPAL_BASE_URL
UPLOADTHING_SECRET
UPLOADTHING_APP_ID
NEXT_PUBLIC_APP_URL
```

See **SETUP_GUIDE.md** for detailed deployment instructions.

## 🎯 Roadmap

### Phase 1 ✅ COMPLETE
- [x] Landing page
- [x] Signature builder with 4 templates
- [x] Real-time preview
- [x] Copy to clipboard

### Phase 2 ✅ COMPLETE
- [x] Better Auth authentication
- [x] Neon database integration
- [x] Pesapal payment gateway
- [x] User signup/login pages
- [x] Database schema for users, signatures, transactions

### Phase 3 🚧 IN PROGRESS
- [x] Login/signup pages
- [ ] User dashboard
- [ ] Save/load signatures
- [ ] Image upload (UploadThing)
- [ ] Color customization
- [ ] 6 more premium templates
- [ ] QR code generation
- [ ] Analytics dashboard

### Phase 4 (Future)
- [ ] Team management
- [ ] Email preview testing
- [ ] Template marketplace
- [ ] API access for developers
- [ ] Mobile app

## 📊 Marketing Strategy

### Free Marketing (Start Here)
1. **Reddit** - r/Kenya, r/SideProject, r/Entrepreneur
2. **LinkedIn** - Share in business groups
3. **Twitter/X** - Build in public
4. **Indie Hackers** - Share journey
5. **Product Hunt** - Launch with 50+ users
6. **SEO Content** - Blog posts
7. **Community** - Kenyan startup forums

### Paid Marketing (When Profitable)
1. Facebook Ads - Target Kenyan businesses
2. Google Ads - "Email signature Kenya"
3. LinkedIn Ads - B2B targeting
4. Instagram - Professional services

### Partnership Opportunities
1. Virtual assistants
2. Business coaches
3. Marketing agencies
4. Co-working spaces
5. Startup accelerators

## 🛠 Troubleshooting

See **SETUP_GUIDE.md** for common issues and solutions.

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Complete setup instructions
- [Master Plan](../MASTER_PLAN.md) - Business strategy and roadmap
- [Better Auth Docs](https://better-auth.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Pesapal API](https://developer.pesapal.com)
- [Drizzle ORM](https://orm.drizzle.team)

## 📞 Support

For technical issues:
- Check SETUP_GUIDE.md
- Review Better Auth/Pesapal documentation
- Open an issue on GitHub

## 📄 License

MIT License - Free to use for your own projects!

## 🙏 Acknowledgments

Built with:
- Next.js by Vercel
- Better Auth community
- shadcn/ui components
- Drizzle ORM team
- Neon database
- Pesapal payment gateway

---

**Ready to make money?** Follow the SETUP_GUIDE.md to get started! 🚀💰

Built with ❤️ to help African professionals stand out in every inbox.
