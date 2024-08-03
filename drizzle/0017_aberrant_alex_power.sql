CREATE TABLE IF NOT EXISTS "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"allowCategoryChange" boolean NOT NULL,
	"categoryId" text NOT NULL,
	"typeId" text NOT NULL,
	"languageId" text NOT NULL,
	"headerId" text,
	"bodyMessage" text NOT NULL,
	"footerId" text,
	"status" text DEFAULT 'Pending',
	"record_status" text DEFAULT 'created',
	"creation_date" timestamp DEFAULT now() NOT NULL
);
