import { and, eq } from "drizzle-orm";
import { db } from "../index";
import { postCategories } from "../schema/categories";

export async function addCategory(categoryId: string, postId: string) {
	await db
		.insert(postCategories)
		.values({ categoryId: categoryId, postId: postId })
		.onConflictDoNothing();
}

export async function removeCategory(categoryId: string, postId: string) {
	await db
		.delete(postCategories)
		.where(
			and(
				eq(postCategories.categoryId, categoryId),
				eq(postCategories.postId, postId),
			),
		);
}
