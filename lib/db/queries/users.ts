import { db } from "..";
import type { User } from "../schema/users";

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
		console.error("Error fetching user by email:", error);
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
		console.error("Error fetching user by session ID:", error);
		return null;
	}
}

export async function getUsers(): Promise<User[]> {
	try {
		const users = await db.query.users.findMany();

		return users;
	} catch (error) {
		console.error("Error fetching users:", error);
		return [];
	}
}
