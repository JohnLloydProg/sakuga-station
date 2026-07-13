import { DrizzleQueryError, eq } from "drizzle-orm";
import { db } from "..";
import { sessions, User, users } from "../schema/users";

export async function createUser(
	userProp: typeof users.$inferInsert,
): Promise<User | null> {
	try {
		const user = (await db.insert(users).values(userProp).returning()).at(0);
		if (!user) return null;

		console.log("Created user with ID:", user.id);

		return user;
	} catch (error) {
		console.log("Error creating user:", error);
	}
	return null;
}

export async function createSession(user: User): Promise<string | null> {
	try {
		const session = (
			await db
				.insert(sessions)
				.values({ userId: user.id })
				.onConflictDoUpdate({
					target: sessions.userId,
					set: { id: crypto.randomUUID() },
				})
				.returning()
		).at(0);
		if (!session) return null;

		console.log(
			`Created session with ID ${session.id} for user with ID: ${user.id}`,
		);

		return session.id;
	} catch (insertError) {
		console.log("Error creating session:", insertError);
		return null;
	}
}
