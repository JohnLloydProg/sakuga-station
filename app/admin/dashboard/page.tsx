import { getPostsByAuthorId } from "@/lib/db/queries/posts";
import { getUserBySession } from "@/lib/db/queries/users";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PostTable from "./table";

export default async function DashboardPage() {
	const cookieStore = await cookies();
	const sessionId = cookieStore.get("sessionId")?.value;
	if (!sessionId) return notFound();

	const user = await getUserBySession(sessionId);
	if (!user) return notFound();

	const posts = await getPostsByAuthorId(user.id);

	return (
		<div className="w-full min-h-screen bg-background p-8 font-lato text-foreground">
			<PostTable posts={posts}/>
		</div>
	);
}
