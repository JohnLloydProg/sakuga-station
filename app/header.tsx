"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore, useState, useEffect } from "react";

function subscribe(callback: () => void) {
	window.addEventListener("resize", callback);
	return () => window.removeEventListener("resize", callback);
}

export function useWindowWidth() {
	return useSyncExternalStore(
		subscribe,
		() => window.innerWidth,
		() => 0,
	);
}

export default function ClientHeader() {
	const currentPath = usePathname();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setIsOpen(false);
	}, [currentPath]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	if (currentPath.includes("/admin")) return null;

	return (
		<header className="sticky top-0 left-0 z-20 w-full bg-secondary border-b border-muted/20 px-6 sm:px-12 py-4 flex items-center justify-between text-foreground">
			<Link href="/" className="flex items-center gap-3 group select-none z-30">
				<Image src="/icon.png" alt="cat-icon" width={48} height={48} />
				<span className="font-josefin text-2xl tracking-tight">
					Sakuga<span className="text-accent ml-0.5 font-bold">Station</span>
				</span>
			</Link>

			<nav className="hidden md:flex items-center gap-6 sm:gap-8 font-lato text-lg font-medium">
				<Link
					href="/"
					className={`transition-colors duration-200 ${
						currentPath === "/"
							? "font-bold text-foreground border-b-2 border-foreground/10 pb-0.5"
							: "hover:text-accent"
					}`}
				>
					Home
				</Link>
				<Link
					href="/posts"
					className={`transition-colors duration-200 ${
						currentPath.includes("/posts")
							? "font-bold text-foreground border-b-2 border-foreground/10 pb-0.5"
							: "hover:text-accent"
					}`}
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

			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex md:hidden flex-col justify-center items-center w-8 h-8 gap-1.5 z-30 focus:outline-none"
				aria-label="Toggle Menu"
			>
				<span
					className={`h-0.5 w-6 bg-foreground rounded transition-transform duration-300 ${
						isOpen ? "transform rotate-45 translate-y-2" : ""
					}`}
				/>
				<span
					className={`h-0.5 w-6 bg-foreground rounded transition-opacity duration-300 ${
						isOpen ? "opacity-0" : ""
					}`}
				/>
				<span
					className={`h-0.5 w-6 bg-foreground rounded transition-transform duration-300 ${
						isOpen ? "transform -rotate-45 -translate-y-2" : ""
					}`}
				/>
			</button>

			<div
				className={`fixed inset-0 bg-background/95 backdrop-blur-md z-20 flex flex-col items-center justify-center transition-all duration-300 ease-in-out md:hidden ${
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
			>
				<nav className="flex flex-col items-center justify-center gap-8 font-lato text-2xl font-medium w-full px-6">
					<Link
						href="/"
						className={`transition-colors duration-200 ${
							currentPath === "/"
								? "font-bold text-foreground border-b-2 border-foreground/10 pb-1"
								: "hover:text-accent"
						}`}
					>
						Home
					</Link>
					<Link
						href="/posts"
						className={`transition-colors duration-200 ${
							currentPath.includes("/posts")
								? "font-bold text-foreground border-b-2 border-foreground/10 pb-1"
								: "hover:text-accent"
						}`}
					>
						Posts
					</Link>

					<button
						type="button"
						className="font-josefin font-bold text-lg px-8 py-2.5 bg-accent text-foreground rounded-full shadow-sm hover:bg-foreground hover:text-background transition-all duration-200 w-4/5 max-w-xs mt-2"
					>
						Subscribe
					</button>
				</nav>
			</div>
		</header>
	);
}
