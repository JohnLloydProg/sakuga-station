"use client";

import { useTransition, useState } from "react";

export default function ApprovalToggle({
	postId,
	initialState,
}: {
	postId: string;
	initialState: boolean;
}) {
	const [isPending, startTransition] = useTransition();
	const [isApproved, setIsApproved] = useState(initialState);

	const handleToggle = () => {
		const newState = !isApproved;
		setIsApproved(newState);

		startTransition(async () => {
			console.log("Toggled to", newState);
		});
	};

	return (
		<label
			className={`relative inline-flex items-center cursor-pointer ${isPending ? "opacity-70" : ""}`}
		>
			<input
				type="checkbox"
				className="sr-only peer"
				checked={isApproved}
				onChange={handleToggle}
				disabled={isPending}
			/>
			<div className="w-14 h-7 bg-muted/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-background after:border-muted/30 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent shadow-inner"></div>
		</label>
	);
}
