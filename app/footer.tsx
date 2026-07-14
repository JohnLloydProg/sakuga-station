"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
	const currentPath = usePathname();
	return (
		<footer
			className={`w-full bg-secondary px-6 sm:px-12 py-8 flex-col font-lato text-foreground ${currentPath.includes("/admin") ? "hidden" : "flex"}`}
		>
			<div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 pb-6">
				<Link href="/" className="flex items-center gap-3 select-none">
					<Image src="/icon.png" alt="cat-icon" width={48} height={48} />
					<span className="font-josefin text-2xl font-bold tracking-tight">
						Sakuga<span className="text-accent ml-0.5">Station</span>
					</span>
				</Link>

				<nav className="flex items-center gap-8 font-josefin font-bold text-xl">
					<Link href="/" className="hover:text-accent transition-colors">
						Home
					</Link>
					<Link href="/posts" className="hover:text-accent transition-colors">
						Posts
					</Link>
				</nav>
			</div>

			<div className="w-full border-t border-foreground/20 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs md:text-sm text-muted">
				<span>© 2026 Sakuga Station. All rights reserved.</span>
				<span>Published with Vercel</span>
			</div>
		</footer>
	);
}
