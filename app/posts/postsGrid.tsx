import {
	getClientPosts,
	getClientPostsByCategory,
} from "@/lib/db/queries/posts";
import PostCard from "../components/postCard";
import PaginationNav from "./pagination";

export async function PostsGrid({
	resolvedParams,
}: {
	resolvedParams: {
		genreFilter?: string | undefined;
		offset?: string | undefined;
		search?: string | undefined;
	};
}) {
	const offset = Number(resolvedParams.offset) || 0;
	let posts: ClientPost[] = [];
	let total = 0;
	if (resolvedParams.genreFilter) {
		[posts, total] = await getClientPostsByCategory(
			resolvedParams.genreFilter,
			offset,
			resolvedParams.search,
		);
	} else {
		[posts, total] = await getClientPosts(offset, resolvedParams.search);
	}
	return (
		<div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{posts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>

			<PaginationNav
				offset={offset}
				total={total}
				resolvedParams={resolvedParams}
			/>
		</div>
	);
}

export function PostsGridSkeleton() {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{[1, 2, 3, 4].map((num) => (
				<article
					key={num}
					className="bg-secondary/40 w-full rounded-xl p-4 border border-secondary/20 shadow-sm flex flex-col justify-between"
				>
					<div className="w-full aspect-16/10 bg-muted/20 rounded-lg mb-4" />
					<div className="flex-1 flex flex-col justify-between">
						<div className="mb-4 space-y-3">
							<div className="h-6 bg-accent/20 rounded w-5/6" />
							<div className="h-6 bg-accent/20 rounded w-1/2" />

							<div className="space-y-2 pt-2">
								<div className="h-3.5 bg-secondary/70 rounded w-full" />
								<div className="h-3.5 bg-secondary/70 rounded w-full" />
								<div className="h-3.5 bg-secondary/70 rounded w-11/12" />
								<div className="h-3.5 bg-secondary/70 rounded w-4/5" />
							</div>
						</div>

						<div className="w-full h-10 bg-accent/30 rounded-full" />
					</div>
				</article>
			))}
		</div>
	);
}
