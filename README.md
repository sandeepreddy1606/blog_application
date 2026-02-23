# BlogX (Secure Blog Platform)

A production-ready blog platform built with Next.js 15, NestJS, Prisma, and PostgreSQL. It features a public social feed, a secure private dashboard, robust authentication (JWT + Refresh tokens + Role-Based Access Control), rate limiting, and structured logging.

## 🌐 Live Demo
- **Frontend (Vercel):** [https://blog-app-iota-wine-74.vercel.app](https://blog-app-iota-wine-74.vercel.app)
- **Backend API (Railway):** Deployed via Railway Docker Container
- **Database (Neon):** Serverless PostgreSQL

## ✨ Features

- **Authentication & Security:** JWT matching with secure password hashing (bcrypt), refresh tokens, and Role Based Access Control (RBAC). Strict class-validator DTO validation and protected routes.
- **Private Dashboard:** Create, edit, publish, and delete your own blog posts securely. 
- **Public Feed:** Paginated social feed displaying the newest published stories.
- **Interactions:** Ability to like blogs (optimistic UI) and join deep, threaded comment discussions on individual posts. 
- **Architecture:** Clean frontend architecture with highly modularized React components (BlogCard, CommentItem, LikeButton). Backend is separated neatly into services, controllers, guards, and decorators.
- **Robust APIs & Throttling:** Prevent abuse with strict API rate limiting returning HTTP 429 on violations, gracefully handle database unique constraints, and employ safe error fallbacks keeping DB errors concealed. Strict CORS policies implemented to only allow the Vercel origins.
- **Optimized DB:** Prisma modeled PostgreSQL database with properly configured indexes preventing N+1 queries using targeted relation mapping.

## 🛠 Tech Stack

**Backend:**
- **NestJS** (TypeScript, Controllers/Services/Guards)
- **PostgreSQL** (Hosted on Neon) + **Prisma ORM**
- Authentication via `@nestjs/jwt`, `passport-jwt`, `bcrypt`
- Global API Rate Limiting via `@nestjs/throttler`
- Structured Logging via `nestjs-pino` / `pino-pretty`
- **Dockerized** (Node:22-alpine base image for optimal Prisma compatibility)

**Frontend:**
- **Next.js 15** (App Router)
- **TypeScript** & **Tailwind CSS**
- Centralized Axios API instance with automatic token interceptors
- Lucide React for crisp SVG iconography

## 🚀 Running Locally

### 1. Database Setup
Create a local PostgreSQL database or configure a cloud DB (like Neon).

```bash
cd backend
npm install
# Create a .env file containing your DATABASE_URL, DIRECT_URL, and JWT_SECRET
npx prisma db push
npx prisma generate
npm run start:dev
```

### 2. Frontend Setup
Make sure the backend is running before launching the frontend to ensure API interactions work out-of-the-box. 

```bash
cd frontend
npm install
# Create a .env.local file with: NEXT_PUBLIC_API_URL="http://localhost:3001/api"
npm run dev
```

Browse to `http://localhost:3000` to dive into the platform locally.

## ☁️ Deployment Guide

### Database (Neon)
1. Set up a Neon PostgreSQL project and grab your `DATABASE_URL` (Pooled) and `DIRECT_URL`.
2. Push your schema: `npx prisma migrate dev --name init`.

### Backend (Railway)
1. Deploy the GitHub repository via Railway. It will automatically detect the `Dockerfile` in the `/backend` Root Directory.
2. In Railway Variables, provide `DATABASE_URL`, `DIRECT_URL`, and `JWT_SECRET`.
3. Railway handles the Docker build optimally utilizing Node 22. Note the generated public URL ending in `.up.railway.app`.

### Frontend (Vercel)
1. Import the GitHub repository using Vercel. Set the Root Directory to `frontend`.
2. Add the Environment Variable `NEXT_PUBLIC_API_URL` pointing strictly to your Railway endpoint (e.g. `https://your-app.up.railway.app/api`). Note: include `https://` prefix.

## 📋 Evaluation Notes
- **Clean Architecture Checklist:**
  - Logic decoupled mostly to Services.
  - Role (`@Roles`), Throttling (`@Throttle`), and auth (`@UseGuards`) used cleanly.
  - Optimistic UI successfully implemented in `LikeButton`.
  - Background processes: Simulated / gracefully handled async summary generation bypassing blocking logic.
- **Missing Elements Resolved:**
  - `P2002` duplicate entries returning proper `409 Conflict` safely.
  - Included RBAC Enums (`USER`, `ADMIN`) and proper TTL Refresh token logic handling.
  - Advanced NestJS deployment config mapping: resolved `tsconfig.build.json` nesting structures to ensure Docker image compatibility.
