"use client";

import { useEffect } from "react";
import { readPost } from "@/lib/db/mutations/posts";

export default function ReadTrigger({ postId }: { postId: string }) {
	useEffect(() => {
		const timer = setTimeout(async () => {
			await readPost(postId);
		}, 5000);

		return () => clearTimeout(timer);
	}, [postId]);

	return null;
}
