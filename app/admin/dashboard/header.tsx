"use client";

import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";

export default function AdminHeader() {
	return (
		<header className="bg-secondary flex justify-center w-full h-15">
			<div className="flex items-center justify-between w-full max-w-6xl">
				<Link href={"/admin/dashboard"} className="flex gap-3">
					<Image src="/icon.png" width={40} height={40} alt="ghilbi icon" />
					<h1 className="font-josefin text-3xl">
						Sakuga<span className="text-accent font-bold">Station</span>
					</h1>
				</Link>
				<button
					type="button"
					className="bg-accent rounded-full text-lg font-josefin hover:bg-foreground hover:text-background font-bold py-1 px-4"
					onClick={async () => {
						await logoutAction();
					}}
				>
					Logout
				</button>
			</div>
		</header>
	);
}
