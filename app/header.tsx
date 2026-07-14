"use client";

import { usePathname } from "next/dist/client/components/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
	window.addEventListener("resize", callback);
	return () => window.removeEventListener("resize", callback);
}

export function useWindowWidth() {
	return useSyncExternalStore(
		subscribe,
		() => window.innerWidth, // Client side value
		() => 0, // Server side fallback value (for SSR/Next.js)
	);
}

export default function ClientHeader() {
	const currentPath = usePathname();

	return (
		<header
			className={`sticky top-0 left-0 z-20 w-full bg-secondary border-b border-muted/20 px-6 sm:px-12 py-4 items-center justify-between text-foreground ${currentPath.includes("/admin") ? "hidden" : "flex"}`}
		>
			<Link href="/" className="flex items-center gap-3 group select-none">
				<Image src="/icon.png" alt="cat-icon" width={48} height={48} />

				<span className="font-josefin text-2xl tracking-tight">
					Sakuga<span className="text-accent ml-0.5 font-bold">Station</span>
				</span>
			</Link>

			<nav className="flex items-center gap-6 sm:gap-8 font-lato text-lg font-medium">
				<Link
					href="/"
					className={`transition-colors duration-200 ${currentPath === "/" ? "font-bold text-foreground border-b-2 border-foreground/10 pb-0.5" : "hover:text-accent"}`}
				>
					Home
				</Link>
				<Link
					href="/posts"
					className={`transition-colors duration-200 ${currentPath.includes("/posts") ? "font-bold text-foreground border-b-2 border-foreground/10 pb-0.5" : "hover:text-accent"}`}
				>
					Posts
				</Link>

				<button
					type="button"
					className="font-josefin font-bold text-base px-6 py-1.5 bg-accent text-foreground rounded-full shadow-sm hover:bg-foreground hover:text-background transition-all duration-200 ml-2"
				>
					Subscribe
				</button>
			</nav>
		</header>
	);
}
