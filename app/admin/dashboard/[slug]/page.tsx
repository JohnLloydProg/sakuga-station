import { getPostbyID } from "@/lib/db/queries/posts";
import PostForm from "./postForm";
import { notFound } from "next/navigation";
import { getContentTypes } from "@/lib/db/queries/content";
import { getCategories } from "@/lib/db/queries/categories";

export default async function PostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const post = await getPostbyID(slug);
	const contentTypes = await getContentTypes();
	const categoryTypes = await getCategories();

	if (!post) return notFound();
	return (
		<div className="min-h-screen font-lato text-foreground">
			<PostForm
				post={post}
				contentTypes={contentTypes}
				categoryTypes={categoryTypes}
			/>
		</div>
	);
}
