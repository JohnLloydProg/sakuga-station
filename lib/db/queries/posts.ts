import { db } from "..";
import { Post } from "../schema/posts";

export async function getClientPosts(): Promise<ClientPost[]> {
	try {
		const clientPostsList: ClientPost[] = [];
		const postsList = await db.query.posts.findMany({
			columns: {
				id: true,
				title: true,
				slug: true,
				body: true,
				thumbnail: true,
				publishedAt: true,
			},
			with: {
				author: {
					columns: {
						id: true,
						email: true,
						firstName: true,
						lastName: true,
					},
				},
				categories: true,
			},
			where: {
				status: "Approved",
			},
		});

		for (const post of postsList) {
			if (!post.publishedAt) continue;

			clientPostsList.push({ ...post, publishedAt: post.publishedAt });
		}

		console.log(`Found ${clientPostsList.length} posts.`);

		return clientPostsList;
	} catch (error) {
		console.log("Error fetching posts:", error);
		return [];
	}
}

export async function getPostsByAuthorId(authorId: string): Promise<Post[]> {
	try {
		const postsList = await db.query.posts.findMany({
			where: {
				authorId: authorId,
			},
		});

		console.log(`Returned ${postsList.length} posts`);

		return postsList;
	} catch (error) {
		console.log("Erro fetching posts:", error);
		return [];
	}
}

export async function getPostbyID(postId: string) {
	try {
		const post = await db.query.posts.findFirst({
			where: { id: postId },
			with: {
				contents: {
					with: {
						type: true,
					},
				},
				categories: true,
			},
		});
		if (!post) return null;

		console.log("Got post with ID:", post.id);

		return post;
	} catch (error) {
		console.log(`Error while getting post with ID %${postId}: ${error}`);
		return null;
	}
}

export async function getClientPostsByCategory(
	category: string,
): Promise<ClientPost[]> {
	try {
		const clientPostsList: ClientPost[] = [];
		const postsList = await db.query.posts.findMany({
			columns: {
				id: true,
				title: true,
				slug: true,
				body: true,
				thumbnail: true,
				publishedAt: true,
			},
			with: {
				author: {
					columns: {
						id: true,
						email: true,
						firstName: true,
						lastName: true,
					},
				},
				categories: true,
			},
			where: {
				status: "Approved",
				categories: {
					name: category,
				},
			},
		});

		for (const post of postsList) {
			if (!post.publishedAt) continue;

			clientPostsList.push({ ...post, publishedAt: post.publishedAt });
		}

		console.log(`Found ${clientPostsList.length} with category ${category}`);

		return clientPostsList;
	} catch (error) {
		console.log("Error fetching posts:", error);
		return [];
	}
}

export async function getClientPostBySlug(
	slug: string,
): Promise<ClientCompletePost | null> {
	try {
		const post = await db.query.posts.findFirst({
			columns: {
				id: true,
				title: true,
				slug: true,
				body: true,
				thumbnail: true,
				publishedAt: true,
			},
			with: {
				author: {
					columns: {
						id: true,
						email: true,
						firstName: true,
						lastName: true,
					},
				},
				contents: {
					with: {
						type: true,
					},
					orderBy: {
						index: "asc",
					},
				},
				categories: true,
			},
			where: {
				slug: slug,
			},
		});
		if (!post || !post.publishedAt) return null;

		console.log(`Found post with slug "${slug}"`);
		const contents: ClientContent[] = post.contents.map((content) => {
			return {
				id: content.id,
				type: content.type.name,
				payload: content.payload,
				index: content.index,
			};
		});

		return { ...post, publishedAt: post.publishedAt, contents: contents };
	} catch (error) {
		console.log(`Error fetchig post with slug "${slug}":`, error);
		return null;
	}
}
