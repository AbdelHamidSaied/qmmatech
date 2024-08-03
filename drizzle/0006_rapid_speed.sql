CREATE TABLE IF NOT EXISTS "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'running',
	"record_status" text DEFAULT 'created',
	"creation_date" timestamp DEFAULT now() NOT NULL,
	"excel" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts_to_campaigns" (
	"contact_id" text NOT NULL,
	"campaign_id" text NOT NULL,
	CONSTRAINT "contacts_to_campaigns_contact_id_campaign_id_pk" PRIMARY KEY("contact_id","campaign_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lists" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'running',
	"record_status" text DEFAULT 'created',
	"creation_date" timestamp DEFAULT now() NOT NULL,
	"campaign_id" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts_to_campaigns" ADD CONSTRAINT "contacts_to_campaigns_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts_to_campaigns" ADD CONSTRAINT "contacts_to_campaigns_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lists" ADD CONSTRAINT "lists_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
