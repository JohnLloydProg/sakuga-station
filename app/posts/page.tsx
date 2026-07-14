import { Suspense } from "react";
import { CategorySelect, CategorySelectSkeleton } from "./categorySelect";
import { MostRead, MostReadSkeleton } from "./mostRead";
import { PostsGrid, PostsGridSkeleton } from "./postsGrid";
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
	return (
		<div className="w-full max-w-7xl min-h-screen bg-background p-6 md:p-12 font-lato text-foreground flex gap-10 items-start mx-auto">
			<div className="flex flex-col gap-6 w-75/100">
				<SearchBar />
				<Suspense fallback={<PostsGridSkeleton />}>
					<PostsGrid resolvedParams={resolvedParams} />
				</Suspense>
			</div>

			<div className="flex flex-col gap-8 lg:sticky lg:top-30 w-25/100">
				<Suspense fallback={<MostReadSkeleton />}>
					<MostRead />
				</Suspense>

				<Suspense fallback={<CategorySelectSkeleton />}>
					<CategorySelect resolvedParams={resolvedParams} />
				</Suspense>
			</div>
		</div>
	);
}
