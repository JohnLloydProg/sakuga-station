"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SubNav({ slug }: { slug: string }) {
	const pathname = usePathname();

	const tabs = [
		{ name: "Post Editor", path: `/admin/dashboard/${slug}` },
		{ name: "Comments", path: `/admin/dashboard/${slug}/comments` },
	];

	return (
		<div className="w-full max-w-6xl mb-2 flex mt-5">
			<nav className="inline-flex gap-1 bg-secondary/40 p-1.5 rounded-full border border-secondary/20 shadow-sm mx-auto">
				{tabs.map((tab) => {
					const isActive = pathname === tab.path || pathname === `${tab.path}/`;

					return (
						<Link
							key={tab.name}
							href={tab.path}
							className={`px-6 py-2 rounded-full font-josefin font-bold text-sm transition-all duration-200 ${
								isActive
									? "bg-accent text-background shadow-sm"
									: "text-foreground/80 hover:bg-foreground/5 hover:text-accent"
							}`}
						>
							{tab.name}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
