"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [query, setQuery] = useState(searchParams.get("search") || "");

	const handleSearch = () => {
		const params = new URLSearchParams(searchParams.toString());

		if (query) {
			params.set("search", query);
		} else {
			params.delete("search");
		}

		params.delete("offset");

		router.push(`/posts?${params.toString()}`);
	};

	return (
		<div className="w-full flex gap-5">
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && handleSearch()}
				placeholder="Search Title"
				className="w-full px-4 py-2 bg-secondary text-foreground/80 placeholder-muted font-lato rounded focus:outline-none border border-transparent focus:border-accent/40"
			/>
			<button
				type="button"
				onClick={handleSearch}
				className="px-4 py-2 bg-accent rounded font-josefin font-bold"
			>
				Search
			</button>
		</div>
	);
}
