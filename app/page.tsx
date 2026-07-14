import { Suspense } from "react";
import { CategoriesSection, CategoriesSkeleton } from "./home/categories";
import {
	CategoryPostsSection,
	CategoryPostsSkeleton,
} from "./home/categoryPosts";
import { FeaturedPostSection, FeaturedPostSkeleton } from "./home/featuredPost";
import { LatestPostsSection, LatestPostsSkeleton } from "./home/latestPosts";

export default async function Home() {
	return (
		<div className="w-full bg-background font-lato text-foreground">
			<section className="bg-accent w-full px-6 py-10 md:py-14 md:px-16 lg:px-24 text-foreground">
				<Suspense fallback={<FeaturedPostSkeleton />}>
					<FeaturedPostSection />
				</Suspense>
			</section>

			<section className="w-full px-6 py-16 md:px-12 max-w-5xl mx-auto">
				<div className="w-full border border-accent/60 rounded-xl p-6 sm:p-10 relative mt-4">
					<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-background px-6">
						<h2 className="font-josefin font-bold text-3xl md:text-4xl text-accent tracking-wide whitespace-nowrap">
							Latest Posts
						</h2>
					</div>
					<Suspense fallback={<LatestPostsSkeleton />}>
						<LatestPostsSection />
					</Suspense>
				</div>
			</section>

			<section className="w-full px-6 pb-16 md:px-12 max-w-6xl mx-auto">
				<Suspense fallback={<CategoryPostsSkeleton />}>
					<CategoryPostsSection />
				</Suspense>
				<div className="w-full text-center mb-8">
					<h2 className="font-josefin font-bold text-3xl md:text-4xl text-accent tracking-wide">
						Other Categories
					</h2>
				</div>
				<Suspense fallback={<CategoriesSkeleton />}>
					<CategoriesSection />
				</Suspense>
			</section>
		</div>
	);
}
