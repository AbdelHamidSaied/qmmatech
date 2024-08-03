import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const contacts = pgTable("contacts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  phone: text("phone").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  hasWhatsApp: boolean("has_whatsapp").default(true),
  blockedCampaigns: boolean("blocked_campaigns").default(false),
  blockedFromBot: boolean("blocked_from_bot").default(false),
  blockedFromCC: boolean("blocked_from_cc").default(false),
});

export const lists = pgTable("lists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").default("running"),
  recordStatus: text("record_status").default("created"),
  creationDate: timestamp("creation_date", { mode: "date" })
    .notNull()
    .defaultNow(),
  campaignId: text("campaign_id")
    .references(() => campaigns.id)
    .notNull(),
  sendingType: text("sendingType"),
  ignoreCustomersReceivedMessageWithin: text(
    "ignoreCustomersReceiveMessageWithin"
  ),
  dailyLimit: integer("dailyLimit"),
  dailySendingLimit: integer("dailySendingLimit"),
  fromSr: integer("fromSr"),
  toSr: integer("toSr"),
  type: text("type"),
  scheduleDate: timestamp("scheduleDate", { mode: "date" }),
});
export const listsRelations = relations(lists, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [lists.campaignId],
    references: [campaigns.id],
  }),
}));

export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  status: text("status").default("Running"),
  recordStatus: text("record_status").default("created"),
  creationDate: timestamp("creation_date", { mode: "date" })
    .notNull()
    .defaultNow(),
  excel: text("excel").notNull(),
});
export const campaignsRelations = relations(campaigns, ({ many }) => ({
  lists: many(lists),
}));

export const templateTypes = pgTable("templateTypes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
export const templateTypesRelations = relations(templateTypes, ({ many }) => ({
  templates: many(templates),
}));

export const templateLanguages = pgTable("templateLanguages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
export const templateLanguagesRelations = relations(
  templateLanguages,
  ({ many }) => ({
    templates: many(templates),
  })
);

export const templateHeaders = pgTable("templateHeaders", {
  id: text("id").primaryKey(),
  text: text("text"),
  typeId: text("typeId").notNull(),
});
export const templateHeadersRelations = relations(
  templateHeaders,
  ({ one }) => ({
    type: one(templateHeaderTypes, {
      fields: [templateHeaders.typeId],
      references: [templateHeaderTypes.id],
    }),
    template: one(templates),
  })
);

export const templateHeaderTypes = pgTable("templateHeaderTypes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
export const templateHeaderTypesRelations = relations(
  templateHeaderTypes,
  ({ many }) => ({
    templateHeaders: many(templateHeaders),
  })
);

export const templateFooters = pgTable("templateFooters", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
});
export const templateFootersRelations = relations(
  templateFooters,
  ({ one }) => ({ template: one(templates) })
);

export const templateCategories = pgTable("templateCategories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
export const templateCategoriesRelations = relations(
  templateCategories,
  ({ many }) => ({
    templates: many(templates),
  })
);

export const templateButtons = pgTable("templateButtons", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  url: text("url"),
  phonenumber: text("phonenumber"),
  typeId: integer("typeId").notNull(),
  templateId: integer("templateId"),
});
export const templateButtonsRelations = relations(
  templateButtons,
  ({ one }) => ({
    type: one(templateButtonTypes, {
      fields: [templateButtons.typeId],
      references: [templateButtonTypes.id],
    }),
    template: one(templates, {
      fields: [templateButtons.templateId],
      references: [templates.id],
    }),
  })
);

export const templateButtonTypes = pgTable("templateButtonTypes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
export const templateButtonTypesRelations = relations(
  templateButtonTypes,
  ({ many }) => ({
    templateButton: many(templateButtons),
  })
);

export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  allowCategoryChange: boolean("allowCategoryChange").notNull(),
  categoryId: text("categoryId").notNull(),
  typeId: text("typeId").notNull(),
  languageId: text("languageId").notNull(),
  headerId: text("headerId"),
  bodyMessage: text("bodyMessage").notNull(),
  footerId: text("footerId"),
  status: text("status").default("Pending"),
  recordStatus: text("record_status").default("created"),
  creationDate: timestamp("creation_date", { mode: "date" })
    .notNull()
    .defaultNow(),
});
export const templatesRelations = relations(templates, ({ one, many }) => ({
  category: one(templateCategories, {
    fields: [templates.categoryId],
    references: [templateCategories.id],
  }),
  type: one(templateTypes, {
    fields: [templates.typeId],
    references: [templateTypes.id],
  }),
  language: one(templateLanguages, {
    fields: [templates.languageId],
    references: [templateLanguages.id],
  }),
  header: one(templateHeaders, {
    fields: [templates.headerId],
    references: [templateHeaders.id],
  }),
  footer: one(templateFooters, {
    fields: [templates.footerId],
    references: [templateFooters.id],
  }),
  buttons: many(templateButtons),
}));

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  allowCategoryChange: boolean("allowCategoryChange").notNull(),
  categoryId: text("categoryId").notNull(),
  typeId: text("typeId").notNull(),
  languageId: text("languageId").notNull(),
  headerId: text("headerId"),
  bodyMessage: text("bodyMessage").notNull(),
  footerId: text("footerId"),
  status: text("status").default("Pending"),
  recordStatus: text("record_status").default("created"),
  creationDate: timestamp("creation_date", { mode: "date" })
    .notNull()
    .defaultNow(),
});
export const messagesRelations = relations(messages, ({ one, many }) => ({
  category: one(templateCategories, {
    fields: [messages.categoryId],
    references: [templateCategories.id],
  }),
  type: one(templateTypes, {
    fields: [messages.typeId],
    references: [templateTypes.id],
  }),
  language: one(templateLanguages, {
    fields: [messages.languageId],
    references: [templateLanguages.id],
  }),
  header: one(templateHeaders, {
    fields: [messages.headerId],
    references: [templateHeaders.id],
  }),
  footer: one(templateFooters, {
    fields: [messages.footerId],
    references: [templateFooters.id],
  }),
  buttons: many(templateButtons),
}));

export const insertContactSchema = createInsertSchema(contacts);
export const insertListSchema = createInsertSchema(lists, {
  creationDate: z.coerce.date(),
});
export const insertCampaignSchema = createInsertSchema(campaigns, {
  creationDate: z.coerce.date(),
});
