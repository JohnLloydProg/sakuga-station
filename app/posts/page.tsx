import Link from "next/link";
import { getCategories } from "@/lib/db/queries/categories";
import {
	getClientPosts,
	getClientPostsByCategory,
	getMostReadPosts,
} from "@/lib/db/queries/posts";
import PostCard from "../components/postCard";
import PaginationNav from "./pagination";
import SearchBar from "./searchBar";

export default async function PostsPage({
	searchParams,
}: {
	searchParams: Promise<{
		genreFilter?: string;
		offset?: string;
		search?: string;
	}>;
}) {
	const resolvedParams = await searchParams;
	const offset = Number(resolvedParams.offset) || 0;
	const createQueryString = (name: string, value: string) => {
		const params = new URLSearchParams(
			resolvedParams as Record<string, string>,
		);
		params.set(name, value);

		return params.toString();
	};
	const genreNotSelected =
		"px-4 py-1 bg-accent text-foreground text-sm font-josefin font-bold rounded hover:bg-foreground hover:text-background transition-colors shadow-sm";
	const genreSelected =
		"px-4 py-1 bg-foreground text-background text-sm font-josefin font-bold rounded shadow-sm";

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

	const mostRead = await getMostReadPosts();
	const genres = await getCategories();

	return (
		<div className="w-full max-w-7xl min-h-screen bg-background p-6 md:p-12 font-lato text-foreground flex gap-10 items-start mx-auto">
			<div className="flex flex-col gap-6 w-75/100">
				<SearchBar />

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

			<div className="flex flex-col gap-8 lg:sticky lg:top-30 w-25/100">
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

				<div className="relative border border-accent/60 rounded-lg p-5 pt-7">
					<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background px-4">
						<h3 className="font-josefin font-bold text-xl text-accent tracking-wide whitespace-nowrap">
							Anime Genres
						</h3>
					</div>

					<div className="flex flex-wrap gap-2">
						{genres.map((genre) => (
							<Link
								href={`/posts?${createQueryString("genreFilter", genre.name)}`}
								key={genre.id}
								className={
									genre.name === resolvedParams.genreFilter
										? genreSelected
										: genreNotSelected
								}
							>
								{genre.name}
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
