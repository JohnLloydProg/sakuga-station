"use client";

import { PostAction } from "@/lib/actions/post";
import { deleteContent } from "@/lib/db/mutations/contents";
import type { Content } from "@/lib/db/schema/contents";
import { Post } from "@/lib/db/schema/posts";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

interface PostProp {
	id: string;
	createdAt: Date;
	authorId: string;
	title: string;
	slug: string;
	body: string | null;
	thumbnail: string | null;
	updatedAt: Date;
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
	const deletedContents = useRef<string[]>([]);
	const [categoryChanges, setCategoryChanges] = useState<Map<string, string>>(
		new Map(),
	);
	const { contents, categories, ...postOnly } = post;
	const oldContents: ClientContent[] = contents.map((content) => {
		console.log(content.payload);
		return {
			id: `${content.type.id}/${content.id}`,
			type: content.type.name,
			payload: content.payload,
			index: content.index,
		};
	});
	const [imagePreview, setImage] = useState(post.thumbnail);
	const [picturePreviews, setPicturePreviews] = useState<Map<string, string>>(
		new Map(),
	);
	const [clientContents, setClientContents] =
		useState<ClientContent[]>(oldContents);
	const [state, formAction, isPending] = useActionState(
		PostAction.bind(null, postOnly)
			.bind([], clientContents)
			.bind([], deletedContents.current)
			.bind(null, categoryChanges),
		{ success: false },
	);

	useEffect(() => {
		if (state.success) {
			setCategoryChanges(new Map());
			setPicturePreviews(new Map());

			deletedContents.current = [];
		}
	}, [state.success]);

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

						<div className="w-full md:w-48 aspect-video md:aspect-square">
							<label
								htmlFor="hero-image-upload"
								className="w-full h-full bg-[#DEE4EC] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted/40 cursor-pointer overflow-hidden relative group hover:border-accent hover:bg-[#D5DCE5] transition-all duration-200"
							>
								{imagePreview ? (
									<>
										<Image
											src={imagePreview}
											alt="Post hero preview"
											fill
											className="w-full h-full object-cover"
										/>
										<div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
											<span className="text-background font-josefin text-xs font-semibold bg-foreground/60 px-2 py-1 rounded">
												Change Image
											</span>
										</div>
									</>
								) : (
									<div className="flex flex-col items-center text-muted/60 pointer-events-none p-4 text-center">
										<svg
											className="w-10 h-10 mb-2 group-hover:text-accent transition-colors"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<title>image placeholder</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="1.5"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
										<span className="font-josefin text-xs font-bold text-muted/80">
											Click to Upload Cover
										</span>
									</div>
								)}
								<input
									id="hero-image-upload"
									name="hero-image-upload"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(event) => {
										const file = event.target.files?.item(0);
										if (!file) return;
										setImage(URL.createObjectURL(file));
										console.log("image:", event.target.value);
									}}
								/>
							</label>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-6">
					{clientContents.map((content, index) => (
						<div
							key={content.id}
							className="bg-secondary/40 p-6 rounded-xl border border-secondary/20 relative group"
						>
							<div className="flex justify-between items-center mb-4">
								<h3 className="font-josefin text-2xl font-bold">
									{content.type}
								</h3>

								<div className="flex items-center gap-1">
									<button
										type="button"
										className="p-1.5 bg-accent/40 rounded text-foreground hover:bg-red-200 hover:text-red-700 transition"
										title="Delete Block"
										onClick={async () => {
											const contentId = content.id.split("/").at(1)!;
											if (contents.map((c) => c.id).includes(contentId)) {
												deletedContents.current.push(contentId);
											}

											setClientContents(
												clientContents.filter((c) => c.id !== content.id),
											);
										}}
									>
										🗑️
									</button>
									<button
										type="button"
										className="p-1.5 bg-accent/40 rounded text-foreground hover:bg-accent transition"
										title="Move Down"
										disabled={index === clientContents.length - 1}
										onClick={() => {
											const nextContent = clientContents.at(index + 1);
											if (!nextContent) return;

											setClientContents(
												clientContents
													.with(index + 1, content)
													.with(index, nextContent),
											);
										}}
									>
										▼
									</button>
									<button
										type="button"
										className="p-1.5 bg-accent/40 rounded text-foreground hover:bg-accent transition"
										title="Move Up"
										disabled={index === 0}
										onClick={() => {
											const nextContent = clientContents.at(index - 1);
											if (!nextContent) return;

											setClientContents(
												clientContents
													.with(index - 1, content)
													.with(index, nextContent),
											);
										}}
									>
										▲
									</button>
								</div>
							</div>
							{content.type === "Header" && (
								<input
									type="text"
									className="w-full md:w-1/2 px-4 py-2 rounded-md bg-background border border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent"
									value={content.payload}
									onChange={(event) => {
										content.payload = event.target.value;
										setClientContents(clientContents.with(index, content));
									}}
								/>
							)}
							{content.type === "Paragraph" && (
								<textarea
									rows={4}
									className="w-full px-4 py-2 rounded-md bg-background border border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
									defaultValue={content.payload}
									onChange={(event) => {
										content.payload = event.target.value;
										setClientContents(clientContents.with(index, content));
									}}
								/>
							)}
							{content.type === "Picture" && (
								<div className="w-full md:w-48 aspect-video md:aspect-square">
									<label
										htmlFor={content.id}
										className="w-full h-full bg-[#DEE4EC] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted/40 cursor-pointer overflow-hidden relative group hover:border-accent hover:bg-[#D5DCE5] transition-all duration-200"
									>
										{(picturePreviews.get(content.id) ||content.payload) ? (
											<div>
												<Image
													src={picturePreviews.get(content.id) ? picturePreviews.get(content.id) : content.payload}
													alt="Post hero preview"
													fill
													className="w-full h-full object-cover"
												/>
												<div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
													<span className="text-background font-josefin text-xs font-semibold bg-foreground/60 px-2 py-1 rounded">
														Change Image
													</span>
												</div>
											</div>
										) : (
											<div className="flex flex-col items-center text-muted/60 pointer-events-none p-4 text-center">
												<svg
													className="w-10 h-10 mb-2 group-hover:text-accent transition-colors"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<title>image placeholder</title>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="1.5"
														d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
													/>
												</svg>
												<span className="font-josefin text-xs font-bold text-muted/80">
													Click to Upload Cover
												</span>
											</div>
										)}
										<input
											name={content.id}
											id={content.id}
											type="file"
											accept="image/*"
											className="hidden"
											onChange={(event) => {
												const file = event.target.files?.item(0);
												if (!file) return;
												const newPreviews = new Map(picturePreviews);
												newPreviews.set(content.id, URL.createObjectURL(file));
												setPicturePreviews(newPreviews);
											}}
										/>
									</label>
								</div>
							)}
						</div>
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

				<button
					type="submit"
					className="w-full py-3 bg-accent text-foreground font-josefin font-bold text-xl rounded-full tracking-wide shadow-sm hover:opacity-90 transition"
				>
					Save Post
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
