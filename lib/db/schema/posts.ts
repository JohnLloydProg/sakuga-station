import {
	pgTable,
	text,
	uuid,
	timestamp,
	varchar,
	index,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const posts = pgTable(
	"posts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		authorId: uuid("author_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		title: text("title").notNull(),
		slug: text("slug").notNull().unique(),
		body: text("body"),
		status: varchar("status", { length: 50 }).default("draft").notNull(),
		thumbnail: text("thumbnail_url"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		publishedAt: timestamp("published_at"),
	},
	(t) => [index("posts_author_id_idx").on(t.authorId)],
);

export type Post = typeof posts.$inferSelect;
