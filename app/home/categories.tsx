import Link from "next/link";
import { getCategories } from "@/lib/db/queries/categories";
import SubscribeModal from "../components/subscriptionForm";

export async function CategoriesSection() {
	const categories = await getCategories();
	return (
		<div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10">
			<div className="w-full max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-3">
				{categories.map((category) => (
					<Link
						href={`/posts?genreFilter=${category.name}`}
						key={category.id}
						className="px-6 py-1.5 bg-background text-accent border border-accent/60 font-josefin font-bold text-lg rounded-full shadow-sm cursor-pointer hover:bg-accent hover:text-foreground transition-colors min-w-32.5 text-center"
					>
						{category.name}
					</Link>
				))}
			</div>
			<SubscribeModal categories={categories} />
		</div>
	);
}

export function CategoriesSkeleton() {
	const widths = [
		"w-32",
		"w-40",
		"w-28.5",
		"w-36",
		"w-44",
		"w-32.5",
		"w-35.5",
		"w-28",
	];

	return (
		<div className="w-full max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-3 animate-pulse">
			{widths.map((width) => (
				<div
					key={width}
					className={`h-10 ${width} bg-accent/20 border border-accent/20 rounded-full shadow-sm`}
				/>
			))}
		</div>
	);
}
