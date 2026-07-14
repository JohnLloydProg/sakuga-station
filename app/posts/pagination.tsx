"use client";

import { useRouter } from "next/navigation";

export default function PaginationNav({
	offset,
	total,
	resolvedParams,
}: {
	offset: number;
	total: number;
	resolvedParams: {
		genreFilter?: string;
		offset?: string;
		search?: string;
	};
}) {
	const createQueryString = (name: string, value: string) => {
		const params = new URLSearchParams(
			resolvedParams as Record<string, string>,
		);
		params.set(name, value);

		return params.toString();
	};
	const router = useRouter();
	return (
		<div className="flex items-center justify-center gap-4 pt-6 select-none">
			<button
				type="button"
				className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors shadow-sm"
				disabled={offset === 0}
				onClick={() => {
					if (offset === 0) return;
					router.push(
						`/posts?${createQueryString("offset", String(offset - 1))}`,
					);
				}}
			>
				‹
			</button>

			<span className="font-josefin text-sm font-semibold tracking-wide">
				Page {offset + 1} of {Math.ceil(total / 6)}
			</span>

			<button
				type="button"
				className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors shadow-sm"
				disabled={(offset + 1) * 6 > total}
				onClick={() => {
					if (offset * 6 > total) return;
					router.push(
						`/posts?${createQueryString("offset", String(offset + 1))}`,
					);
				}}
			>
				›
			</button>
		</div>
	);
}
