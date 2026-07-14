import { index, pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const categories = pgTable("categories", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull().unique(),
});

export const postCategories = pgTable(
	"post_categories",
	{
		postId: uuid("post_id")
			.references(() => posts.id, { onDelete: "cascade" })
			.notNull(),
		categoryId: uuid("category_id")
			.references(() => categories.id, { onDelete: "cascade" })
			.notNull(),
	},
	(t) => [
		primaryKey({ columns: [t.postId, t.categoryId] }),
		index("post_categories_post_id_idx").on(t.postId),
		index("post_categories_category_id_idx").on(t.categoryId),
		index("post_categories_composite_idx").on(t.postId, t.categoryId),
	],
);

export type Category = typeof categories.$inferSelect;
