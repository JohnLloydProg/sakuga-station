"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/lib/actions/auth";

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full py-3 px-4 bg-secondary text-foreground rounded-lg font-josefin font-bold text-lg mt-8 shadow-md hover:bg-foreground hover:text-background transition-all disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{pending ? "Logging in..." : "Login"}
		</button>
	);
}

export default function LoginForm() {
	const [state, formAction] = useActionState(loginAction, {
		success: false,
	});

	return (
		<form
			action={formAction}
			className="w-full max-w-md flex flex-col bg-accent p-8 md:p-10 rounded-2xl shadow-xl mx-auto"
		>
			<h2 className="font-josefin text-3xl font-bold text-center mb-8">
				Welcome Back
			</h2>

			{state.message && (
				<div className="w-full p-3 mb-6 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
					<p className="font-josefin font-semibold text-red-500">
						{state.message}
					</p>
				</div>
			)}

			<div className="flex flex-col gap-5">
				<div className="space-y-1.5">
					<label
						htmlFor="email"
						className="font-josefin text-sm font-semibold tracking-wide px-1 opacity-90"
					>
						Email
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

				<div className="space-y-1.5">
					<label
						htmlFor="password"
						className="font-josefin text-sm font-semibold tracking-wide px-1 opacity-90"
					>
						Password
					</label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="••••••••"
						required
						className="w-full block px-4 py-3 rounded-lg bg-background/50 border border-transparent focus:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
					/>
				</div>
			</div>

			<SubmitButton />
		</form>
	);
}
