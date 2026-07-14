import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/db/queries/categories";
import {
	getClientPosts,
	getClientPostsByCategory,
	getFeaturedPost,
} from "@/lib/db/queries/posts";
import PostCard from "./posts/postCard";

export default async function Home() {
	const featuredPost = await getFeaturedPost();
	const [latestPosts, _] = await getClientPosts(0, "", 3);
	const categories = await getCategories();
	const featuredCategories = ["Isekai", "Shounen", "Slice of Life"];
	const categoryPosts: Map<string, ClientPost[]> = new Map();

	for (const category of featuredCategories) {
		const [posts, _] = await getClientPostsByCategory(category, 0, "", 3);
		categoryPosts.set(category, posts);
	}

	return (
		<div className="w-full bg-background font-lato text-foreground">
			<section className="bg-accent w-full px-6 py-10 md:py-14 md:px-16 lg:px-24 text-foreground">
				<div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center justify-between">
					<div className="flex-1 space-y-4 w-3/5">
						<div className="flex items-center gap-2 text-sm opacity-80 font-medium">
							<span className="h-0.5 w-6 bg-secondary"></span>
							<span className="font-josefin uppercase tracking-wider text-secondary">
								Featured Post
							</span>
						</div>

						<h1 className="font-josefin text-4xl md:text-5xl font-bold tracking-tight text-foreground">
							{featuredPost?.title}
						</h1>

						<p className="text-sm opacity-60 font-medium">
							{featuredPost?.publishedAt?.toDateString()}
						</p>

						<p className="max-w-xl text-base leading-relaxed opacity-90">
							{featuredPost?.body}
						</p>

						<div className="flex gap-3">
							{featuredPost?.categories.map((category) => (
								<span
									key={category.id}
									className="px-4 py-1 bg-foreground/10 backdrop-blur-sm text-sm font-josefin font-semibold rounded-full"
								>
									{category.name}
								</span>
							))}
						</div>

						<div className="pt-4">
							<Link
								href={`/posts/${featuredPost?.slug}`}
								type="button"
								className="px-8 py-3 bg-background text-foreground font-josefin font-bold text-lg rounded shadow-sm hover:bg-secondary transition-colors"
							>
								Read the full post
							</Link>
						</div>
					</div>

					<div className="w-2/5 flex justify-center md:justify-end relative shrink-0">
						<div className="w-full aspect-video rounded-lg overflow-hidden shadow-xl bg-secondary relative border border-background/20">
							<Image
								src={featuredPost?.thumbnail || "/next.svg"}
								alt="Featured Post Key Art"
								width={1000}
								height={600}
								className="w-full h-full object-contain"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="w-full px-6 py-16 md:px-12 max-w-5xl mx-auto">
				<div className="w-full border border-accent/60 rounded-xl p-6 sm:p-10 relative mt-4">
					<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-background px-6">
						<h2 className="font-josefin font-bold text-3xl md:text-4xl text-accent tracking-wide whitespace-nowrap">
							Latest Posts
						</h2>
					</div>

					<div className="flex flex-col lg:flex-row gap-8 items-stretch pt-4">
						{latestPosts.at(0) && <PostCard post={latestPosts.at(0)!} />}

						<div className="w-full lg:w-1/2 flex flex-col justify-between gap-6 shrink-0">
							{latestPosts.slice(1).map((post) => (
								<Link
									href={`/posts/${post.slug}`}
									key={post.id}
									className="w-full relative aspect-video rounded-xl overflow-hidden group shadow-sm bg-muted/20"
								>
									<Image
										src={post.thumbnail || "/next.svg"}
										alt={post.title}
										width={1000}
										height={600}
										className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-300"
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
				</div>
			</section>

			<section className="w-full px-6 pb-16 md:px-12 max-w-6xl mx-auto">
				<div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-16">
					{[...categoryPosts.entries()].map(([category, posts]) => (
						<div
							key={category}
							className="w-full bg-secondary/50 rounded-xl p-5 flex flex-col items-center h-full"
						>
							<h3 className="font-josefin font-bold text-2xl text-accent mb-5 tracking-wide text-center">
								{category}
							</h3>

							<div className="w-full flex flex-col gap-5 mb-6">
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

				<div className="w-full text-center mb-8">
					<h2 className="font-josefin font-bold text-3xl md:text-4xl text-accent tracking-wide">
						Other Categories
					</h2>
				</div>

				<div className="w-full max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-3">
					{categories.map((category) => (
						<Link
							href={`/posts?genreFilter=${category.name}`}
							key={category.id}
							className="px-6 py-1.5 bg-background text-accent border border-accent/60 font-josefin font-bold text-lg rounded-full shadow-sm cursor-pointer hover:bg-accent hover:text-foreground transition-colors min-w-[130px] text-center"
						>
							{category.name}
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
