import { db } from "@/db/drizzle";
import {
  accounts,
  categories,
  insertTransactionSchema,
  transactions,
} from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { createId } from "@paralleldrive/cuid2";
import { parse, subDays } from "date-fns";
import { and, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "unautorized" }, 401);
      }

      const { from, to, accountId } = c.req.valid("query");

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from
        ? parse(from, "yyyy-MM-dd", new Date())
        : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      const data = await db
        .select({
          id: transactions.id,
          category: categories.name,
          categoryId: transactions.categoryId,
          payee: transactions.payee,
          ammout: transactions.amount,
          notes: transactions.notes,
          accounts: accounts.name,
          accountId: transactions.accountId,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
          and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)
          )
        )
        .orderBy(desc(transactions.date));

      return c.json({ data });
    }
  )
  .get(
    "/:id",

    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);
      if (!auth?.userId) {
        return c.json({ error: "unautorized" }, 401);
      }
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missig id" }, 400);
      }

      const [data] = await db
        .select({
          id: transactions.id,
          name: transactions.name,
        })
        .from(transactions)
        .where(
          and(eq(transactions.userId, auth.userId), eq(transactions.id, id))
        );

      if (!data) {
        return c.json({ error: "Not found id" }, 400);
      }

      return c.json({ data });
    }
  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      insertTransactionSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "unautorized" }, 401);
      }

      const [data] = await db
        .insert(transactions)
        .values({
          id: createId(),
          userId: auth.userId,
          ...values,
        })
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
        return c.json({ error: "unautorized" }, 401);
      }

      const data = await db
        .delete(transactions)
        .where(
          and(
            eq(transactions.userId, auth.userId),
            inArray(transactions.id, values.ids)
          )
        )
        .returning({ id: transactions.id });

      return c.json({ data });
    }
  )
  .patch(
    "/:id",
    clerkMiddleware(),

    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator(
      "json",
      insertTransactionSchema.pick({
        name: true,
      })
    ),

    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");
      if (!id) {
        return c.json({ error: "Missig id" }, 400);
      }
      if (!auth?.userId) {
        return c.json({ error: "unautorized" }, 401);
      }

      const [data] = await db
        .update(transactions)
        .set(values)
        .where(
          and(eq(transactions.userId, auth.userId), eq(transactions.id, id))
        )
        .returning();

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),

    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),

    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      if (!id) {
        return c.json({ error: "Missig id" }, 400);
      }
      if (!auth?.userId) {
        return c.json({ error: "unautorized" }, 401);
      }

      const [data] = await db
        .delete(transactions)
        .where(
          and(eq(transactions.userId, auth.userId), eq(transactions.id, id))
        )
        .returning({
          id: transactions.id,
        });

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;
