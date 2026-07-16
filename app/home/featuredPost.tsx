import Image from "next/image";
import Link from "next/link";
import { getFeaturedPost } from "@/lib/db/queries/posts";

export async function FeaturedPostSection() {
	const featuredPost = await getFeaturedPost();
	if (!featuredPost) return null;

	return (
		<div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-10 items-center justify-between">
			<div className="w-full md:w-2/5 flex justify-center md:justify-end relative shrink-0 order-first md:order-last">
				<div className="w-full aspect-video rounded-lg overflow-hidden shadow-xl bg-secondary relative border border-background/20">
					<Image
						src={featuredPost?.thumbnail || "/next.svg"}
						alt="Featured Post Key Art"
						width={1000}
						height={600}
						className="w-full h-full object-contain"
						priority
					/>
				</div>
			</div>

			<div className="flex-1 space-y-4 w-full md:w-3/5">
				<div className="flex items-center gap-2 text-xs md:text-sm opacity-80 font-medium">
					<span className="h-0.5 w-6 bg-secondary"></span>
					<span className="font-josefin uppercase tracking-wider text-secondary">
						Featured Post
					</span>
				</div>

				<h1 className="font-josefin text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
					{featuredPost?.title}
				</h1>

				<p className="text-xs md:text-sm opacity-60 font-medium">
					{featuredPost?.publishedAt?.toDateString()}
				</p>

				<p className="max-w-xl text-sm md:text-base leading-relaxed opacity-90 line-clamp-4 md:line-clamp-none">
					{featuredPost?.body}
				</p>

				<div className="flex flex-wrap gap-2 md:gap-3">
					{featuredPost?.categories.map((category) => (
						<span
							key={category.id}
							className="px-3 py-0.5 md:px-4 md:py-1 bg-foreground/10 backdrop-blur-sm text-xs md:text-sm font-josefin font-semibold rounded-full"
						>
							{category.name}
						</span>
					))}
				</div>

				<div className="pt-2 md:pt-4">
					<Link
						href={`/posts/${featuredPost?.slug}`}
						className="w-full md:w-auto text-center inline-block px-8 py-3 bg-background text-foreground font-josefin font-bold text-base md:text-lg rounded shadow-sm hover:bg-secondary transition-colors"
					>
						Read the full post
					</Link>
				</div>
			</div>
		</div>
	);
}

export function FeaturedPostSkeleton() {
	return (
		<div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 md:gap-10 items-center justify-between animate-pulse">
			<div className="w-full md:w-2/5 flex justify-center md:justify-end relative shrink-0 order-first md:order-last">
				<div className="w-full aspect-video rounded-lg bg-muted/20 border border-secondary/20 shadow-xl" />
			</div>

			<div className="flex-1 space-y-4 w-full md:w-3/5">
				<div className="flex items-center gap-2">
					<span className="h-0.5 w-6 bg-accent/30 rounded"></span>
					<div className="h-4 w-28 bg-accent/30 rounded" />
				</div>

				<div className="space-y-3 pt-1">
					<div className="h-8 md:h-12 w-11/12 bg-accent/20 rounded" />
					<div className="h-8 md:h-12 w-3/4 bg-accent/20 rounded" />
				</div>

				<div className="h-4 w-24 bg-secondary/60 rounded" />

				<div className="space-y-2.5 max-w-xl pt-2">
					<div className="h-3.5 w-full bg-secondary/70 rounded" />
					<div className="h-3.5 w-full bg-secondary/70 rounded" />
					<div className="h-3.5 w-11/12 bg-secondary/70 rounded" />
					<div className="h-3.5 w-4/5 bg-secondary/70 rounded" />
				</div>

				<div className="flex gap-3 pt-2">
					<div className="h-7 w-20 bg-accent/20 rounded-full" />
					<div className="h-7 w-16 bg-accent/20 rounded-full" />
				</div>

				<div className="pt-2 md:pt-4">
					<div className="h-11 md:h-12 w-full md:w-48 bg-secondary/50 rounded shadow-sm" />
				</div>
			</div>
		</div>
	);
}
