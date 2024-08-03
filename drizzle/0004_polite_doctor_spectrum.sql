ALTER TABLE "contacts" ALTER COLUMN "has_whatsapp" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "blocked_campaigns" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "blocked_from_bot" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ALTER COLUMN "blocked_from_cc" DROP NOT NULL;