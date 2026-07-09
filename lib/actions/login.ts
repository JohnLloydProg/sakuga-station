"use server";

import { cookies } from "next/headers";
import { createSession } from "../db/mutations/users";
import { getUserByEmailPassword } from "../db/queries/users";
import { redirect } from "next/navigation";

interface LoginState {
	success: boolean;
	message?: string;
	error?: string;
}

export async function loginAction(
	_: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password)
		return { success: false, error: "Indicate email and password." };

	const user = await getUserByEmailPassword(email, password);
	if (!user) return { success: false, error: "Wrong email or password!" };

	const sessionId = await createSession(user);
	if (!sessionId) return { success: false, error: "Cannot create session" };

	const cookieStore = await cookies();
	cookieStore.set("sessionId", sessionId);

	redirect("/admin/dashboard");
}
