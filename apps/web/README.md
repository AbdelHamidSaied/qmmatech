# Web App (@app/web)

Dev commands:

- Install: `pnpm install`
- Dev DB (SQLite): Prisma generate/migrate/seed via db package
  - `pnpm --filter @pkg/db prisma:generate`
  - `pnpm --filter @pkg/db prisma:migrate`
  - `pnpm --filter @pkg/db seed`
- Run: `pnpm dev:web`

Open http://localhost:3000

Auth:
- Login at `/auth/login`
- Seeded users:
  - admin@acme.com / password
  - admin@globex.com / password
- Protected routes under `/dashboard` (NextAuth middleware)

Tenants by subdomain (optional):
- `acme.localhost:3000`
- `globex.localhost:3000`

If subdomain routing is hard locally, visit http://localhost:3000 (defaults to `acme`).