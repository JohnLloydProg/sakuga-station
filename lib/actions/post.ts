"use server";

import { revalidatePath } from "next/cache";
import { addCategory, removeCategory } from "../db/mutations/categories";
import { createContent, deleteContent } from "../db/mutations/contents";
import { updatePost } from "../db/mutations/posts";
import { Post } from "../db/schema/posts";
import { FormState } from "./interfaces";
import { put } from "@vercel/blob";

export async function PostAction(
	post: Post,
	contents: ClientContent[],
	deletedContents: string[],
	categoryChanges: Map<string, string>,
	_: FormState,
	formData: FormData,
): Promise<FormState> {
	const title = formData.get("title") as string;
	const introduction = formData.get("introduction") as string;

	console.log(formData);
	post.title = title;
	post.body = introduction;
	const image = formData.get("hero-image-upload") as File;
	if (image.size > 0) {
			try {
				const blobPath = `${post.id}/${image.name}`;

				const blob = await put(blobPath, image, {
					access: "public",
					addRandomSuffix: false,
					contentType: image.type,
					allowOverwrite: true,
				});

				post.thumbnail = blob.url;
			} catch (error) {
				console.error("Failed to write to Blob:", error);
				return { success: false, error: "Failed to save the comment." };
			}
		}

	await updatePost(post);

	for (const [index, content] of contents.entries()) {
		const [typeId, contentId] = content.id.split("/");
		if (formData.has(content.id)) {
			const image = formData.get(content.id) as File;
			if (image.size === 0) continue;
			try {
				const blobPath = `${post.id}/${image.name}`;

				const blob = await put(blobPath, image, {
					access: "public",
					addRandomSuffix: false,
					contentType: image.type,
					allowOverwrite: true,
				});

				content.payload = blob.url;
			} catch (error) {
				console.error("Failed to write to Blob:", error);
				return { success: false, error: "Failed to save the comment." };
			}
		}
		await createContent({
			id: contentId,
			postId: post.id,
			contentId: typeId,
			payload: content.payload,
			index: index,
		});
	}

	for (const deletedContent of deletedContents) {
		await deleteContent(deletedContent);
	}

	for (const [categoryId, value] of categoryChanges.entries()) {
		if (value === "Add") {
			await addCategory(categoryId, post.id);
		} else {
			await removeCategory(categoryId, post.id);
		}
	}

	revalidatePath(`/admin/${post.slug}`);

	return {
		success: true,
		message: "Posted successfully.",
	};
}
