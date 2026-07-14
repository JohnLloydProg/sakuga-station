"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import ErrorDisplay from "@/app/components/errorDisplay";
import { publishPostAction, savePostAction } from "@/lib/actions/post";
import type { Content } from "@/lib/db/schema/contents";
import ContentEdit from "./content";
import ImageInput from "./imageInput";

interface PostProp {
	id: string;
	createdAt: Date;
	authorId: string;
	reads: number;
	title: string;
	slug: string;
	body: string | null;
	isPublished: boolean;
	isFeatured: boolean;
	thumbnail: string | null;
	updatedAt: Date;
	publishedAt: Date | null;
	contents: {
		id: string;
		postId: string;
		contentId: string;
		payload: string;
		index: number;
		type: {
			id: string;
			name: string;
		};
	}[];
	categories: {
		id: string;
		name: string;
	}[];
}

export default function PostForm({
	post,
	contentTypes,
	categoryTypes,
}: {
	post: PostProp;
	contentTypes: Content[];
	categoryTypes: Category[];
}) {
	const { contents, categories, ...postOnly } = post;
	const oldContents: ClientContent[] = contents.map((content) => {
		return {
			id: `${content.type.id}/${content.id}`,
			type: content.type.name,
			payload: content.payload,
			index: content.index,
		};
	});

	const deletedContents = useRef<string[]>([]);
	const [categoryChanges, setCategoryChanges] = useState<Map<string, string>>(
		new Map(),
	);
	const [clientContents, setClientContents] =
		useState<ClientContent[]>(oldContents);

	const [status, formAction] = useActionState(
		savePostAction
			.bind(null, postOnly)
			.bind([], clientContents)
			.bind([], deletedContents.current)
			.bind(null, categoryChanges),
		{ success: false },
	);

	useEffect(() => {
		if (status.success) {
			setCategoryChanges(new Map());

			deletedContents.current = [];
		}
	}, [status.success]);

	return (
		<form action={formAction} className="w-full max-w-6xl flex mt-10 gap-10">
			<div className="flex flex-col gap-8 w-full">
				<div className="bg-secondary/40 p-6 rounded-xl border border-secondary/20 shadow-sm">
					<h2 className="font-josefin text-2xl font-bold mb-6">
						Required Details
					</h2>

					<div className="flex flex-col md:flex-row gap-6 justify-between items-start">
						<div className="flex-1 w-full space-y-4">
							<div className="flex flex-col gap-2">
								<label
									className="font-josefin font-semibold text-lg"
									htmlFor="title"
								>
									Title
								</label>
								<input
									type="text"
									id="title"
									name="title"
									className="w-full px-4 py-2 rounded-md bg-background border border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent"
									defaultValue={post.title}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<label
									className="font-josefin font-semibold text-lg"
									htmlFor="introduction"
								>
									Introduction
								</label>
								<textarea
									id="introduction"
									name="introduction"
									rows={4}
									className="w-full px-4 py-2 rounded-md bg-background border border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
									defaultValue={post.body ? post.body : ""}
								/>
							</div>
						</div>

						<ImageInput
							contentImage={post.thumbnail}
							inputId="hero-image-upload"
						/>
					</div>
				</div>

				<div className="flex flex-col gap-6">
					{clientContents.map((content, index) => (
						<ContentEdit
							key={content.id}
							index={index}
							content={content}
							contents={contents}
							clientContents={clientContents}
							deletedContents={deletedContents}
							setClientContents={setClientContents}
						/>
					))}
				</div>

				<div className="flex justify-center">
					<div className="inline-flex rounded-full bg-accent overflow-hidden shadow-sm">
						{contentTypes.map((type) => {
							return (
								<button
									key={type.id}
									type="button"
									className="px-5 py-2 font-josefin font-semibold text-sm hover:bg-foreground hover:text-background transition-colors border-r border-background/20"
									onClick={() => {
										setClientContents([
											...clientContents,
											{
												id: `${type.id}/${crypto.randomUUID()}`,
												type: type.name,
												payload: "",
												index: clientContents.length,
											},
										]);
									}}
								>
									{type.name}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4 lg:sticky lg:top-8 h-fit w-100">
				<div className="bg-secondary/40 p-5 rounded border-l-4 border-accent space-y-2">
					{categoryTypes.map((category) => (
						<div key={category.id} className="flex items-center gap-3">
							<input
								type="checkbox"
								name={category.id}
								id={category.id}
								checked={
									(categories.map((c) => c.id).includes(category.id) ||
										categoryChanges.get(category.id) === "Add") &&
									categoryChanges.get(category.id) !== "Del"
								}
								onChange={(event) => {
									const nextChange = new Map(categoryChanges);

									const isChecked = event.target.checked;
									if (!isChecked) {
										nextChange.set(category.id, "Del");
									} else {
										nextChange.set(category.id, "Add");
									}
									setCategoryChanges(nextChange);
								}}
							/>
							<div className="font-josefin font-bold text-foreground text-base cursor-pointer hover:text-accent transition">
								{category.name}
							</div>
						</div>
					))}
				</div>

				{status.errors && <ErrorDisplay errors={status.errors} />}

				<button
					type="submit"
					className="w-full py-3 bg-accent text-foreground font-josefin font-bold text-xl rounded-full tracking-wide shadow-sm hover:opacity-90 transition"
				>
					Save Post
				</button>
				<button
					type="button"
					className="w-full py-3 bg-accent text-foreground font-josefin font-bold text-xl rounded-full tracking-wide shadow-sm hover:opacity-90 transition"
					onClick={async () => {
						await publishPostAction(post);
					}}
				>
					{post.isPublished ? "Unpublish Post" : "Publish Post"}
				</button>
				<Link
					href="/admin/dashboard"
					className="w-full py-3 bg-accent text-foreground font-josefin font-bold text-xl rounded-full tracking-wide shadow-sm hover:opacity-90 transition text-center"
				>
					Back
				</Link>
			</div>
		</form>
	);
}
