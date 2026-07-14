import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { type Post, posts } from "../schema/posts";

export async function createPost(
	postProp: typeof posts.$inferInsert,
): Promise<Post> {
	const post = (await db.insert(posts).values(postProp).returning()).at(0);
	if (!post) throw new Error("Insertion returned no post!");

	return post;
}

export async function updatePost(
	postProp: typeof posts.$inferInsert,
): Promise<Post> {
	if (!postProp.id) throw new Error("Attempted to update without ID");

	const post = (
		await db
			.update(posts)
			.set(postProp)
			.where(eq(posts.id, postProp.id))
			.returning()
	).at(0);
	if (!post) throw new Error("Update returned no post!");

	return post;
}

export async function deletePost(postId: string): Promise<void> {
	await db.delete(posts).where(eq(posts.id, postId));
}

export async function readPost(postId: string): Promise<void> {
	await db
		.update(posts)
		.set({
			reads: sql`${posts.reads} + 1`,
		})
		.where(eq(posts.id, postId));
}

export async function featurePost(postId: string): Promise<void> {
	await db.update(posts).set({
		isFeatured: sql`CASE WHEN ${posts.id} = ${postId} THEN true ELSE false END`,
	});
}
