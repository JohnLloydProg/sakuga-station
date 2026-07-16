"use server";

import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { z } from "zod";
import PublishedPostEmail from "@/app/components/emailTemplate";
import { addCategory, removeCategory } from "../db/mutations/categories";
import { deleteContent, upsertContent } from "../db/mutations/contents";
import {
	createPost,
	deletePost,
	featurePost,
	readPost,
	updatePost,
} from "../db/mutations/posts";
import { getEmailsForCategory } from "../db/queries/emails";
import type { Category } from "../db/schema/categories";
import type { postContents } from "../db/schema/contents";
import type { Post } from "../db/schema/posts";
import type { FormState } from "./interfaces";

const postUpdateSchema = z.object({
	title: z.string().min(10, "Title must be at least 10 characters!"),
	body: z.string().optional(),
	thumnail: z.string().optional(),
});

const contentInsertSchema = z.object({
	id: z.string(),
	postId: z.string(),
	contentId: z.string(),
	payload: z.string().min(5, "Content needs to have a payload"),
	index: z.int(),
});

const resend = new Resend(process.env.RESEND_API);

export async function savePostAction(
	post: Post,
	contents: ClientContent[],
	deletedContents: string[],
	categoryChanges: Map<string, string>,
	_: FormState,
	formData: FormData,
): Promise<FormState> {
	const title = formData.get("title") as string;
	const introduction = formData.get("introduction") as string;

	post.title = title;
	post.body = introduction;
	post.updatedAt = new Date();

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
			return { success: false, message: "Failed to save the thumbnail." };
		}
	}

	const parsedPost = postUpdateSchema.safeParse(post);
	if (!parsedPost.success)
		return {
			success: false,
			errors: z.flattenError(parsedPost.error).fieldErrors,
		};

	const contentData: (typeof postContents.$inferInsert)[] = [];
	for (const [index, content] of contents.entries()) {
		const [typeId, contentId] = content.id.split("/");
		if (formData.has(content.id)) {
			if (typeof formData.get(content.id) === "string") {
				const richText = formData.get(content.id) as string;
				content.payload = richText === "<p></p>" ? "" : richText;
			} else {
				const image = formData.get(content.id) as File;
				if (image.size > 0) {
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
						return { success: false, message: "Failed to save the image." };
					}
				}
			}
		}
		const parsedContent = contentInsertSchema.safeParse({
			id: contentId,
			postId: post.id,
			contentId: typeId,
			payload: content.payload,
			index: index,
		});

		if (!parsedContent.success)
			return {
				success: false,
				errors: z.flattenError(parsedContent.error).fieldErrors,
			};

		contentData.push(parsedContent.data);
	}

	for (const deletedContent of deletedContents) {
		try {
			await deleteContent(deletedContent);
		} catch (error) {
			console.error("Failed to delete content:", error);
			return { success: false, message: "Failed to delete content." };
		}
	}

	for (const [categoryId, value] of categoryChanges.entries()) {
		if (value === "Add") {
			try {
				await addCategory(categoryId, post.id);
			} catch (error) {
				console.error("Failed to add category:", error);
				return { success: false, message: "Failed to add category." };
			}
		} else {
			try {
				await removeCategory(categoryId, post.id);
			} catch (error) {
				console.error("Failed to remove category:", error);
				return { success: false, message: "Failed to remove category." };
			}
		}
	}

	for (const data of contentData) {
		try {
			await upsertContent(data);
		} catch (error) {
			console.error("Failed to upsert content:", error);
			return { success: false, message: "Failed to upsert content." };
		}
	}

	try {
		await updatePost(post);
		revalidatePath(`/admin/dashboard/${post.slug}`);
		revalidatePath(`/posts/${post.slug}`);
	} catch (error) {
		console.error("Failed to update post:", error);
		return { success: false, message: "Failed to update post." };
	}

	return {
		success: true,
		message: "Done saving the post.",
	};
}

export async function createBlankPostAction(
	userId: string,
): Promise<FormState> {
	try {
		await createPost({
			authorId: userId,
			title: "Untitled Post",
			slug: crypto.randomUUID(),
		});

		revalidatePath("/admin/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Failed to create post:", error);
		return { success: false, message: "Failed to create blank post" };
	}
}

export async function deletePostAction(postId: string): Promise<FormState> {
	try {
		await deletePost(postId);

		revalidatePath("/admin/dashboard");

		return { success: true };
	} catch (error) {
		console.error("Failed to delete post:", error);
		return { success: false, message: "Failed to delete post." };
	}
}

export async function readPostAction(postId: string): Promise<FormState> {
	try {
		await readPost(postId);

		return { success: true };
	} catch (error) {
		console.error("Failed to increment read count:", error);
		return { success: false, message: "Failed to increment read count." };
	}
}

export async function featurePostAction(postId: string): Promise<FormState> {
	try {
		await featurePost(postId);

		revalidatePath("/admin/dashboard");
		revalidatePath("/");

		return { success: true };
	} catch (error) {
		console.error("Failed to feature post:", error);
		return { success: false, message: "Failed to feature post." };
	}
}

export async function publishPostAction(
	post: Post,
	categories: Category[],
): Promise<FormState> {
	post.isPublished = !post.isPublished;
	post.publishedAt = post.isPublished ? new Date() : null;

	try {
		await updatePost(post);

		revalidatePath(`/admin/dashboard/${post.slug}`);

		if (post.isPublished) {
			for (const category of categories) {
				const emails = await getEmailsForCategory(category.id);
				const { error } = await resend.emails.send({
					from: "onboarding@resend.dev",
					to: ["johnlloydunida0@gmail.com"],
					subject: `SakugaStation: New post published for ${category.name}`,
					react: PublishedPostEmail({
						postTitle: post.title,
						postUrl: new URL(
							`/posts/${post.slug}`,
							`https://${process.env.VERCEL_URL}`,
						).toString(),
					}),
				});
				console.log("Sent emails:", emails);
				if (error) {
					console.error("Email not sent:", error);
				}
			}
		}

		return { success: true };
	} catch (error) {
		console.error("Failed to publish post:", error);
		return { success: false, message: "Failed to publish post." };
	}
}

export async function toggleCommentApproval(post: Post): Promise<FormState> {
	post.commentApproval = !post.commentApproval;

	try {
		await updatePost(post);

		revalidatePath(`/admin/dashboard/${post.slug}/comments`);
	} catch (error) {
		console.error("Failed to update post:", error);
		return { success: false, message: "Failed to updated post." };
	}

	return { success: true, message: "Toggled comment approval." };
}
