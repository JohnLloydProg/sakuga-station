import Image from "next/image";
import { useState } from "react";

interface ImageInputProp {
	contentImage: string | null;
	inputId: string;
}

export default function ImageInput({ contentImage, inputId }: ImageInputProp) {
	const [image, setImage] = useState<string | null>(contentImage);

	return (
		<div className="w-full md:w-48 aspect-video md:aspect-square">
			<label
				htmlFor={inputId}
				className="w-full h-full bg-[#DEE4EC] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-muted/40 cursor-pointer overflow-hidden relative group hover:border-accent hover:bg-[#D5DCE5] transition-all duration-200"
			>
				{image ? (
					<>
						<Image
							src={image}
							alt="Content Image"
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
					id={inputId}
					name={inputId}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={(event) => {
						const file = event.target.files?.item(0);
						if (!file) return;
						setImage(URL.createObjectURL(file));
					}}
				/>
			</label>
		</div>
	);
}
