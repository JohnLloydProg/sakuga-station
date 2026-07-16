"use server";

import { z } from "zod";
import { db } from "../db/index";
import { emails, subscriptions } from "../db/schema/emails";
import type { FormState } from "./interfaces";

const emailInsertSchema = z.object({
	address: z
		.string()
		.regex(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Invalid email address",
		),
});

export async function subscribeAction(
	_: FormState,
	formData: FormData,
): Promise<FormState> {
	const categories = formData.getAll("categories");
	const parsed = emailInsertSchema.safeParse({
		address: formData.get("email") || "",
	});

	if (!parsed.success)
		return { success: false, message: "Invalid email address" };

	try {
		const email = (
			await db
				.insert(emails)
				.values(parsed.data)
				.onConflictDoUpdate({
					target: emails.address,
					set: parsed.data,
				})
				.returning()
		).at(0);
		if (!email) return { success: false, message: "Email upsert failed!" };

		for (const categoryId of categories) {
			await db
				.insert(subscriptions)
				.values({ categoryId: categoryId.toString(), emailId: email.id });
		}
		console.log("Successfully subscribed to categories");
		return { success: true, message: "Email added to subscriptions" };
	} catch (error) {
		console.log("Error while subscribing:", error);
		return { success: false, message: "Error while subscribing" };
	}
}
