# 🎓 CollegeCompass v2 — Nexora Design System

A production-grade college discovery platform built with **Next.js 15**, **PostgreSQL**, **Prisma**, and the **Nexora dark design system** (orange accent, glass surfaces, Manrope typography, WebGL particle hero).

## ✨ Features

| Feature | Details |
|---|---|
| 🔍 Real-time Search | Debounced autocomplete with 500+ colleges |
| 🏫 College Listings | Filters by category, state, type, placement %, sort |
| 📄 College Detail | Tabs: Overview, Courses, Placements, Reviews, Facilities, Admissions |
| 📊 Placement Charts | Recharts bar charts with trend data |
| ⚖️ Compare | Side-by-side comparison of up to 3 colleges |
| 🔐 Auth | Email/password + Google OAuth (NextAuth v5) |
| 🔖 Save Colleges | Bookmark + dashboard management |
| 🌑 Dark/Light Mode | Nexora dark default with toggle |
| ✨ WebGL Hero | Dot-matrix particle field with pointer parallax |

## 🎨 Design System (Nexora)

- **Font:** Manrope (display + body)
- **Primary accent:** `#F97316` (orange)
- **Secondary accent:** `#EA580C`
- **Surfaces:** glass morphism, `rgba(255,255,255,0.04)` + `blur(12px)`
- **Borders:** `0.8px solid rgba(255,255,255,0.10)`
- **Radius:** 12px / 9999px (pill)
- **Buttons:** white primary, transparent secondary, orange accent
- **Motion:** 200ms ease, 700ms for reveals

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 18, TypeScript, TailwindCSS |
| Design | Nexora system — Manrope, glass, orange accent |
| Backend | Next.js API Routes |
| Auth | NextAuth.js v5 (credentials + Google) |
| Database | PostgreSQL + Prisma ORM |
| Charts | Recharts |
| WebGL | Custom GLSL shaders (dot matrix hero) |
| Deployment | Vercel + Neon |

## 🚀 Getting Started

```bash
# 1. Install
npm install

# 2. Setup env
cp .env.example .env.local
# Fill in DATABASE_URL and NEXTAUTH_SECRET

# 3. Database
npx prisma db push
npx prisma generate
npm run db:seed       # Seeds 500+ colleges!

# 4. Run
npm run dev
```

Open http://localhost:3000

## 🌐 Deploy to Vercel + Neon

1. Create free DB at [neon.tech](https://neon.tech)
2. Push to GitHub → import to Vercel
3. Add env vars in Vercel dashboard:
   - `DATABASE_URL` — from Neon
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your Vercel URL
4. Run migrations: `npx prisma db push` against Neon
5. Seed: `npm run db:seed`

## 🔑 Demo Credentials
- **Student:** `demo@collegecompass.in` / `demo1234`
- **Admin:** `admin@collegecompass.in` / `demo1234`

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth + register
│   │   ├── colleges/      # List, search, detail
│   │   ├── compare/       # Side-by-side comparison
│   │   ├── saved/         # Bookmark management
│   │   └── reviews/       # Submit reviews
│   ├── colleges/          # Listing + [slug] detail
│   ├── compare/           # Compare page
│   ├── auth/              # Login + Register
│   └── dashboard/         # User dashboard + saved
├── components/
│   ├── college/           # Card, Filters, Grid, DetailClient
│   ├── compare/           # CompareClient
│   ├── home/              # Hero (WebGL), Stats, Categories, Featured
│   ├── layout/            # Navbar, Footer, ThemeProvider
│   ├── shared/            # SessionProvider, SavedCollegesClient
│   └── ui/                # Skeleton, Toaster
├── lib/                   # auth.ts, prisma.ts, utils.ts
├── types/                 # TypeScript interfaces
prisma/
├── schema.prisma          # Full schema with indexes
└── seed.ts                # 500+ colleges seeder
```

## 🏛 Architecture Decisions

- **Server Components** for college detail, dashboard (SSR for SEO)
- **Client Components** for search, filters, WebGL, interactive UI
- **JWT sessions** — stateless, works on Vercel edge
- **Debounced search** — 350ms reduces API calls
- **Prisma indexes** on name, state, city, nirfRank, category, rating, minFee
- **Zod validation** on all API inputs
- **Optimistic UI** for save/unsave toggles
- **WebGL shaders** — zero JS library dependency for particle effect
