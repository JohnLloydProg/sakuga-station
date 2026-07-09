import { eq } from "drizzle-orm";
import { db } from "../index";
import { PostContent, postContents } from "../schema/contents";

export async function createContent(
	contentProp: typeof postContents.$inferInsert,
): Promise<PostContent | null> {
	try {
		const content = (
			await db.insert(postContents).values(contentProp).returning()
		).at(0);
		if (!content) return null;

		console.log("Created content with ID:", content.id);

		return content;
	} catch (error) {
		console.log("Error while creating content:", error);
		return null;
	}
}

export async function updateContent(
	contentProp: PostContent,
): Promise<PostContent> {
	try {
		const content = (
			await db
				.update(postContents)
				.set(contentProp)
				.where(eq(postContents.id, contentProp.id))
				.returning()
		).at(0);
		if (!content) return contentProp;

		console.log("Updated content with ID:", content.id);

		return content;
	} catch (error) {
		console.log("Error while updating content:", error);
		return contentProp;
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
