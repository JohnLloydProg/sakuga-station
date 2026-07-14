import Link from "next/link";
import { getMostReadPosts } from "@/lib/db/queries/posts";

export async function MostRead() {
	const mostRead = await getMostReadPosts();
	return (
		<div className="relative border border-accent/60 rounded-lg p-5 pt-7">
			<div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-background px-4">
				<h3 className="font-josefin font-bold text-xl text-accent tracking-wide">
					Most Read
				</h3>
			</div>

			<ul className="space-y-4">
				{mostRead.map((post, index) => (
					<Link
						key={post.id}
						href={`/posts/${post.slug}`}
						className="flex gap-3 items-start group cursor-pointer"
					>
						<span className="font-josefin font-black text-2xl text-accent/50 group-hover:text-accent transition-colors leading-none">
							{index + 1}
						</span>
						<p className="text-sm font-medium leading-snug group-hover:underline">
							{post.title}
						</p>
					</Link>
				))}
			</ul>
		</div>
	);
}

export function MostReadSkeleton() {
	return (
		<div className="relative border border-accent/30 rounded-lg p-5 pt-7">
			<div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-background px-4">
				<div className="h-6 bg-accent/30 rounded w-24" />
			</div>

			<div className="space-y-5">
				{[1, 2, 3].map((num) => (
					<div key={num} className="flex gap-3 items-center">
						<div className="h-6 bg-accent/20 rounded w-4 shrink-0" />
						<div className="h-4 bg-secondary/60 rounded w-full" />
					</div>
				))}
			</div>
		</div>
	);
}
