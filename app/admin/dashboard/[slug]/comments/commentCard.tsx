"use client";

import type { Comment } from "@/lib/db/schema/comments";
import { CheckCircle2, Trash2, Clock, Loader2 } from "lucide-react";
import { useTransition } from "react";

export default function CommentCard({ comment }: { comment: Comment }) {
	const [isPending, startTransition] = useTransition();

	const handleApprove = () => {
		startTransition(async () => {
			console.log("Approving", comment.id);
		});
	};

	const handleDelete = () => {
		startTransition(async () => {
			console.log("Deleting", comment.id);
		});
	};

	return (
		<div
			className={`p-6 rounded-xl border shadow-sm flex flex-col md:flex-row gap-6 justify-between transition-colors ${
				comment.isApproved
					? "bg-background border-muted/20"
					: "bg-secondary/20 border-accent/40"
			} ${isPending ? "opacity-60 pointer-events-none" : ""}`}
		>
			<div className="flex-1 space-y-3">
				<div className="flex items-center gap-3">
					<span className="font-josefin font-bold text-lg text-foreground">
						{comment.authorName}
					</span>
					<span className="text-sm text-muted">
						• {new Date(comment.createdAt).toLocaleDateString()}
					</span>

					{!comment.isApproved && (
						<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent/20 text-accent border border-accent/30">
							<Clock className="w-3.5 h-3.5" />
							Pending Review
						</span>
					)}
				</div>

				<p className="text-foreground/90 leading-relaxed">{comment.body}</p>
			</div>

			{/* Actions */}
			<div className="flex flex-row md:flex-col justify-end gap-3 min-w-35">
				{!comment.isApproved && (
					<button
						type="button"
						onClick={handleApprove}
						disabled={isPending}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-white font-josefin font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity"
					>
						{isPending ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<CheckCircle2 className="w-4 h-4" />
						)}
						Approve
					</button>
				)}

				<button
					type="button"
					onClick={handleDelete}
					disabled={isPending}
					className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-[#cc665a]/50 text-[#cc665a] font-josefin font-bold rounded-lg shadow-sm hover:bg-[#cc665a]/10 transition-colors"
				>
					<Trash2 className="w-4 h-4" />
					Delete
				</button>
			</div>
		</div>
	);
}
