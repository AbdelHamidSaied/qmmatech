# Web App (@app/web)

Dev commands:

- Install: `pnpm install`
- Start DB: `pnpm db:up`
- Copy env: `cp .env.example .env`
- Migrate: `pnpm dev:web prisma:migrate` or `pnpm --filter @pkg/db prisma:migrate`
- Seed: `pnpm --filter @pkg/db seed`
- Run: `pnpm dev:web`

Open http://localhost:3000

Tenants available by slug inferred from host subdomain:
- `acme.localhost:3000` -> Acme Store
- `globex.localhost:3000` -> Globex Shop

If subdomain routing is hard locally, visit http://localhost:3000 (defaults to `acme`).