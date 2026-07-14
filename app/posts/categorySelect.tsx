import Link from "next/link";
import { getCategories } from "@/lib/db/queries/categories";

export async function CategorySelect({
	resolvedParams,
}: {
	resolvedParams: {
		genreFilter?: string | undefined;
		offset?: string | undefined;
		search?: string | undefined;
	};
}) {
	const genreNotSelected =
		"px-4 py-1 bg-accent text-foreground text-sm font-josefin font-bold rounded hover:bg-foreground hover:text-background transition-colors shadow-sm";
	const genreSelected =
		"px-4 py-1 bg-foreground text-background text-sm font-josefin font-bold rounded shadow-sm";

	const genres = await getCategories();

	const createQueryString = (name: string, value: string) => {
		const params = new URLSearchParams(
			resolvedParams as Record<string, string>,
		);
		params.set(name, value);

		return params.toString();
	};

	return (
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
	);
}

export function CategorySelectSkeleton() {
	return (
		<div className="relative border border-accent/30 rounded-lg p-5 pt-7">
			<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-background px-4">
				<div className="h-6 bg-accent/30 rounded w-28" />
			</div>

			<div className="flex flex-wrap gap-2">
				{[1, 2, 3, 4, 5, 6, 7, 8].map((num, i) => {
					const widths = ["w-14", "w-16", "w-20", "w-12", "w-24"];
					const randomWidth = widths[i % widths.length];

					return (
						<div
							key={num}
							className={`h-7 ${randomWidth} bg-accent/20 rounded-md`}
						/>
					);
				})}
			</div>
		</div>
	);
}
