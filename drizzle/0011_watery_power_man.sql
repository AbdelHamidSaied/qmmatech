ALTER TABLE "lists" ADD COLUMN "sendingType" text;--> statement-breakpoint
ALTER TABLE "lists" ADD COLUMN "ignoreCustomersReceiveMessageWithin" text;--> statement-breakpoint
ALTER TABLE "lists" ADD COLUMN "dailyLimit" integer;--> statement-breakpoint
ALTER TABLE "lists" ADD COLUMN "fromSr" integer;--> statement-breakpoint
ALTER TABLE "lists" ADD COLUMN "toSr" integer;--> statement-breakpoint
ALTER TABLE "lists" ADD COLUMN "type" text;--> statement-breakpoint
ALTER TABLE "lists" ADD COLUMN "scheduleDate" timestamp;