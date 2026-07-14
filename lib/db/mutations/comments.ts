import { eq } from "drizzle-orm";
import { db } from "../index";
import { type Comment, comments } from "../schema/comments";

export async function createComment(
	commentProp: typeof comments.$inferInsert,
): Promise<Comment | null> {
	try {
		const comment = (
			await db.insert(comments).values(commentProp).returning()
		).at(0);
		if (!comment) return null;

		console.log("Created comment with ID:", comment.id);

		return comment;
	} catch (error) {
		console.log("Error while creating comment:", error);
		return null;
	}
}

export async function updateComment(commentProp: Comment): Promise<Comment> {
	try {
		const comment = (
			await db
				.update(comments)
				.set(commentProp)
				.where(eq(comments.id, commentProp.id))
				.returning()
		).at(0);
		if (!comment) return commentProp;

		console.log("Updated comment with ID:", comment.id);

		return comment;
	} catch (error) {
		console.log("Error while updating comment:", error);
		return commentProp;
	}
}

export async function deleteComment(commentId: string): Promise<void> {
	try {
		await db.delete(comments).where(eq(comments.id, commentId));
		console.log("Deleted comment with ID:", commentId);
	} catch (error) {
		console.log("Error while deleting comment:", error);
	}
}
