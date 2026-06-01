#  CollegeCompass – AI-Powered College Discovery & Comparison Platform

 **Live Demo:** https://collegecompass-f26j.vercel.app

CollegeCompass is a **full-stack college discovery and comparison platform** designed to help students make informed higher-education decisions. The platform enables users to explore colleges, compare institutions, save favorites, manage profiles, and share reviews through a modern and intuitive interface.

Built using **Next.js, TypeScript, Prisma, PostgreSQL, NextAuth, and Google OAuth**, CollegeCompass demonstrates scalable full-stack architecture and modern web development practices.

---

##  Project Overview

Choosing the right college can be overwhelming due to scattered information across multiple websites. CollegeCompass simplifies this process by providing a centralized platform where students can:

* Explore colleges
* Compare institutions side-by-side
* Save favorite colleges
* Submit ratings and reviews
* Manage personalized profiles

The platform is designed to improve decision-making through organized and accessible college information.

---

##  Features

###  Authentication & Authorization

* User Registration & Login
* Google OAuth Authentication
* Secure JWT-based Sessions
* Protected User Dashboard

###  College Discovery

* Browse colleges
* Search colleges by name
* View detailed college information
* Sort colleges by ratings and other criteria

###  College Comparison

* Compare multiple colleges side-by-side
* Analyze important metrics such as:

  * Ratings
  * Fees
  * Placements
  * Location
  * Facilities

###  Saved Colleges

* Save favorite colleges
* Access saved colleges from dashboard
* Personalized college shortlist

###  Reviews & Ratings

* Submit college reviews
* Rate institutions
* View community feedback

###  User Dashboard

* Manage profile information
* Update preferences
* View saved colleges
* Track user activity

###  Responsive Design

* Mobile-friendly interface
* Optimized for desktop, tablet, and mobile devices

---

##  Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* CSS Modules

### Backend

* Next.js API Routes
* Prisma ORM

### Database

* PostgreSQL
* Neon Database

### Authentication

* NextAuth.js
* Google OAuth
* JWT Sessions

### Deployment

* Vercel
* GitHub

---

##  Folder Structure

```bash
collegecompass/
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── colleges/
│   │   ├── compare/
│   │   └── dashboard/
│   │
│   ├── components/
│   │   ├── college/
│   │   ├── compare/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── shared/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   │
│   └── types/
│
├── public/
├── package.json
├── next.config.ts
└── tsconfig.json
```

---

##  API Routes

### Colleges

| Method | Route                | Description         |
| ------ | -------------------- | ------------------- |
| GET    | /api/colleges        | Get all colleges    |
| GET    | /api/colleges/[slug] | Get college details |
| GET    | /api/colleges/search | Search colleges     |

### Saved Colleges

| Method | Route      | Description          |
| ------ | ---------- | -------------------- |
| GET    | /api/saved | Get saved colleges   |
| POST   | /api/saved | Save a college       |
| DELETE | /api/saved | Remove saved college |

### Reviews

| Method | Route        | Description |
| ------ | ------------ | ----------- |
| GET    | /api/reviews | Get reviews |
| POST   | /api/reviews | Add review  |

### Profile

| Method | Route        | Description      |
| ------ | ------------ | ---------------- |
| GET    | /api/profile | Get user profile |
| PUT    | /api/profile | Update profile   |

### Authentication

| Method | Route                   | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | /auth/login             | Login page             |
| GET    | /auth/register          | Registration page      |
| POST   | /api/auth/[...nextauth] | Authentication handler |

---

##  Installation & Setup

###  Clone the Repository

```bash
git clone https://github.com/Aditijar13/collegecompass.git
cd collegecompass
```

###  Install Dependencies

```bash
npm install
```

###  Setup Environment Variables

Create a `.env` file and add:

```env
DATABASE_URL="your_postgresql_database_url"

NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

###  Run Database Migrations

```bash
npx prisma migrate dev
```

###  Generate Prisma Client

```bash
npx prisma generate
```

###  Seed Database (Optional)

```bash
npx prisma db seed
```

###  Run Development Server

```bash
npm run dev
```

###  Open in Browser

```bash
http://localhost:3000
```

---

##  Key Learnings

* Built a complete full-stack application using Next.js
* Implemented secure authentication with NextAuth
* Integrated Google OAuth login
* Designed relational database schemas using Prisma
* Worked with PostgreSQL and Neon Database
* Implemented CRUD operations and protected routes
* Managed server-side rendering and API routes
* Deployed production-ready applications on Vercel

---

##  Future Improvements

* AI-powered college recommendations
* Admission prediction system
* Scholarship recommendation engine
* Advanced search and filtering
* Personalized career guidance
* College chatbot assistant
* Analytics dashboard
* Real-time notifications

---

##  Screenshots

Add screenshots of:

* Home Page
* College Listings Page
* College Details Page
* Compare Colleges Page
* User Dashboard
* Saved Colleges Page

---

##  Author

**Aditi Jar**

* GitHub: https://github.com/Aditijar13

---

##  License

This project is licensed under the **MIT License**.

---

##  Show Your Support

If you found this project useful, consider giving it a **⭐ Star** on GitHub!
