import { DrizzleQueryError, eq } from "drizzle-orm";
import { db } from "../db";
import { sessions, User, users } from "../db/schema/users";

export async function createUser(userProp : typeof users.$inferInsert): Promise<User | null> {
    try {
        const user = (await db.insert(users).values(userProp).returning()).at(0);
        if (!user) return null;

        console.log("Created user with ID:", user.id);

        return user;
    }catch(error) {
        console.log("Error creating user:", error);
    }
    return null;
}

export async function createSession(user: User):Promise<string|null> {
    try{
        const session = (await db.insert(sessions).values({userId: user.id}).returning()).at(0);
        if (!session) return null;

        console.log(`Created session with ID ${session.id} for user with ID: ${user.id}`);

        return session.id;
    }catch(insertError) {
        if (insertError instanceof DrizzleQueryError) {
            if (insertError.cause && "code" in insertError.cause && insertError.cause.code === "23505") {
                try {
                    const newUUID = crypto.randomUUID()
                    await db.update(sessions).set({id:newUUID}).where(eq(sessions.userId, user.id))
                    console.log(`Replaced session with ID ${newUUID} for user with ID: ${user.id}`);
                    return newUUID;
                }catch (updateError) {
                    console.log("Error updating session:", updateError);
                }
            }
        }
        console.log("Error creating session:", insertError);
        return null;
    }
}
