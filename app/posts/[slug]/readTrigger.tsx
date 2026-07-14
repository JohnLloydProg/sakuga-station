"use client";

import { useEffect } from "react";
import { readPostAction } from "@/lib/actions/post";

export default function ReadTrigger({ postId }: { postId: string }) {
	useEffect(() => {
		const timer = setTimeout(async () => {
			await readPostAction(postId);
		}, 5000);

		return () => clearTimeout(timer);
	}, [postId]);

	return null;
}
