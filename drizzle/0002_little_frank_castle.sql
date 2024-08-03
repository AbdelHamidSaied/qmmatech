ALTER TABLE "contacts" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "has_whatsapp" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "blocked_campaigns" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "blocked_from_bot" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "blocked_from_cc" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" DROP COLUMN IF EXISTS "user_id";