"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createComment } from "../db/mutations/comments";
import type { FormState } from "./interfaces";

const commentInsertSchema = z.object({
	postId: z.string(),
	authorName: z.string().transform((val) => val.trim() || "Anonymouse"),
	body: z.string().trim().min(3, "Comment must be at least 3 characters"),
});

export async function postComment(
	postId: string,
	slug: string,
	_: FormState,
	formData: FormData,
): Promise<FormState> {
	const name = formData.get("name") || "";
	const comment = formData.get("comment");

	const parsed = commentInsertSchema.safeParse({
		postId: postId,
		body: comment,
		authorName: name,
	});
	if (!parsed.success) {
		return { success: false, errors: z.flattenError(parsed.error).fieldErrors };
	}

	try {
		await createComment(parsed.data);
	} catch (error) {
		console.error("Failed to create comment:", error);
		return { success: false, message: "Failed to create comment" };
	}

	revalidatePath(`/posts/${slug}`);

	return { success: true, message: "Comment successfully sent" };
}
