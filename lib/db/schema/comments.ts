import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { posts } from "./posts";

export const comments = pgTable(
	"comments",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		postId: uuid("post_id")
			.references(() => posts.id, { onDelete: "cascade" })
			.notNull(),
		authorName: text("author_name").notNull(),
		body: text("body").notNull(),
		isApproved: boolean("is_approved").default(false).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(t) => [index("comments_post_id_idx").on(t.postId)],
);

export type Comment = typeof comments.$inferSelect;
