"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import ErrorDisplay from "@/app/components/errorDisplay";
import { registerAction } from "@/lib/actions/auth";

function RegisterSubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className="w-full py-3 px-4 bg-[#EBE0CD] text-[#2C3B2F] rounded-xl font-bold text-lg mt-8 shadow-sm hover:brightness-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{pending ? "Registering..." : "Register"}
		</button>
	);
}
interface RegisterModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
	const [state, formAction] = useActionState(registerAction, {
		success: false,
	});

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-[#F7F5F0]/40 backdrop-blur-[2px]"
				onClick={onClose}
			/>

			<div className="relative w-full max-w-md z-10">
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#2C3B2F]/10 text-[#2C3B2F] hover:bg-[#2C3B2F]/20 transition-colors"
				>
					✕
				</button>

				<form
					action={formAction}
					className="w-full flex flex-col bg-[#96A78D] p-8 md:p-10 rounded-2xl shadow-2xl mx-auto"
				>
					<h2 className="text-[#2C3B2F] text-3xl font-bold text-center mb-8">
						Create Account
					</h2>

					{state.success && (
						<div className="w-full p-3 mb-6 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
							<p className="font-semibold text-[#2C3B2F]">{state.message}</p>
						</div>
					)}

					{!state.success && state.message && (
						<div className="w-full p-3 mb-6 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
							<p className="font-semibold text-[#2C3B2F]">{state.message}</p>
						</div>
					)}

					{!state.success && state.errors && (
						<ErrorDisplay errors={state.errors} />
					)}

					<div className="flex flex-col gap-5">
						<div className="flex flex-col sm:flex-row gap-5">
							<div className="space-y-1.5 w-full">
								<label
									htmlFor="firstName"
									className="text-[#2C3B2F] text-sm font-bold tracking-wide px-1"
								>
									First Name
								</label>
								<input
									type="text"
									name="firstName"
									id="firstName"
									placeholder="Jane"
									required
									className="w-full block px-4 py-3 rounded-xl bg-[#C1CCB4] border border-transparent text-[#2C3B2F] placeholder:text-[#7A8A71] focus:border-[#2C3B2F]/20 focus:outline-none focus:ring-2 focus:ring-[#2C3B2F]/10 transition-all"
								/>
							</div>

							<div className="space-y-1.5 w-full">
								<label
									htmlFor="lastName"
									className="text-[#2C3B2F] text-sm font-bold tracking-wide px-1"
								>
									Last Name
								</label>
								<input
									type="text"
									name="lastName"
									id="lastName"
									placeholder="Doe"
									required
									className="w-full block px-4 py-3 rounded-xl bg-[#C1CCB4] border border-transparent text-[#2C3B2F] placeholder:text-[#7A8A71] focus:border-[#2C3B2F]/20 focus:outline-none focus:ring-2 focus:ring-[#2C3B2F]/10 transition-all"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="email"
								className="text-[#2C3B2F] text-sm font-bold tracking-wide px-1"
							>
								Email
							</label>
							<input
								type="email"
								name="email"
								id="email"
								placeholder="name@example.com"
								required
								className="w-full block px-4 py-3 rounded-xl bg-[#C1CCB4] border border-transparent text-[#2C3B2F] placeholder:text-[#7A8A71] focus:border-[#2C3B2F]/20 focus:outline-none focus:ring-2 focus:ring-[#2C3B2F]/10 transition-all"
							/>
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="password"
								className="text-[#2C3B2F] text-sm font-bold tracking-wide px-1"
							>
								Password
							</label>
							<input
								type="password"
								name="password"
								id="password"
								placeholder="••••••••"
								required
								className="w-full block px-4 py-3 rounded-xl bg-[#C1CCB4] border border-transparent text-[#2C3B2F] placeholder:text-[#7A8A71] focus:border-[#2C3B2F]/20 focus:outline-none focus:ring-2 focus:ring-[#2C3B2F]/10 transition-all"
							/>
						</div>
					</div>

					<RegisterSubmitButton />
				</form>
			</div>
		</div>
	);
}
