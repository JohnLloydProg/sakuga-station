import { db } from "../index";
import type { Email } from "../schema/emails";

export async function getEmailsForCategory(
	categoryId: string,
): Promise<Email[]> {
	const emails = await db.query.emails.findMany({
		where: {
			categories: {
				id: categoryId,
			},
		},
	});
	return emails;
}
