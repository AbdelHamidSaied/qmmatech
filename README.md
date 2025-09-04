# Ecommerce SaaS Starter (Monorepo)

Stack:
- Next.js (App Router) + Tailwind (apps/web)
- Prisma + SQLite (dev) / Postgres (prod) (packages/db)
- NextAuth (credentials) + Prisma adapter
- Multi-tenant by host subdomain (slug inferred from `Host` header)

## Prereqs
- pnpm
- Node 18+

## Setup (SQLite dev)
1. Install deps: `pnpm install`
2. Generate client: `pnpm --filter @pkg/db prisma:generate`
3. Migrate: `pnpm --filter @pkg/db prisma:migrate`
4. Seed: `pnpm --filter @pkg/db seed`
5. Start web: `pnpm dev:web`

Open http://localhost:3000
- Login at `/auth/login` (admin@acme.com / password)
- Dashboard routes are protected via middleware

## Production (Postgres + RLS)
- Set `DATABASE_URL` to your Postgres instance
- Use Postgres schema file to generate and deploy:
  - `DATABASE_URL=... prisma generate --schema packages/db/prisma/schema.postgres.prisma`
  - `DATABASE_URL=... prisma migrate deploy --schema packages/db/prisma/schema.postgres.prisma`
- Apply RLS policies (see `packages/db/README.md`)

## Performance basics in place
- ISR: storefront and product pages `revalidate=60`
- API caching: Cache-Control headers on `/api/products`

## Next steps
- Add Redis cache, ISR tags/revalidation, search index, Stripe Billing/Connect, image CDN, and full UI/UX.