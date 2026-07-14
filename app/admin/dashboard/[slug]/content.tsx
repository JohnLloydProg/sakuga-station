import type { Dispatch, RefObject, SetStateAction } from "react";
import type { PostContent } from "@/lib/db/schema/contents";
import ImageInput from "./imageInput";

interface ContentEditProp {
	index: number;
	content: ClientContent;
	contents: PostContent[];
	clientContents: ClientContent[];
	deletedContents: RefObject<string[]>;
	setClientContents: Dispatch<SetStateAction<ClientContent[]>>;
}

export default function ContentEdit({
	index,
	content,
	contents,
	clientContents,
	deletedContents,
	setClientContents,
}: ContentEditProp) {
	return (
		<div className="bg-secondary/40 p-6 rounded-xl border border-secondary/20 relative group">
			<div className="flex justify-between items-center mb-4">
				<h3 className="font-josefin text-2xl font-bold">{content.type}</h3>

				<div className="flex items-center gap-1">
					<button
						type="button"
						className="p-1.5 bg-accent/40 rounded text-foreground hover:bg-red-200 hover:text-red-700 transition"
						title="Delete Block"
						onClick={async () => {
							const contentId = content.id.split("/").at(1);
							if (!contentId) return;

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

							const newContents = clientContents
								.with(index + 1, content)
								.with(index, nextContent);

							setClientContents(newContents);
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

							const newContents = clientContents
								.with(index - 1, content)
								.with(index, nextContent);

							setClientContents(newContents);
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
				<ImageInput contentImage={content.payload} inputId={content.id} />
			)}
		</div>
	);
}
