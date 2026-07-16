import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getPostsByAuthorId } from "@/lib/db/queries/posts";
import { getUserBySession, getUsers } from "@/lib/db/queries/users";
import type { User } from "@/lib/db/schema/users";
import PostTable from "./postTable";
import UserTable from "./usersTable";

export default async function DashboardPage() {
	const cookieStore = await cookies();
	const sessionId = cookieStore.get("sessionId")?.value;
	if (!sessionId) return notFound();

	const user = await getUserBySession(sessionId);
	if (!user) return notFound();

	const posts = await getPostsByAuthorId(user);
	let users: User[] = [];
	if (user.isAdmin) users = await getUsers();

	return (
		<div className="w-full min-h-screen bg-background p-8 font-lato text-foreground flex flex-col gap-10">
			<PostTable posts={posts} user={user} />
			{user.isAdmin && <UserTable users={users} />}
		</div>
	);
}
