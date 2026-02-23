# Secure Blog Platform

A production-ready blog platform built with a decoupled architecture using NestJS for the backend API and Next.js 15 (App Router) for the frontend.

## 🚀 Architecture

The application strictly divides the frontend presentation layer from the secure backend business logic. 
- **Backend (NestJS)**: Manages database interactions via Prisma ORM, JWT-based security, modular service division (Auth, Blogs, Likes, Comments), structured Pino logging, and rate-limiting.
- **Frontend (Next.js 15)**: Provides static and dynamic routing, an abstracted API layer with an axios interceptor for token auto-injection, loading/empty states, and optimistic UI updates for likes and comments.
- **Database (PostgreSQL)**: Handles relational data with distinct indexes mapped through Prisma to ensure performance on the feed generation without N+1 query problems.

## 📦 Setup & Run Instructions

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (for the PostgreSQL database)

### Backend Setup
1. Open terminal and navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Start the Database: `docker compose up -d` (If using Docker, otherwise ensure local Postgres is running)
4. Push Prisma Schema: `npx prisma db push`
5. Start development server: `npm run start:dev` (runs on port 3001)

### Frontend Setup
1. Open terminal and navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Create `.env.local` with: `NEXT_PUBLIC_API_URL="http://localhost:3001/api"`
4. Start development server: `npm run dev` (runs on port 3000)

Access the UI at `http://localhost:3000/feed`.

## 🛠 Design Decisions & Tradeoffs

- **JWT over Sessions**: Stateless JWT allows easy horizontal scaling of the NestJS instances at the tradeoff of an inability to revoke tokens easily without a token blacklist. 
- **Next.js 'use client'**: The application heavily leverages Client Components (`'use client'`) to manage local states for JWT and optimistic UI rendering (likes/comments without refresh), rather than Server Components which would require sophisticated cookie handling.
- **Optimistic UI Updates**: The Like button visually increments immediately before the HTTP response resolves. If the request fails, it rolls back gracefully.

## 📈 Scaling to 1M Users Roadmap

To support 1,000,000 concurrent users or heavy daily traction, the following evolutionary steps are recommended:

1. **Read-Replicas & Connection Pooling**: Implement PgBouncer or Prisma Accelerate for database connection pooling. Direct read queries (like GET `/feed`) to read-replicas.
2. **Caching Layer (Redis)**: Introduce Redis caching for the `/public/feed` endpoint. Invalidate the cache whenever a new blog is published or liked.
3. **Queue System (BullMQ)**: Transition synchronous email notifications or summary generation tasks into background worker nodes.
4. **Load Balancing & Microservices**: Break the monolithic NestJS structure into separate instances for `Auth`, `Feeds`, and `Actions` behind an API Gateway/Nginx.
5. **CDN & Static Generation**: Use Next.js Incremental Static Regeneration (ISR) to statically deliver public blogs instead of fully dynamic queries. 

## 🛡 Security Highlights
- Passwords hashed using standard `bcrypt` algorithms.
- JWT endpoints protected by strict `Passport` Guards.
- `@nestjs/throttler` implemented globally to prevent brute-force API requests.
- Prisma ORM prevents standard SQL-injection attacks automatically.
- Unique compound ID constraint `@@unique([userId, blogId])` enforces pure database-level protection against multiple likes from the same user.
