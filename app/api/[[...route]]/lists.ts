import { db } from "@/db/drizzle";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { campaigns, insertListSchema, lists } from "@/db/schema";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        campaignId: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { campaignId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const data = await db
        .select({
          id: lists.id,
          name: lists.name,
          status: lists.status,
          creationDate: lists.creationDate,
          campaign: campaigns.name,
          campaignId: lists.campaignId,
        })
        .from(lists)
        .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
        .where(
          and(
            campaignId ? eq(lists.campaignId, campaignId) : undefined,
            eq(campaigns.userId, auth.userId),
            eq(lists.recordStatus, "created")
          )
        )
        .orderBy(desc(lists.creationDate));

      return c.json({ data });
    }
  )
  .get(
    "/archived",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        campaignId: z.string().optional().nullable(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { campaignId } = c.req.valid("query");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const data = await db
        .select({
          id: lists.id,
          name: lists.name,
          status: lists.status,
          creationDate: lists.creationDate,
          campaign: campaigns.name,
          campaignId: lists.campaignId,
        })
        .from(lists)
        .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
        .where(
          and(
            campaignId ? eq(lists.campaignId, campaignId) : undefined,
            eq(campaigns.userId, auth.userId),
            eq(lists.recordStatus, "archived")
          )
        )
        .orderBy(desc(lists.creationDate));

      return c.json({ data });
    }
  )
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .select({
          id: lists.id,
          name: lists.name,
          status: lists.status,
          creationDate: lists.creationDate,
          campaignId: lists.campaignId,
        })
        .from(lists)
        .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
        .where(and(eq(campaigns.userId, auth.userId), eq(lists.id, id)));

      if (!data) {
        return c.json(
          {
            error: "Not found",
          },
          404
        );
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        name: z.string(),
        campaignId: z.string(),
        dailyLimit: z.number().optional(),
        dailySendingLimit: z.number().optional(),
        fromSrl: z.number().optional(),
        toSrl: z.number().optional(),
        ignoreCustomersReceivedMessage: z.number().optional(),
        type: z.enum(["run-now", "schedule"]),
        scheduleDate: z.coerce.date().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const [data] = await db
        .insert(lists)
        .values({ id: createId(), ...values })
        .returning();

      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const listsToDelete = db.$with("lists_to_delete").as(
        db
          .select({ id: lists.id })
          .from(lists)
          .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
          .where(
            and(
              inArray(lists.id, values.ids),
              eq(campaigns.userId, auth.userId)
            )
          )
      );

      const data = await db
        .with(listsToDelete)
        .update(lists)
        .set({ recordStatus: "deleted" })
        .where(inArray(lists.id, sql`(select id from ${listsToDelete})`))
        .returning({
          id: lists.id,
        });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertListSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const listsToUpdate = db.$with("lists_to_update").as(
        db
          .select({ id: lists.id })
          .from(lists)
          .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
          .where(and(eq(lists.id, id), eq(campaigns.userId, auth.userId)))
      );

      const [data] = await db
        .with(listsToUpdate)
        .update(lists)
        .set(values)
        .where(inArray(lists.id, sql`(select id from ${listsToUpdate})`))
        .returning();

      if (!data) {
        return c.json(
          {
            error: "Not found",
          },
          404
        );
      }

      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const listsToDelete = db.$with("lists_to_delete").as(
        db
          .select({ id: lists.id })
          .from(lists)
          .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
          .where(and(eq(lists.id, id), eq(campaigns.userId, auth.userId)))
      );

      const [data] = await db
        .with(listsToDelete)
        .update(lists)
        .set({ recordStatus: "deleted" })
        .where(inArray(lists.id, sql`(select id from ${listsToDelete})`))
        .returning({
          id: lists.id,
        });

      if (!data) {
        return c.json(
          {
            error: "Not found",
          },
          404
        );
      }

      return c.json({ data });
    }
  )
  .delete(
    "/archive/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const listsToArchive = db.$with("lists_to_archive").as(
        db
          .select({ id: lists.id })
          .from(lists)
          .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
          .where(and(eq(lists.id, id), eq(campaigns.userId, auth.userId)))
      );

      const [data] = await db
        .with(listsToArchive)
        .update(lists)
        .set({ recordStatus: "archived", status: "Stopped" })
        .where(inArray(lists.id, sql`(select id from ${listsToArchive})`))
        .returning({
          id: lists.id,
        });

      if (!data) {
        return c.json(
          {
            error: "Not found",
          },
          404
        );
      }

      return c.json({ data });
    }
  )
  .delete(
    "/stop/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const listsToStop = db.$with("lists_to_stop").as(
        db
          .select({ id: lists.id })
          .from(lists)
          .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
          .where(and(eq(lists.id, id), eq(campaigns.userId, auth.userId)))
      );

      const [data] = await db
        .with(listsToStop)
        .update(lists)
        .set({ status: "Stopped" })
        .where(inArray(lists.id, sql`(select id from ${listsToStop})`))
        .returning({
          id: lists.id,
        });

      if (!data) {
        return c.json(
          {
            error: "Not found",
          },
          404
        );
      }

      return c.json({ data });
    }
  )
  .delete(
    "/restore/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json(
          {
            error: "Missing id",
          },
          400
        );
      }

      if (!auth?.userId) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const listsToRestore = db.$with("lists_to_restore").as(
        db
          .select({ id: lists.id })
          .from(lists)
          .innerJoin(campaigns, eq(lists.campaignId, campaigns.id))
          .where(and(eq(lists.id, id), eq(campaigns.userId, auth.userId)))
      );

      const [data] = await db
        .with(listsToRestore)
        .update(lists)
        .set({ recordStatus: "created" })
        .where(inArray(lists.id, sql`(select id from ${listsToRestore})`))
        .returning({
          id: lists.id,
        });

      if (!data) {
        return c.json(
          {
            error: "Not found",
          },
          404
        );
      }

      return c.json({ data });
    }
  );

export default app;
