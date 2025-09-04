# DB Package (@pkg/db)

## Local dev (SQLite)
- DATABASE_URL: `file:/workspace/packages/db/dev.db`
- Commands:
  - `pnpm --filter @pkg/db prisma:generate`
  - `pnpm --filter @pkg/db prisma:migrate`
  - `pnpm --filter @pkg/db seed`

## Postgres (production)
- Create `.env` with `DATABASE_URL` pointing to Postgres
- Use `prisma/schema.postgres.prisma` when generating client/migrations for prod

Example commands (manual):
- `DATABASE_URL=postgresql://user:pass@host:5432/db prisma generate --schema prisma/schema.postgres.prisma`
- `DATABASE_URL=postgresql://user:pass@host:5432/db prisma migrate deploy --schema prisma/schema.postgres.prisma`

## RLS Template (Postgres)
- Enable RLS per table and use `tenant_id` bindings from session variables

Example SQL snippet:
```
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_product ON "Product"
  USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_order ON "Order"
  USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_membership ON "Membership"
  USING (tenant_id::text = current_setting('app.tenant_id', true));
```
- Set `app.tenant_id` at connection/session time from your app layer.