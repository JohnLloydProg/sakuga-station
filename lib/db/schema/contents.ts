import {
	index,
	integer,
	pgTable,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const contents = pgTable("contents", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 255 }).notNull(),
});

export const postContents = pgTable(
	"post_contents",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		postId: uuid("post_id")
			.references(() => posts.id, { onDelete: "cascade" })
			.notNull(),
		contentId: uuid("content_id")
			.references(() => contents.id, { onDelete: "cascade" })
			.notNull(),
		payload: text("payload").notNull(),
		index: integer("index").notNull(),
	},
	(t) => [
		index("post_contents_post_id_idx").on(t.postId),
		index("post_contents_content_id_ix").on(t.contentId),
	],
);

export type Content = typeof contents.$inferSelect;
export type PostContent = typeof postContents.$inferSelect;
