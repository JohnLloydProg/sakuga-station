import { Settings2 } from "lucide-react";
import CommentCard from "./commentCard";
import { getPostbyID } from "@/lib/db/queries/posts";
import { getCommentsByPost } from "@/lib/db/queries/comments";
import ApprovalToggle from "./approvalToggle";

interface CommentsAdminPageProps {
	slug: string;
}

export default async function CommentsAdminPage({
	slug,
}: CommentsAdminPageProps) {
	const post = await getPostbyID(slug);

	if (!post) {
		return <div className="p-8 text-muted">Post not found.</div>;
	}

	const comments = await getCommentsByPost(post.id);

	return (
		<div className="w-full max-w-6xl flex flex-col mt-10 gap-8">
			<div className="flex justify-between items-end border-b border-muted/30 pb-4">
				<div>
					<h1 className="font-josefin text-3xl font-bold text-foreground">
						Comments Management
					</h1>
					<p className="text-muted font-medium mt-1">
						Managing discussion for:{" "}
						<span className="text-accent font-bold">{post.title}</span>
					</p>
				</div>
			</div>

			<div className="bg-secondary/40 p-6 rounded-xl border border-secondary/20 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
				<div className="flex items-start gap-4">
					<div className="p-3 bg-background rounded-lg border border-muted/20 shadow-sm text-accent">
						<Settings2 className="w-6 h-6" />
					</div>
					<div>
						<h2 className="font-josefin text-xl font-bold text-foreground">
							Require Admin Approval
						</h2>
						<p className="text-muted text-sm mt-1 max-w-md">
							When enabled, new comments will be hidden from the public until
							you manually approve them below.
						</p>
					</div>
				</div>

				<ApprovalToggle postId={slug} initialState={post.commentApproval} />
			</div>

			<div className="flex flex-col gap-4">
				<h3 className="font-josefin text-xl font-bold text-foreground mb-2">
					{comments.length} {comments.length === 1 ? "Comment" : "Comments"}
				</h3>

				{comments.length === 0 ? (
					<div className="py-12 text-center text-muted font-medium bg-background border border-muted/20 rounded-xl border-dashed">
						No comments on this post yet.
					</div>
				) : (
					comments.map((comment) => (
						<CommentCard key={comment.id} comment={comment} />
					))
				)}
			</div>
		</div>
	);
}
