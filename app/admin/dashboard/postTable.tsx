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
		<div>
			<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
				<h1 className="font-josefin text-4xl font-bold text-accent">
					Your Posts
				</h1>

				<div className="flex items-center gap-3">
					{user.isAdmin && (
						<button
							type="button"
							className="px-6 py-2 bg-accent text-foreground font-josefin font-bold rounded-md hover:bg-foreground hover:text-background transition"
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
						className="px-6 py-2 bg-accent text-foreground font-josefin font-bold rounded-md hover:bg-foreground hover:text-background transition"
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
						className="px-6 py-2 bg-accent text-foreground font-josefin font-bold rounded-md hover:bg-foreground hover:text-background transition"
						onClick={async () => {
							await createBlankPostAction(user.id);
						}}
					>
						New
					</button>
					<button
						type="button"
						className="px-6 py-2 bg-accent text-foreground font-josefin font-bold rounded-md hover:bg-foreground hover:text-background transition"
						onClick={() => {
							if (!selectedPost) return;

							redirect(`/admin/dashboard/${selectedPost?.id}`);
						}}
						disabled={selectedPost === null}
					>
						View
					</button>
				</div>
			</div>

			<div className="min-w-200 w-full flex flex-col">
				<div className="grid grid-cols-[3fr_0.5fr_1fr_1fr_1fr] text-center items-center">
					<div className="bg-accent font-josefin font-bold py-4 text-left pl-6 rounded-tl-xl">
						Post Title
					</div>
					<div className="bg-accent font-josefin font-bold py-4 border-l border-background">
						Reads
					</div>
					<div className="bg-accent font-josefin font-bold py-4 border-l border-background">
						Created On
					</div>
					<div className="bg-accent font-josefin font-bold py-4 border-l border-background">
						Last Update
					</div>
					<div className="bg-accent font-josefin font-bold py-4 border-l border-background rounded-tr-xl">
						Published On
					</div>
				</div>

				{posts.map((post, index) => {
					const rowBg = index % 2 === 0 ? "bg-secondary/50" : "bg-background";
					const borderbottom = index === posts.length - 1 ? "border-b" : "";

					return (
						<button
							type="button"
							key={post.id}
							onClick={() => selectPost(post)}
							className={`grid grid-cols-[3fr_0.5fr_1fr_1fr_1fr] text-center items-stretch ${rowBg} cursor-pointer hover:bg-secondary/80 transition-colors duration-150 group border-accent ${borderbottom} ${selectedPost === post ? "bg-secondary/80" : "bg-transparent"}`}
						>
							<div
								className={`flex items-center gap-5 py-5 text-left px-6 font-medium border-accent border-l group-hover:text-accent font-josefin transition-colors ${selectedPost === post ? "text-accent" : "text-foreground"}`}
							>
								<p className="h-fit">{post.title}</p>
								{post.isFeatured && (
									<span className="font-josefin font-semibold text-xs rounded-full px-3 py-1 bg-accent group-hover:bg-foreground group-hover:text-background">
										Featured
									</span>
								)}
							</div>
							<div
								className={`flex items-center justify-center py-5 border-l border-accent`}
							>
								{post.reads}
							</div>

							<div
								className={`flex items-center justify-center py-5 border-l border-accent`}
							>
								{post.createdAt.toLocaleDateString()}
							</div>

							<div
								className={`flex items-center justify-center py-5 border-l border-accent`}
							>
								{post.updatedAt.toLocaleDateString()}
							</div>

							<div
								className={`flex items-center justify-center py-5 border-l border-r border-accent`}
							>
								{post.publishedAt?.toLocaleDateString() || "-"}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
