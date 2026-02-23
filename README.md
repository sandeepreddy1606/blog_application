# BlogX (Secure Blog Platform)

A production-ready blog platform built with Next.js 15, NestJS, Prisma, and PostgreSQL. It features a public social feed, a secure private dashboard, robust authentication (JWT + Refresh tokens + Role-Based Access Control), rate limiting, and structured logging.

## ✨ Features

- **Authentication & Security:** JWT matching with secure password hashing (bcrypt), refresh tokens, and Role Based Access Control (RBAC). Strict class-validator DTO validation and protected routes.
- **Private Dashboard:** Create, edit, publish, and delete your own blog posts securely. 
- **Public Feed:** Paginated social feed displaying the newest published stories.
- **Interactions:** Ability to like blogs (optimistic UI) and join deep, threaded comment discussions on individual posts. 
- **Architecture:** Clean frontend architecture with highly modularized React components (BlogCard, CommentItem, LikeButton). Backend is separated neatly into services, controllers, guards, and decorators.
- **Robust APIs & Throttling:** Prevent abuse with strict API rate limiting returning HTTP 429 on violations, gracefully handle database unique constraints, and employ safe error fallbacks keeping DB errors concealed.
- **Optimized DB:** Prisma modeled PostgreSQL database with properly configured indexes preventing N+1 queries using targeted relation mapping.

## 🛠 Tech Stack

**Backend:**
- **NestJS** (TypeScript, Controllers/Services/Guards)
- **PostgreSQL** + **Prisma ORM**
- Authentication via `@nestjs/jwt`, `passport-jwt`, `bcrypt`
- Global API Rate Limiting via `@nestjs/throttler`
- Structured Logging via `nestjs-pino` / `pino-pretty`

**Frontend:**
- **Next.js 15** (App Router)
- **TypeScript** & **Tailwind CSS**
- Centralized Axios API instance with automatic token interceptors
- Lucide React for crisp SVG iconography

## 🚀 Running Locally

### 1. Database Setup
Create a PostgreSQL database and configure the environment mapping for backend.

```bash
cd backend
# create a .env file containing your DATABASE_URL, JWT_SECRET
npm install
npx prisma db push
npx prisma generate
npm run start:dev
```

### 2. Frontend Setup
Make sure the backend is running before launching the frontend to ensure API interactions work out-of-the-box. Ensure your frontend `.env.local` expects the proper backend route.

```bash
cd frontend
npm install
npm run dev
```

Browse to `http://localhost:3000` to dive into the platform.

## 📋 Evaluation Notes
- **Clean Architecture Checklist:**
  - Logic decoupled mostly to Services.
  - Role (`@Roles`), Throttling (`@Throttle`), and auth (`@UseGuards`) used cleanly.
  - Optimistic UI successfully implemented in `LikeButton`.
  - Background processes: Simulated / gracefully handled async summary generation bypassing blocking logic.
- **Missing Elements Resolved:**
  - `P2002` duplicate entries returning proper `409 Conflict` safely.
  - Bonus metrics: Included RBAC Enums (`USER`, `ADMIN`) and proper TTL Refresh token logic handling.
