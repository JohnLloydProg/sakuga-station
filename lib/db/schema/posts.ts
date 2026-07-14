import {
	boolean,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
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
		thumbnail: text("thumbnail_url"),
		isPublished: boolean("is_published").default(false).notNull(),
		isFeatured: boolean("is_featured").default(false).notNull(),
		reads: integer("reads").default(0).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
		publishedAt: timestamp("published_at"),
	},
	(t) => [index("posts_author_id_idx").on(t.authorId)],
);

export type Post = typeof posts.$inferSelect;
