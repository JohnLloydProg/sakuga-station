"use server";

import { revalidatePath } from "next/cache";
import { createComment } from "../db/mutations/comments";
import type { FormState } from "./interfaces";

export async function postComment(
	postId: string,
	slug: string,
	_: FormState,
	formData: FormData,
): Promise<FormState> {
	const name = formData.get("name") as string;
	const comment = formData.get("comment") as string;

	if (!comment)
		return { success: false, error: "Please provide a comment to send" };

	await createComment({
		postId: postId,
		body: comment,
		authorName: name || "Anonymouse",
	});

	revalidatePath(`/posts/${slug}`);

	return { success: true, message: "Comment successfully sent" };
}
