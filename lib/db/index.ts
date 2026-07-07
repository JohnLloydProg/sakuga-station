import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";


if (process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle({client:sql });
}else {
    console.log("NO DATABASE URL DETECTED! closing...")
}
