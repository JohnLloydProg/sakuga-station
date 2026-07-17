import { connection } from "next/server";
import { db } from "../index";

export async function getCommentsByPost(postId: string) {
	await connection();

	try {
		const commentsList = await db.query.comments.findMany({
			where: {
				postId: postId,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		console.log(`Found ${commentsList.length} comments for post ${postId}.`);

		return commentsList;
	} catch (error) {
		console.log(`Error fetching comments for post "${postId}":`, error);
		return [];
	}
}

export async function getApprovedCommentsByPost(postId: string) {
	await connection();

	try {
		const commentsList = await db.query.comments.findMany({
			where: {
				postId: postId,
				isApproved: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		console.log(`Found ${commentsList.length} comments for post ${postId}.`);

		return commentsList;
	} catch (error) {
		console.log(`Error fetching comments for post "${postId}":`, error);
		return [];
	}
}
