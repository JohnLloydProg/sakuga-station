"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, createUser } from "../db/mutations/users";
import { getUserByEmailPassword } from "../db/queries/users";
import type { FormState } from "./interfaces";

const registerSchema = z.object({
	email: z
		.string()
		.regex(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Invalid email address",
		),
	firstName: z.string(),
	lastName: z.string(),
	password: z
		.string()
		.regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Must contain letter and number!")
		.min(8, "Must at least be 8 characters long!"),
});

export async function loginAction(
	_: FormState,
	formData: FormData,
): Promise<FormState> {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password)
		return { success: false, message: "Indicate email and password." };

	const user = await getUserByEmailPassword(email, password);
	if (!user) return { success: false, message: "Wrong email or password!" };

	const sessionId = await createSession(user);
	if (!sessionId) return { success: false, message: "Cannot create session" };

	const cookieStore = await cookies();
	cookieStore.set("sessionId", sessionId);

	redirect("/admin/dashboard");
}

export async function logoutAction() {
	const cookieStore = await cookies();
	cookieStore.delete("sessionId");

	redirect("/admin/login");
}

export async function registerAction(
	_: FormState,
	formData: FormData,
): Promise<FormState> {
	const email = formData.get("email") as string;
	const firstName = formData.get("firstName") as string;
	const lastName = formData.get("lastName") as string;
	const password = formData.get("password") as string;

	const parsed = registerSchema.safeParse({
		email: email,
		firstName: firstName,
		lastName: lastName,
		password: password,
	});

	if (!parsed.success)
		return { success: false, errors: z.flattenError(parsed.error).fieldErrors };

	try {
		await createUser(parsed.data);

		revalidatePath("/admin/dashboard");
	} catch (error) {
		console.error("Failed to create account:", error);
		return { success: false, message: "Failed to create account" };
	}

	return { success: true, message: "Account registered!" };
}
