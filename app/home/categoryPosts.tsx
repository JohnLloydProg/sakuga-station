import Image from "next/image";
import Link from "next/link";
import { getClientPostsByCategory } from "@/lib/db/queries/posts";

export async function CategoryPostsSection() {
	const featuredCategories = ["Isekai", "Shounen", "Slice of Life"];
	const categoryPosts: Map<string, ClientPost[]> = new Map();

	for (const category of featuredCategories) {
		const [posts, _] = await getClientPostsByCategory(category, 0, "", 3);
		categoryPosts.set(category, posts);
	}
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
			{[...categoryPosts.entries()].map(([category, posts]) => (
				<div
					key={category}
					className="w-full bg-secondary/50 rounded-xl p-5 flex flex-col items-center h-full"
				>
					<h3 className="font-josefin font-bold text-2xl text-accent mb-5 tracking-wide text-center">
						{category}
					</h3>

					<div className="w-full flex flex-col gap-5 mb-6 flex-1">
						{posts.map((post) => (
							<Link
								href={`/posts/${post.slug}`}
								key={post.id}
								className="w-full flex flex-col items-center text-center"
							>
								<div className="w-full aspect-video rounded overflow-hidden bg-muted/40 mb-2 border border-secondary">
									<Image
										src={post.thumbnail || "/next.svg"}
										alt={post.title}
										width={300}
										height={200}
										className="w-full h-full object-contain"
									/>
								</div>
								<h4 className="font-josefin font-bold text-base leading-tight px-2 line-clamp-2">
									{post.title}
								</h4>
							</Link>
						))}
					</div>

					<Link
						href={`/posts?genreFilter=${category}`}
						type="button"
						className="w-4/5 py-1.5 bg-accent text-foreground text-center font-josefin font-bold text-lg rounded shadow-sm hover:bg-foreground hover:text-background transition-colors"
					>
						See More
					</Link>
				</div>
			))}
		</div>
	);
}

export function CategoryPostsSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-pulse">
			{[1, 2, 3].map((num) => (
				<div
					key={num}
					className="w-full bg-secondary/50 rounded-xl p-5 flex flex-col items-center h-full"
				>
					<div className="h-8 w-40 bg-accent/30 rounded mb-5" />

					<div className="w-full flex flex-col gap-5 mb-6 flex-1">
						{[1, 2, 3].map((num) => (
							<div key={num} className="w-full flex flex-col items-center">
								<div className="w-full aspect-video rounded overflow-hidden bg-muted/20 mb-3 border border-secondary/20" />

								<div className="flex flex-col items-center w-full gap-2 px-2">
									<div className="h-4 bg-secondary/70 rounded w-full" />
									<div className="h-4 bg-secondary/70 rounded w-4/5" />
								</div>
							</div>
						))}
					</div>

					<div className="w-4/5 h-10 bg-accent/20 rounded shadow-sm mt-auto" />
				</div>
			))}
		</div>
	);
}
