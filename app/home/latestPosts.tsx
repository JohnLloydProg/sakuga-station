import Image from "next/image";
import Link from "next/link";
import { getClientPosts } from "@/lib/db/queries/posts";
import PostCard from "../components/postCard";

export async function LatestPostsSection() {
	const [latestPosts, _] = await getClientPosts(0, "", 3);
	const latest = latestPosts.at(0);

	return (
		<div className="flex flex-col lg:flex-row gap-8 items-stretch pt-4">
			{latest && <PostCard post={latest} />}

			<div className="w-full lg:w-1/2 flex flex-col justify-between gap-6 shrink-0">
				{latestPosts.slice(1).map((post) => (
					<Link
						href={`/posts/${post.slug}`}
						key={post.id}
						className="w-full relative aspect-video rounded-xl overflow-hidden group shadow-sm bg-muted/20"
					>
						<Image
							src={post.thumbnail || "/image-placeholder.png"}
							alt={post.title}
							width={1000}
							height={600}
							className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
						/>

						<div className="absolute top-0 left-0 right-0 bg-background/60 backdrop-blur-md p-4 text-center border-b border-background/20">
							<h4 className="font-josefin font-bold text-lg md:text-xl text-foreground max-w-xs mx-auto leading-tight">
								{post.title}
							</h4>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}

export function LatestPostsSkeleton() {
	return (
		<div className="flex flex-col lg:flex-row gap-8 items-stretch pt-4 animate-pulse">
			<div className="w-full lg:w-1/2 flex-1 bg-secondary/40 rounded-xl p-4 border border-secondary/20 shadow-sm flex flex-col justify-between">
				<div className="w-full aspect-16/10 lg:aspect-video bg-muted/20 rounded-lg mb-4" />
				<div className="flex-1 flex flex-col justify-between">
					<div className="mb-4 space-y-3">
						<div className="h-6 md:h-8 bg-accent/20 rounded w-5/6" />
						<div className="h-6 md:h-8 bg-accent/20 rounded w-1/2" />

						<div className="space-y-2 pt-2">
							<div className="h-3.5 bg-secondary/70 rounded w-full" />
							<div className="h-3.5 bg-secondary/70 rounded w-11/12" />
							<div className="h-3.5 bg-secondary/70 rounded w-4/5" />
						</div>
					</div>

					<div className="w-full h-10 bg-accent/30 rounded-full mt-4" />
				</div>
			</div>

			<div className="w-full lg:w-1/2 flex flex-col justify-between gap-6 shrink-0">
				{[1, 2].map((num) => (
					<div
						key={num}
						className="w-full relative aspect-video rounded-xl overflow-hidden shadow-sm bg-muted/20 border border-secondary/20"
					>
						<div className="absolute top-0 left-0 right-0 bg-background/60 p-4 border-b border-background/20 flex flex-col items-center gap-2">
							<div className="h-5 md:h-6 bg-accent/20 rounded w-2/3 max-w-xs" />
							<div className="h-5 md:h-6 bg-accent/20 rounded w-1/2 max-w-xs" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
