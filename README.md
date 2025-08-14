# Ecommerce SaaS Starter (Monorepo)

Stack:
- Next.js (App Router) + Tailwind (apps/web)
- Prisma + PostgreSQL (packages/db)
- Multi-tenant by host subdomain (slug inferred from `Host` header)

## Prereqs
- pnpm
- Docker

## Setup
1. Copy env: `cp .env.example .env`
2. Install deps: `pnpm install`
3. Start database: `pnpm db:up`
4. Generate Prisma client: `pnpm --filter @pkg/db prisma:generate`
5. Run migrations: `pnpm --filter @pkg/db prisma:migrate`
6. Seed data: `pnpm --filter @pkg/db seed`
7. Start web: `pnpm dev:web`

Open http://localhost:3000
- Slug defaults to `acme` if no subdomain. Try: `acme.localhost:3000` and `globex.localhost:3000`

## Test the flows
- Storefront: list and view products on `/`
- Dashboard: `/dashboard`
- Add product: `/dashboard/products/new`
- API: `GET /api/products`, `POST /api/orders` with `{ "email": "buyer@example.com", "totalCents": 2599 }`
- Auth (demo): `POST /api/auth/login` with seeded users
  - `admin@acme.com` / `password`
  - `admin@globex.com` / `password`

## Notes
- No real auth sessions or billing yet; this is a minimal functional skeleton.
- Add Stripe Billing and Connect, image storage, search, and mobile app next.