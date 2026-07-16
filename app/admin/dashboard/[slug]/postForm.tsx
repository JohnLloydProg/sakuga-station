"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import {
	useActionState,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { useFormStatus } from "react-dom";
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
	commentApproval: boolean;
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

function SubmitButton({ isDisabled }: { isDisabled: boolean }) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			className="w-full py-3 bg-accent text-foreground cursor-pointer font-josefin font-bold text-xl rounded-full tracking-wide shadow-sm hover:bg-foreground hover:text-background transition disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={pending || isDisabled}
		>
			{pending ? "Saving Post..." : "Save Post"}
		</button>
	);
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

	const [status, formAction, isSaving] = useActionState(
		savePostAction
			.bind(null, postOnly)
			.bind([], clientContents)
			.bind([], deletedContents.current)
			.bind(null, categoryChanges),
		{ success: false },
	);
	const [isPublishing, startTransition] = useTransition();

	useEffect(() => {
		if (status.success) {
			setCategoryChanges(new Map());
			deletedContents.current = [];
		}
	}, [status.success]);

	return (
		<form
			action={formAction}
			className="w-full max-w-6xl flex flex-col lg:flex-row mt-5 gap-8 lg:gap-10 px-4 md:px-0"
		>
			<div className="flex flex-col gap-6 md:gap-8 w-full flex-1">
				<div className="bg-secondary/40 p-4 md:p-6 rounded-xl border border-secondary/20 shadow-sm">
					<h2 className="font-josefin text-2xl font-bold mb-6">
						Required Details
					</h2>

					<div className="flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-start">
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
									className="w-full px-4 py-2 rounded-md bg-background border border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent text-sm md:text-base"
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
									className="w-full px-4 py-2 rounded-md bg-background border border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent resize-none text-sm md:text-base"
									defaultValue={post.body ? post.body : ""}
								/>
							</div>
						</div>

						<div className="w-full md:w-auto flex justify-center shrink-0">
							<ImageInput
								contentImage={post.thumbnail}
								inputId="hero-image-upload"
							/>
						</div>
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

				<div className="flex justify-center w-full">
					<div className="inline-flex rounded-full bg-accent overflow-x-auto max-w-full scrollbar-none shadow-sm">
						{contentTypes.map((type) => {
							return (
								<button
									key={type.id}
									type="button"
									className="px-4 md:px-5 py-2 font-josefin font-semibold text-xs md:text-sm whitespace-nowrap hover:bg-foreground hover:text-background transition-colors border-r border-background/20 last:border-r-0"
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

			<div className="flex flex-col gap-4 w-full lg:w-95 lg:sticky lg:top-8 h-fit">
				<div className="bg-secondary/40 p-5 grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-2 rounded border-l-4 border-accent gap-x-4 gap-y-3">
					{categoryTypes.map((category) => (
						<div key={category.id} className="flex items-center gap-3">
							<input
								type="checkbox"
								name={category.id}
								id={category.id}
								className="w-4 h-4 cursor-pointer accent-accent"
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
							<label
								htmlFor={category.id}
								className="font-josefin font-bold text-foreground text-sm md:text-base cursor-pointer hover:text-accent transition select-none"
							>
								{category.name}
							</label>
						</div>
					))}
				</div>

				<div className="min-h-6 flex items-center justify-center font-josefin font-semibold text-sm transition-all duration-300">
					{status.success && (
						<span className="flex items-center gap-2 text-accent">
							<Image
								src="/tick-circle.svg"
								alt="tick-circle"
								width={16}
								height={16}
								className="w-4 h-4"
							/>
							{status.message}
						</span>
					)}

					{!status.success && (status.message || status.errors) && (
						<span className="flex items-center gap-2 text-red-500/80">
							<Image
								src="/info-circle.svg"
								alt="info-circle"
								width={16}
								height={16}
								className="w-4 h-4"
							/>
							{status.message}
						</span>
					)}
				</div>

				{status.errors && <ErrorDisplay errors={status.errors} />}

				<div className="flex flex-col gap-3">
					<SubmitButton isDisabled={isPublishing} />

					<button
						type="button"
						className="w-full py-3 bg-accent text-foreground cursor-pointer font-josefin font-bold text-xl rounded-full tracking-wide shadow-sm hover:bg-foreground hover:text-background transition disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isSaving || isPublishing}
						onClick={() => {
							startTransition(async () => {
								await publishPostAction(post);
							});
						}}
					>
						{post.isPublished
							? isPublishing
								? "Unpublishing Post..."
								: "Unpublish Post"
							: isPublishing
								? "Publishing Post..."
								: "Publish Post"}
					</button>

					<button
						type="button"
						className="w-full py-3 bg-accent text-foreground cursor-pointer font-josefin font-bold text-xl rounded-full tracking-wide shadow-sm hover:bg-foreground hover:text-background transition disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isSaving || isPublishing}
						onClick={() => {
							redirect("/admin/dashboard");
						}}
					>
						Back
					</button>
				</div>
			</div>
		</form>
	);
}
