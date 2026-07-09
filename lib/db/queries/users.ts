import { db } from "..";
import { User } from "../schema/users";

export async function getUserByEmailPassword(
	email: string,
	password: string,
): Promise<User | null> {
	try {
		const user = await db.query.users.findFirst({
			where: {
				email: email,
				password: password,
			},
		});

		return user ?? null;
	} catch (error) {
		console.log("Error fetching user by email:", error);
		return null;
	}
}

export async function getUserBySession(
	sessionId: string,
): Promise<User | null> {
	try {
		const user = await db.query.users.findFirst({
			where: {
				session: {
					id: sessionId,
				},
			},
		});

		return user ?? null;
	} catch (error) {
		console.log("Error fetching user by session ID:", error);
		return null;
	}
}
