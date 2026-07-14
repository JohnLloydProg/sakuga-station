"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "..";
import { type Post, posts } from "../schema/posts";

export async function createPost(
	postProp: typeof posts.$inferInsert,
): Promise<Post | null> {
	try {
		const post = (await db.insert(posts).values(postProp).returning()).at(0);
		if (!post) return null;

		revalidatePath(`/admin/dashboard`);
		console.log("Created post with ID:", post.id);

		return post ?? null;
	} catch (error) {
		console.log("Error creating post:", error);
		return null;
	}
}

export async function updatePost(postProp: Post): Promise<Post> {
	try {
		const post = (
			await db
				.update(posts)
				.set(postProp)
				.where(eq(posts.id, postProp.id))
				.returning()
		).at(0);
		if (!post) return postProp;

		revalidatePath(`/admin/dashboard/${post.slug}`);
		console.log("Updated post with ID:", post.id);

		return post;
	} catch (error) {
		console.log("Error updating post:", error);
		return postProp;
	}
}

export async function deletePost(postId: string): Promise<void> {
	try {
		await db.delete(posts).where(eq(posts.id, postId));
		revalidatePath("/admin/dashboard");
		console.log("Deleted post with ID:", postId);
	} catch (error) {
		console.log("Error deleting post:", error);
	}
}

export async function readPost(postId: string): Promise<void> {
	try {
		await db
			.update(posts)
			.set({
				reads: sql`${posts.reads} + 1`,
			})
			.where(eq(posts.id, postId));
	} catch (error) {
		console.log("Error updatng post read:", error);
	}
}

export async function featurePost(postId: string): Promise<void> {
	try {
		await db.update(posts).set({
			isFeatured: sql`CASE WHEN ${posts.id} = ${postId} THEN true ELSE false END`,
		});
		revalidatePath("/admin/dashboard");
	} catch (error) {
		console.log("Error updatng post feature:", error);
	}
}
