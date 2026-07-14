import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommentsByPost } from "@/lib/db/queries/comments";
import { getClientPostBySlug } from "@/lib/db/queries/posts";
import CommentForm from "./commentForm";
import ReadTrigger from "./readTrigger";

export default async function PostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const post = await getClientPostBySlug(slug);
	if (!post) return notFound();

	const comments = await getCommentsByPost(post.id);

	return (
		<article className="w-full min-h-screen bg-background px-4 py-8 md:py-12 text-foreground font-lato max-w-6xl mx-auto">
			<ReadTrigger postId={post.id} />
			<div className="w-full lg:w-4/5 aspect-video bg-secondary rounded-lg overflow-hidden shadow-sm mb-8 relative border border-secondary/40 mx-auto">
				<Image
					src={post.thumbnail || "/next.svg"}
					alt={post.title}
					fill
					className="w-full h-full object-contain"
				/>
			</div>

			<h1 className="font-josefin text-3xl lg:text-5xl font-bold tracking-wider mb-4">
				{post.title}
			</h1>

			<div className="flex flex-wrap gap-3 mb-6">
				{post.categories.map((category) => (
					<Link
						key={category.id}
						href={`/posts?genreFilter=${category.name}`}
						className="px-5 py-1 bg-accent text-foreground text-base font-josefin font-medium rounded shadow-sm cursor-pointer hover:bg-foreground hover:text-background transition-colors"
					>
						{category.name}
					</Link>
				))}
			</div>

			<div className="w-full border-t border-b border-foreground/20 py-3 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm md:text-base font-medium">
				<span className="font-bold tracking-wide">
					{`${post.author.firstName} ${post.author.lastName}`}
				</span>

				<span className="text-foreground/80 font-normal">
					Last Update on{" "}
					{post.publishedAt?.toDateString() || "NO PUBLICATION DATE"}
				</span>
			</div>

			<p className="prose max-w-none text-foreground/90 text-base md:text-lg leading-relaxed">
				{post.body}
			</p>

			{post.contents.map((content) => {
				if (content.type === "Header")
					return (
						<div key={content.id} className="mt-5 mb-2">
							<h2 className="font-josefin lg:text-3xl font-bold">
								{content.payload}
							</h2>
						</div>
					);

				if (content.type === "Paragraph")
					return (
						<p
							key={content.id}
							className="prose max-w-none text-foreground/90 text-base md:text-lg leading-relaxed"
						>
							{content.payload}
						</p>
					);

				if (content.type === "Picture")
					return (
						<div
							key={content.id}
							className="w-2/3 aspect-video bg-secondary rounded-lg overflow-hidden shadow-sm mb-8 relative border border-secondary/40 mx-auto"
						>
							<Image
								src={content.payload}
								alt="Content Picture"
								fill
								className="w-full h-full object-contain"
							/>
						</div>
					);

				return (
					<h3 key={content.id}>
						Can't identify content of type {content.type}
					</h3>
				);
			})}

			<div className="flex flex-col mt-16 border-t border-secondary pt-10">
				<h2 className="font-josefin font-bold text-3xl mb-6">Comments</h2>

				<CommentForm post={post} />

				<div className="space-y-4">
					{comments.map((comment) => (
						<div
							key={comment.id}
							className="p-4 border-b border-secondary/50 flex flex-col gap-1"
						>
							<div className="flex justify-between items-baseline">
								<span className="font-josefin font-bold text-base text-foreground">
									{comment.authorName || "Anonymous"}
								</span>
								<span className="text-xs text-muted">
									{comment.createdAt.toLocaleString()}
								</span>
							</div>
							<p className="text-sm text-foreground/80 leading-relaxed">
								{comment.body}
							</p>
						</div>
					))}
				</div>
			</div>
		</article>
	);
}
