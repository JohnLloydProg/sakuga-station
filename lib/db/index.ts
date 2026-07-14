import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { usersRelations } from "./schema/relations";

config({ path: ".env" });

export const db = drizzle({
	connection: process.env.DATABASE_URL!,
	relations: usersRelations,
});
