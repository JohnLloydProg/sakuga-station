"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

interface TiptapEditorProps {
	id: string;
	initialContent?: string;
}

export default function RichTextEditor({
	id,
	initialContent = "",
}: TiptapEditorProps) {
	const [content, setContent] = useState(initialContent);

	const editor = useEditor({
		extensions: [StarterKit],
		content: initialContent,
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			setContent(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class:
					"focus:outline-none min-h-[250px] p-5 text-foreground prose max-w-full text-foreground prose-headings:font-bold prose-headings:text-foreground prose-h1:text-4xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-base prose-p:leading-normal prose-p:mb-5 prose-a:text-accent prose-a:underline hover:prose-a:text-muted prose-ul:list-disc prose-ul:ml-5 prose-strong:text-foreground",
			},
		},
	});

	if (!editor) {
		return null;
	}

	const getButtonClass = (isActive: boolean) =>
		`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
			isActive
				? "bg-accent text-background shadow-sm"
				: "text-foreground hover:bg-background"
		}`;

	return (
		<div className="w-full max-w-4xl border border-muted/30 rounded-xl overflow-hidden bg-background flex flex-col shadow-sm">
			<input type="hidden" id={id} name={id} value={content} />

			<div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-secondary border-b border-muted/30">
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={getButtonClass(editor.isActive("bold"))}
					title="Bold"
				>
					<strong>B</strong>
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={getButtonClass(editor.isActive("italic"))}
					title="Italic"
				>
					<em>I</em>
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleStrike().run()}
					className={getButtonClass(editor.isActive("strike"))}
					title="Strikethrough"
				>
					<s>S</s>
				</button>

				<div className="w-px h-5 bg-muted/30 mx-1" />

				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					className={getButtonClass(editor.isActive("heading", { level: 1 }))}
				>
					H1
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className={getButtonClass(editor.isActive("heading", { level: 2 }))}
				>
					H2
				</button>

				<div className="w-px h-5 bg-muted/30 mx-1" />

				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={getButtonClass(editor.isActive("bulletList"))}
				>
					• List
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={getButtonClass(editor.isActive("orderedList"))}
				>
					1. List
				</button>
			</div>

			<EditorContent
				editor={editor}
				className="grow overflow-y-auto cursor-text bg-background"
			/>
		</div>
	);
}
