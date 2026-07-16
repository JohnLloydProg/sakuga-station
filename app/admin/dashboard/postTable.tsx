"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import {
	createBlankPostAction,
	deletePostAction,
	featurePostAction,
} from "@/lib/actions/post";
import type { Post } from "@/lib/db/schema/posts";
import type { User } from "@/lib/db/schema/users";

export default function PostTable({
	posts,
	user,
}: {
	posts: Post[];
	user: User;
}) {
	const [selectedPost, selectPost] = useState<Post | null>(null);

	return (
		<div className="w-full">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
				<h1 className="font-josefin text-3xl md:text-4xl font-bold text-accent">
					Your Posts
				</h1>

				<div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
					{user.isAdmin && (
						<button
							type="button"
							className="flex-1 md:flex-none px-4 md:px-6 py-2 bg-accent text-foreground font-josefin font-bold rounded-md hover:bg-foreground hover:text-background transition text-sm md:text-base disabled:opacity-50 disabled:pointer-events-none"
							onClick={async () => {
								if (!selectedPost) return;
								await featurePostAction(selectedPost.id);
							}}
							disabled={selectedPost === null}
						>
							Feature
						</button>
					)}
					<button
						type="button"
						className="flex-1 md:flex-none px-4 md:px-6 py-2 bg-accent text-foreground font-josefin font-bold rounded-md hover:bg-foreground hover:text-background transition text-sm md:text-base disabled:opacity-50 disabled:pointer-events-none"
						onClick={async () => {
							if (!selectedPost) return;
							await deletePostAction(selectedPost.id);
						}}
						disabled={selectedPost === null}
					>
						Delete
					</button>
					<button
						type="button"
						className="flex-1 md:flex-none px-4 md:px-6 py-2 bg-accent text-foreground font-josefin font-bold rounded-md hover:bg-foreground hover:text-background transition text-sm md:text-base"
						onClick={async () => {
							await createBlankPostAction(user.id);
						}}
					>
						New
					</button>
					<button
						type="button"
						className="flex-1 md:flex-none px-4 md:px-6 py-2 bg-accent text-foreground font-josefin font-bold rounded-md hover:bg-foreground hover:text-background transition text-sm md:text-base disabled:opacity-50 disabled:pointer-events-none"
						onClick={() => {
							if (!selectedPost) return;
							redirect(`/admin/dashboard/${selectedPost.id}`);
						}}
						disabled={selectedPost === null}
					>
						View
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-4 md:hidden">
				{posts.map((post) => {
					const isSelected = selectedPost?.id === post.id;
					return (
						<button
							type="button"
							key={`mobile-${post.id}`}
							onClick={() => selectPost(post)}
							className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer ${
								isSelected
									? "bg-secondary/80 border-accent shadow-sm"
									: "bg-secondary/30 border-secondary/50 hover:bg-secondary/50"
							}`}
						>
							<div className="flex justify-between items-start gap-3 mb-3">
								<h3 className="font-josefin font-bold text-lg text-foreground leading-tight">
									{post.title}
								</h3>
								{post.isFeatured && (
									<span className="shrink-0 font-josefin font-semibold text-[10px] rounded-full px-2 py-0.5 bg-accent text-foreground">
										Featured
									</span>
								)}
							</div>

							<div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium border-t border-secondary/40 pt-3 text-foreground/80">
								<div>
									<span className="text-foreground/50 block font-josefin">
										Reads
									</span>
									<span className="text-sm font-semibold">{post.reads}</span>
								</div>
								<div>
									<span className="text-foreground/50 block font-josefin">
										Created On
									</span>
									<span>{post.createdAt.toLocaleDateString()}</span>
								</div>
								<div>
									<span className="text-foreground/50 block font-josefin">
										Last Update
									</span>
									<span>{post.updatedAt.toLocaleDateString()}</span>
								</div>
								<div>
									<span className="text-foreground/50 block font-josefin">
										Published On
									</span>
									<span>{post.publishedAt?.toLocaleDateString() || "-"}</span>
								</div>
							</div>
						</button>
					);
				})}
			</div>

			<div className="hidden md:flex flex-col w-full overflow-hidden rounded-xl border border-accent/20">
				<div className="grid grid-cols-[3fr_0.5fr_1fr_1fr_1fr] text-center items-center bg-accent text-foreground">
					<div className="font-josefin font-bold py-4 text-left pl-6">
						Post Title
					</div>
					<div className="font-josefin font-bold py-4 border-l border-background/20">
						Reads
					</div>
					<div className="font-josefin font-bold py-4 border-l border-background/20">
						Created On
					</div>
					<div className="font-josefin font-bold py-4 border-l border-background/20">
						Last Update
					</div>
					<div className="font-josefin font-bold py-4 border-l border-background/20">
						Published On
					</div>
				</div>

				{posts.map((post, index) => {
					const rowBg = index % 2 === 0 ? "bg-secondary/50" : "bg-background";
					const isSelected = selectedPost?.id === post.id;
					const borderBottom =
						index === posts.length - 1 ? "" : "border-b border-accent/20";

					return (
						<button
							type="button"
							key={`desktop-${post.id}`}
							onClick={() => selectPost(post)}
							className={`grid grid-cols-[3fr_0.5fr_1fr_1fr_1fr] text-center items-stretch ${rowBg} cursor-pointer hover:bg-secondary/80 transition-colors duration-150 group ${borderBottom} ${
								isSelected ? "bg-secondary/80" : "bg-transparent"
							}`}
						>
							<div
								className={`flex items-center gap-5 py-5 text-left px-6 font-medium border-accent group-hover:text-accent font-josefin transition-colors ${
									isSelected ? "text-accent" : "text-foreground"
								}`}
							>
								<p className="h-fit leading-tight">{post.title}</p>
								{post.isFeatured && (
									<span className="shrink-0 font-josefin font-semibold text-xs rounded-full px-3 py-1 bg-accent group-hover:bg-foreground group-hover:text-background transition-colors">
										Featured
									</span>
								)}
							</div>
							<div className="flex items-center justify-center py-5 border-l border-accent">
								{post.reads}
							</div>
							<div className="flex items-center justify-center py-5 border-l border-accent">
								{post.createdAt.toLocaleDateString()}
							</div>
							<div className="flex items-center justify-center py-5 border-l border-accent">
								{post.updatedAt.toLocaleDateString()}
							</div>
							<div className="flex items-center justify-center py-5 border-l border-accent">
								{post.publishedAt?.toLocaleDateString() || "-"}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
