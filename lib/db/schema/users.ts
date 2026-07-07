import { pgTable, text, uuid, timestamp, varchar, boolean, index } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", {length:255}).notNull().unique(),
    firstName: varchar("first_name", {length: 255}).notNull(),
    lastName: varchar("last_name", {length:255}).notNull(),
    password: text("password").notNull(),
    isAdmin: boolean("is_admin").default(false).notNull(),
    createdAt: timestamp("created").defaultNow().notNull()
});

export const sessions = pgTable("sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
}, (t) => [index("sessions_user_id_idx").on(t.userId)]);

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;