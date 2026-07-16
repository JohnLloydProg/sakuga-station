import Image from "next/image";
import Link from "next/link";

export default function PostCard({ post }: { post: ClientPost }) {
	return (
		<article className="bg-secondary/40 w-full rounded-xl overflow-hidden p-4 border border-secondary/20 shadow-sm flex flex-col justify-between">
			<div className="w-full aspect-16/10 bg-muted/20 rounded-lg overflow-hidden mb-4 relative">
				<Image
					src={post.thumbnail ? post.thumbnail : "/image-placeholder.png"}
					alt={post.title}
					fill
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-4" />
			</div>

			<div className="flex-1 flex flex-col justify-between">
				<div className="mb-4">
					<h2 className="font-josefin font-bold text-xl leading-snug mb-2 hover:text-accent transition-colors cursor-pointer">
						{post.title}
					</h2>
					<p className="text-sm text-foreground/80 line-clamp-4 leading-relaxed">
						{post.body}
					</p>
				</div>

				<Link
					href={`/posts/${post.slug}`}
					className="w-full py-2 bg-accent text-foreground font-josefin font-bold text-center rounded-full hover:bg-foreground hover:text-background transition-all duration-200"
				>
					Start Reading
				</Link>
			</div>
		</article>
	);
}
