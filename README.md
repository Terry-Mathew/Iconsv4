# Icons Herald

A premium, editorial-grade, invitation-only digital archive built with Next.js 14, Supabase, and Razorpay.

## Features

- **Three-Tier Profile System**: Rising, Elite, and Legacy profiles with unique layouts
- **Invitation-Only Access**: Nomination-based onboarding with admin review
- **Premium Templates**: Pixel-perfect, hard-coded profile templates
- **Payment Integration**: Razorpay integration with webhook support
- **Role-Based Access**: Visitor, Applicant, Member, Admin, Super-Admin roles
- **ISR/SSG**: Optimized for performance with proper SEO and OG meta tags
- **Admin Dashboard**: Complete management interface for nominations and users
- **AI Enhancement**: Claude integration for bio polishing and content improvement
- **Rate Limiting**: API protection with configurable limits
- **Comprehensive Testing**: Unit, integration, and E2E test coverage

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Chakra UI**
- **Framer Motion**
- **Lenis** (smooth scrolling)

### Forms & Validation
- **React Hook Form**
- **Zod**

### Icons & Components
- **Lucide Icons**
- **Radix Primitives**

### Backend & Database
- **Supabase** (Auth, Postgres, Edge Functions, Storage)
- **Row Level Security (RLS)**

### Payments
- **Razorpay SDK**
- **Webhook handlers**

### Hosting
- **Vercel** with ISR support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Razorpay account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd icons-herald
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Fill in your environment variables:
- Supabase credentials
- Razorpay keys
- OpenAI/Anthropic keys (optional)

4. Set up Supabase:
```bash
# Run migrations
npx supabase db push

# Generate types
npm run supabase:gen-types
```

5. Start the development server:
```bash
npm run dev
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=your_project_id

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_EMAIL=admin@iconsherald.com
```

## Database Schema

The application uses the following main tables:

- **users**: User accounts with role-based access
- **nominations**: Nomination submissions with review workflow
- **profiles**: Published profiles with tier-specific data
- **payments**: Payment tracking with Razorpay integration

## Profile Tiers

### Rising Tier (₹2,999)
- For emerging talents
- Skills, achievements, projects showcase
- 1 year hosting

### Elite Tier (₹4,999)
- For established professionals
- Leadership experience, publications, awards
- 2 years hosting

### Legacy Tier (₹9,999)
- For legendary figures
- Historical timeline, quotes, archives
- Lifetime hosting

## API Routes

- `/api/payment/create-order` - Create Razorpay order
- `/api/payment/verify` - Verify payment signature
- `/api/payment/webhook` - Handle Razorpay webhooks
- `/api/sitemap` - Generate sitemap.xml
- `/api/robots` - Generate robots.txt

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Environment Setup

- Configure Supabase RLS policies
- Set up Razorpay webhooks pointing to `/api/payment/webhook`
- Configure domain and SSL

## Development

### Project Structure

```
src/
├── app/                 # Next.js 14 app directory
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── builder/        # Profile builder
│   ├── nominate/       # Nomination form
│   ├── payment/        # Payment page
│   ├── profile/        # Profile pages (ISR)
│   └── profiles/       # Profile listing
├── components/         # React components
│   ├── admin/         # Admin components
│   ├── forms/         # Form components
│   ├── templates/     # Profile templates
│   └── ui/            # UI components
├── lib/               # Utilities and configurations
├── types/             # TypeScript types
├── hooks/             # Custom hooks
├── utils/             # Utility functions
└── styles/            # Global styles
```

### Key Components

- **ProfileBuilder**: Multi-step profile creation with theme customization
- **NominationForm**: Comprehensive nomination submission with validation
- **Profile Templates**: Tier-specific layouts (Rising, Elite, Legacy)
- **Admin Dashboard**: Management interface with statistics and tables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For support, email support@iconsherald.com or create an issue in the repository.
