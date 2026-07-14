import { eq } from "drizzle-orm";
import { db } from "../index";
import { type PostContent, postContents } from "../schema/contents";

export async function upsertContent(
	contentProp: typeof postContents.$inferInsert,
): Promise<PostContent> {
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
	if (!content) throw new Error("Insertion returned no content!");

	return content;
}
export async function deleteContent(contentId: string): Promise<void> {
	await db.delete(postContents).where(eq(postContents.id, contentId));
}
