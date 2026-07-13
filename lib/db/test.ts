import { addCategory } from "./mutations/categories";
import { createContent } from "./mutations/contents";
import { createPost, updatePost } from "./mutations/posts";
import {
	getClientPostBySlug,
	getClientPosts,
	getClientPostsByCategory,
	getPostbyID,
	getPostsByAuthorId,
} from "./queries/posts";
import { getUserByEmailPassword } from "./queries/users";

async function createPostTest() {
	const user = await getUserByEmailPassword("admin@gmail.com", "admin12345");
	if (!user) return;

	let post = await createPost({
		authorId: user.id,
		title: "test post",
		slug: "test-post",
		body: "Testing testing",
		thumbnail: "test",
	});
	console.log("Created post", post);

	post = await createPost({
		authorId: user.id,
		title: "test post with categories",
		slug: "test-post-categories",
		body: "Testing testing",
		thumbnail: "test",
	});
	if (!post) return;

	await addCategory("4806b57b-d6b2-4271-9703-7b19dcdba21c", post.id);
}

async function publishPost() {
	const post = await getPostbyID("e1b2a01e-7caf-4e30-8bab-160ce377715b");
	if (!post) return;
	await addCategory("c08089f6-2f8d-4b2b-bd2f-7424b08d4280", post.id);
	await updatePost(post);
}

async function addContent() {
	const post = await getPostbyID("e1b2a01e-7caf-4e30-8bab-160ce377715b");
	if (!post) return;

	await createContent({
		postId: post.id,
		contentId: "6d35e827-e4c0-401c-81ff-6afdc6dd6afd",
		payload: "Testing header",
		index: 0,
	});

	await createContent({
		postId: post.id,
		contentId: "dbec630c-4f6a-49f6-8e05-cb7bcb4d80b6",
		payload: "Testing content",
		index: 1,
	});
}

async function readPostsTest() {
	const user = await getUserByEmailPassword("admin@gmail.com", "admin12345");
	if (!user) return;

	let posts = await getClientPosts();
	console.log("Got all client posts", posts);

	posts = await getClientPostsByCategory("Romance");
	console.log("Got all client posts with romance category", posts);

	const post = await getClientPostBySlug("test-post-categories");
	if (!post) return;
	console.log("Get 1 post by slug", post);

	const adminPosts = await getPostsByAuthorId(user.id);
	console.log("Admin posts", adminPosts);
}

readPostsTest();
