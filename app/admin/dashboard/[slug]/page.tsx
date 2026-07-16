import { notFound } from "next/navigation";
import { getCategories } from "@/lib/db/queries/categories";
import { getContentTypes } from "@/lib/db/queries/content";
import { getPostbyID } from "@/lib/db/queries/posts";
import PostForm from "./postForm";

export default async function PostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	if (!slug) return notFound();

	const post = await getPostbyID(slug);
	if (!post) return notFound();

	const contentTypes = await getContentTypes();
	const categoryTypes = await getCategories();

	if (!post) return notFound();
	return (
		<div className="min-h-screen font-lato text-foreground pb-10">
			<PostForm
				post={post}
				contentTypes={contentTypes}
				categoryTypes={categoryTypes}
			/>
		</div>
	);
}
