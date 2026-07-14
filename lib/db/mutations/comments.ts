import { eq } from "drizzle-orm";
import { db } from "../index";
import { type Comment, comments } from "../schema/comments";

export async function createComment(
	commentProp: typeof comments.$inferInsert,
): Promise<Comment> {
	const comment = (
		await db.insert(comments).values(commentProp).returning()
	).at(0);
	if (!comment) throw new Error("Insertion returned no comment!");

	return comment;
}

export async function updateComment(
	commentProp: typeof comments.$inferInsert,
): Promise<Comment> {
	if (!commentProp.id) throw new Error("Attempted to update without ID");

	const comment = (
		await db
			.update(comments)
			.set(commentProp)
			.where(eq(comments.id, commentProp.id))
			.returning()
	).at(0);
	if (!comment) throw new Error("Insertion returned no comment!");

	return comment;
}

export async function deleteComment(commentId: string): Promise<void> {
	await db.delete(comments).where(eq(comments.id, commentId));
}
