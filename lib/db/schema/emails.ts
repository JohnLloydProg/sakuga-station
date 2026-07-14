import { primaryKey } from "drizzle-orm/cockroach-core";
import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const emails = pgTable("emails", {
	id: uuid("id").primaryKey().defaultRandom(),
	address: varchar("address", { length: 255 }).notNull().unique(),
});

export const subscriptions = pgTable(
	"subscriptions",
	{
		emailId: uuid("email_id")
			.references(() => emails.id, { onDelete: "cascade" })
			.notNull(),
		categoryId: uuid("category_id")
			.references(() => categories.id, { onDelete: "cascade" })
			.notNull(),
		subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
	},
	(t) => [
		primaryKey({ columns: [t.emailId, t.categoryId] }),
		index("subscription_email_id_idx").on(t.emailId),
		index("subscripions_cateogry_id_idx").on(t.categoryId),
		index("subscriptions_composite_idx").on(t.emailId, t.categoryId),
	],
);

export type Email = typeof emails.$inferSelect;
