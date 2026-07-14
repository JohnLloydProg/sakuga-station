"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession } from "../db/mutations/users";
import { getUserByEmailPassword } from "../db/queries/users";
import type { FormState } from "./interfaces";

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
