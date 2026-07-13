"use server";

import { DrizzleQueryError, eq } from "drizzle-orm";
import { db } from "../index";
import { PostContent, postContents } from "../schema/contents";

export async function createContent(
	contentProp: typeof postContents.$inferInsert,
): Promise<PostContent | null> {
	try {
		const content = (
			await db
				.insert(postContents)
				.values(contentProp)
				.onConflictDoUpdate({
					target: postContents.id,
					set: { payload: contentProp.payload, index: contentProp.index },
				})
				.returning()
		).at(0);
		if (!content) return null;

		console.log("Created content with ID:", content.id);

		return content;
	} catch (insertError) {
		console.log("Error creating session:", insertError);
		return null;
	}
}
export async function deleteContent(contentId: string): Promise<void> {
	try {
		await db.delete(postContents).where(eq(postContents.id, contentId));
		console.log("Deleted content with ID:", contentId);
	} catch (error) {
		console.log("Error while deleting content:", error);
	}
}
