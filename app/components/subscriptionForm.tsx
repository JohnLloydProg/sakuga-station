"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeAction } from "@/lib/actions/emails";
import type { Category } from "@/lib/db/schema/categories";

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full py-3 px-4 bg-accent text-foreground rounded-lg font-josefin font-bold text-lg shadow-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
		>
			{pending ? "Subscribing..." : "Subscribe"}
		</button>
	);
}

export default function SubscribeModal({
	categories,
}: {
	categories: Category[];
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [state, formAction] = useActionState(subscribeAction, {
		success: false,
		message: "",
	});

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="px-6 py-2 bg-accent text-foreground font-josefin font-bold rounded-lg shadow-sm hover:brightness-110 transition-all"
			>
				Subscribe to Updates
			</button>

			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
					<div className="bg-secondary/90 border border-secondary p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-background/50 hover:bg-background text-foreground transition-colors"
						>
							✕
						</button>

						<h2 className="font-josefin text-3xl font-bold text-center mb-2">
							Stay Updated
						</h2>
						<p className="text-center opacity-80 mb-6 text-sm">
							Choose your favorite categories to get notified.
						</p>

						{state.message && (
							<div
								className={`w-full p-3 mb-6 rounded-lg text-center ${
									state.success
										? "bg-green-500/10 border border-green-500/30 text-green-500"
										: "bg-red-500/10 border border-red-500/30 text-red-500"
								}`}
							>
								<p className="font-josefin font-semibold">{state.message}</p>
							</div>
						)}

						<form action={formAction} className="flex flex-col gap-6">
							<div className="space-y-1.5">
								<label
									htmlFor="email"
									className="font-josefin text-sm font-semibold tracking-wide px-1 opacity-90"
								>
									Email Address
								</label>
								<input
									type="email"
									name="email"
									id="email"
									placeholder="name@example.com"
									required
									className="w-full block px-4 py-3 rounded-lg bg-background/50 border border-transparent focus:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
								/>
							</div>

							<div className="space-y-3">
								<span className="font-josefin text-sm font-semibold tracking-wide px-1 opacity-90 block">
									Select Categories
								</span>

								<div className="grid grid-cols-2 gap-3">
									{categories.map((cat) => (
										<label
											key={cat.id}
											className="flex items-center p-3 rounded-lg border border-background/40 bg-background/20 cursor-pointer group hover:bg-background/40 transition-all has-[:checked]:border-accent has-[:checked]:bg-accent/10"
										>
											<input
												type="checkbox"
												name="categories"
												value={cat.id}
												className="w-4 h-4 rounded border-secondary text-accent focus:ring-2 focus:ring-accent/50 cursor-pointer accent-accent"
											/>
											<span className="ml-3 text-sm font-medium font-josefin opacity-90 group-hover:opacity-100 transition-opacity">
												{cat.name}
											</span>
										</label>
									))}
								</div>
							</div>

							<SubmitButton />
						</form>
					</div>
				</div>
			)}
		</>
	);
}
