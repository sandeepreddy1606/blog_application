# BlogX (Secure Blog Platform)

A production-ready blog platform built with Next.js 15, NestJS, Prisma, and PostgreSQL. It features a public social feed, a secure private dashboard, robust authentication (JWT + Refresh tokens + Role-Based Access Control), rate limiting, and structured logging.

## 🌐 Live Demo
- **Frontend (Vercel):** [https://blog-app-iota-wine-74.vercel.app](https://blog-app-iota-wine-74.vercel.app)
- **Backend API (Railway):** [https://blogapplication-production-0dec.up.railway.app](https://blogapplication-production-0dec.up.railway.app)
- **Database (Neon):** Serverless PostgreSQL

---

## 🚀 Setup Instructions

### 1. Database Setup
Create a PostgreSQL database and configure the environment mapping for the backend.

```bash
cd backend
npm install
# Create a .env file containing your DATABASE_URL, DIRECT_URL, and JWT_SECRET
npx prisma db push
npx prisma generate
npm run start:dev
```

### 2. Frontend Setup
Make sure the backend is running before launching the frontend to ensure API interactions work out-of-the-box. Ensure your frontend `.env.local` expects the proper backend route.

```bash
cd frontend
npm install
# Create a .env.local file with: NEXT_PUBLIC_API_URL="http://localhost:3001/api"
npm run dev
```

Browse to `http://localhost:3000` to dive into the platform.

---

## 🏗 Architecture Explanation

This application implements a strict **Client-Server Architecture** utilizing a fully decoupled Frontend and Backend.

**1. Frontend (Next.js 15 App Router):** 
Focused entirely on UI rendering and state management. The frontend implements a highly modular component architecture (`BlogCard`, `CommentItem`, `LikeButton`). Interactions requiring state predictability (like liking a post) use **Optimistic UI Updates** before confirming with the server. All API calls are centrally managed by an Axios instance containing strict authentication interceptors.

**2. Backend API (NestJS):**
Built utilizing a rigorous **Clean Architecture** approach. 
- **Controllers** handle pure HTTP lifecycle routing and DTO validation.
- **Services** house thick business logic safely abstracted from transport protocols.
- **Decorators/Guards** (`@Roles`, `@UseGuards(JwtAuthGuard)`, `@Throttle`) are used to enforce security (Rate Limiting, JWT Authorization, RBAC) globally cleanly across endpoints without duplicating logic.

**3. Database Layer (Prisma ORM & PostgreSQL):**
Leverages relation mapping and carefully structured composite indices (e.g., `@@unique([userId, blogId])` on Likes) to enforce data integrity directly via the database engine. This prevents duplicate data at the disk level and stops N+1 query loops.

---

## ⚖️ Tradeoffs Made

1. **JWTs vs Session Cookies:** We chose Stateless JWT Auth over Stateful Session tracking. 
   * *Tradeoff:* We lose the ability to instantly revoke a specific user session server-side without complex token blacklisting, but we gain immense vertical scaling capability since our NestJS servers remain entirely stateless.
2. **Synchronous Summaries vs Asynchronous Queues:** The blog summary generation is simulated synchronously right now. 
   * *Tradeoff:* For extremely heavy generation workloads, this blocks the request. Adding a full Redis/BullMQ queue system would prevent this but would vastly over-complicate the current initial deployment topology.
3. **Database Push vs Strict Migrations for Prototyping:** Initially used `db push` to rapidly prototype the Neon Database. 
   * *Tradeoff:* Speeds up initial development iteration at the cost of formal version control history, though the platform is now fully synchronized dynamically using `migrate dev`.

---

## 🔧 What I Would Improve

1. **Implement Redis:** Introduce Redis for aggressive caching of the `public/feed` endpoint. Since blogs are heavily read-heavy, hitting PostgreSQL for every public user request is inefficient.
2. **Event-Driven Microservices:** Migrate the "summary generation" and "notification" aspects to completely isolated background workers utilizing Kafka or RabbitMQ to ensure the main API remains hyper-responsive.
3. **Frontend Infinite Scroll & SWR:** Replace basic pagination with Infinite Scrolling using `SWR` or `React Query` on the frontend. This would dramatically enhance user-perceived performance by handling cache invalidation and background refetching automatically.

---

## 📈 How I'd Scale to 1M Users

Scaling to 1,000,000 users shifts the bottleneck from the application code directly to the **Database** and **Network Layers**.

1. **Database Scaling (Read Replicas & Connection Pooling):**
   - 95% of Blog traffic is purely reads. We would configure a Primary PostgreSQL Database (for writes) and multiple tightly synced **Read Replicas** distributed geographically to heavily offset the primary server.
   - Utilize a powerful connection pooler (like **PgBouncer** or Prisma Accelerate) to prevent connection exhaustion under heavy concurrent loads. 

2. **Aggressive CDN Offloading & Edge Caching:**
   - Push all static assets, Next.js generic pages, and public images onto a global CDN like Cloudflare. 
   - Implement **Edge Functions** (via Vercel Edge or Cloudflare Workers) to serve the `public/feed` completely from the Edge cache, vastly reducing round-trips to the primary NestJS server.

3. **Horizontal Pod Autoscaling (HPA) via Kubernetes:**
   - Strip the backend out of Railway into a highly orchestrated Kubernetes cluster. Use HPA to automatically spin up a dynamic number of stateless NestJS replica pods during immense traffic spikes, and scale down during dead hours to save costs. 

4. **Dedicated Search Engine:**
   - As data scales astronomically, using `LIKE %...%` SQL queries for blog search becomes fatal. We would mirror our database data to **Elasticsearch** or **Algolia** to handle lightning-fast full-text indexing and querying.
