CREATE TABLE IF NOT EXISTS "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"phone" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"has_whatsapp" boolean DEFAULT true,
	"blocked_campaigns" boolean DEFAULT false,
	"blocked_from_bot" boolean DEFAULT false,
	"blocked_from_cc" boolean DEFAULT false
);
