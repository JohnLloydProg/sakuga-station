import { and, count, eq, ilike } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "..";
import { categories, postCategories } from "../schema/categories";
import { type Post, posts } from "../schema/posts";
import type { User } from "../schema/users";

export async function getClientPosts(
	offset: number,
	search?: string,
	limit: number = 6,
): Promise<[ClientPost[], number]> {
	await connection();

	const searchTerm = search ? `%${search}%` : "%";

	try {
		const postsList = await db.query.posts.findMany({
			columns: {
				id: true,
				title: true,
				slug: true,
				body: true,
				reads: true,
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
				isPublished: true,
				title: {
					ilike: searchTerm,
				},
			},
			orderBy: {
				publishedAt: "desc",
			},
			limit: limit,
			offset: offset * 6,
		});

		console.log(`Found ${postsList.length} posts.`);

		return [
			postsList,
			await db.$count(
				posts,
				and(ilike(posts.title, searchTerm), eq(posts.isPublished, true)),
			),
		];
	} catch (error) {
		console.log("Error fetching posts:", error);
		return [[], 0];
	}
}

export async function getClientPostsByCategory(
	category: string,
	offset: number,
	search?: string,
	limit: number = 6,
): Promise<[ClientPost[], number]> {
	await connection();

	const searchTerm = search ? `%${search}%` : "%";

	try {
		const postsList = await db.query.posts.findMany({
			columns: {
				id: true,
				title: true,
				slug: true,
				body: true,
				reads: true,
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
				isPublished: true,
				categories: {
					name: category,
				},
				title: {
					ilike: searchTerm,
				},
			},
			orderBy: {
				publishedAt: "desc",
			},
			limit: limit,
			offset: offset * 6,
		});

		console.log(`Found ${postsList.length} with category ${category}`);

		const [result] = await db
			.select({
				total: count(postCategories.postId),
			})
			.from(postCategories)
			.innerJoin(categories, eq(postCategories.categoryId, categories.id))
			.innerJoin(posts, eq(postCategories.postId, posts.id))
			.where(
				and(
					eq(categories.name, category),
					eq(posts.isPublished, true),
					ilike(posts.title, searchTerm),
				),
			);

		return [postsList, result?.total ?? 0];
	} catch (error) {
		console.log("Error fetching posts:", error);
		return [[], 0];
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
				reads: true,
				commentApproval: true,
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
				isPublished: true,
				slug: slug,
			},
		});
		if (!post) return null;

		console.log(`Found post with slug "${slug}"`);
		const contents: ClientContent[] = post.contents.map((content) => {
			return {
				id: content.id,
				type: content.type.name,
				payload: content.payload,
				index: content.index,
			};
		});

		return { ...post, contents: contents };
	} catch (error) {
		console.log(`Error fetchig post with slug "${slug}":`, error);
		return null;
	}
}

export async function getMostReadPosts(): Promise<Post[]> {
	try {
		const postsList = await db.query.posts.findMany({
			where: {
				isPublished: true,
			},
			orderBy: {
				reads: "desc",
			},
			limit: 3,
		});

		console.log(`Found ${postsList.length} posts.`);

		return postsList;
	} catch (error) {
		console.log("Error fetching posts:", error);
		return [];
	}
}

export async function getPostsByAuthorId(user: User): Promise<Post[]> {
	try {
		let postsList: Post[] = [];

		if (user.isAdmin) {
			postsList = await db.query.posts.findMany({
				orderBy: {
					updatedAt: "desc",
				},
			});
		} else {
			postsList = await db.query.posts.findMany({
				where: {
					authorId: user.id,
				},
				orderBy: {
					updatedAt: "desc",
				},
			});
		}

		console.log(`Returned ${postsList.length} posts`);

		return postsList;
	} catch (error) {
		console.log("Erro fetching posts:", error);
		return [];
	}
}

export async function getPostbyID(postId: string) {
	await connection();

	try {
		const post = await db.query.posts.findFirst({
			where: { id: postId },
			with: {
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
		});
		if (!post) return null;

		console.log("Got post with ID:", post.id);

		return post;
	} catch (error) {
		console.log(`Error while getting post with ID %${postId}: ${error}`);
		return null;
	}
}

export async function getFeaturedPost(): Promise<ClientPost | null> {
	await connection();

	try {
		const post = await db.query.posts.findFirst({
			columns: {
				id: true,
				title: true,
				slug: true,
				body: true,
				reads: true,
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
				isPublished: true,
				isFeatured: true,
			},
		});
		if (!post) return null;

		console.log("Got post with id:", post.id);

		return post;
	} catch (error) {
		console.log("Error while getting featured post:", error);
		return null;
	}
}
