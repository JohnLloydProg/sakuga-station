"use client";

import { useActionState } from "react";
import { postComment } from "@/lib/actions/comment";

export default function CommentForm({ post }: { post: ClientCompletePost }) {
	const [status, actionForm] = useActionState(
		postComment.bind("", post.id).bind("", post.slug),
		{
			success: false,
		},
	);

	return (
		<form
			action={actionForm}
			className="bg-secondary/30 p-6 rounded-xl border border-secondary/40 space-y-4 mb-8"
		>
			{status.success && (
				<h3 className="font-josefin text-lg font-bold">{status.message}</h3>
			)}

			{!status.success && (
				<h3 className="font-josefin text-lg font-bold text-amber-700">
					{status.error}
				</h3>
			)}

			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="name"
					className="font-josefin font-semibold text-sm text-muted"
				>
					Name{" "}
					<span className="font-lato font-normal text-xs text-muted/60">
						(Optional)
					</span>
				</label>
				<input
					id="name"
					name="nam"
					type="text"
					placeholder="Anonymous Otaku"
					className="w-full md:w-1/3 px-4 py-2 text-sm bg-background rounded border border-accent/40 text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label
					htmlFor="name"
					className="font-josefin font-semibold text-sm text-muted"
				>
					Comment
				</label>
				<textarea
					id="comment"
					name="comment"
					rows={3}
					placeholder="Share your thoughts on this post..."
					className="w-full px-4 py-2 text-sm bg-background rounded border border-accent/40 text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
				/>
			</div>

			<div className="flex justify-end">
				<button
					type="submit"
					className="px-6 py-2 bg-accent text-foreground font-josefin font-bold text-sm rounded hover:bg-foreground hover:text-background transition-colors duration-200 shadow-sm"
				>
					Post Comment
				</button>
			</div>
		</form>
	);
}
