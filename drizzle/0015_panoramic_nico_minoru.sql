CREATE TABLE IF NOT EXISTS "templateButtonTypes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateButtons" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"url" text,
	"phonenumber" text,
	"typeId" integer NOT NULL,
	"templateId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateCategories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateFooters" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateHeaderTypes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateHeaders" (
	"id" text PRIMARY KEY NOT NULL,
	"text" text,
	"typeId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateLanguages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templateTypes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "templates" (
	"id" text PRIMARY KEY NOT NULL,
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
