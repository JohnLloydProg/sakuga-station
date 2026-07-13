"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/lib/actions/auth";

function SubmitButton() {
	const { pending, data } = useFormStatus();

	return (
		<button
			type="submit"
			className="w-50 py-2 bg-secondary rounded-full font-josefin font-bold text-xl mt-15"
		>
			{pending ? "Logging in..." : "Login"}
		</button>
	);
}

export default function LoginForm() {
	const [state, formAction, isPending] = useActionState(loginAction, {
		success: false,
	});
	return (
		<form
			action={formAction}
			className="w-full max-w-lg flex flex-col items-end bg-accent p-10 rounded-xl"
		>
			{state.error && (
				<h3 className="font-josefin w-full text-center font-bold mb-5">
					{state.error}
				</h3>
			)}
			<input
				type="email"
				name="email"
				id="email"
				className="w-full block px-2 py-3 rounded-xs bg-secondary focus:outline-none focus:ring-0"
			/>
			<input
				type="password"
				name="password"
				id="password"
				className="w-full block px-2 py-3 rounded-xs bg-secondary focus:outline-none focus:ring-0 mt-10"
			/>

			<SubmitButton />
		</form>
	);
}
