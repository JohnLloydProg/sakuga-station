import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/db/mutations/users";
import { getExpiredSessions } from "@/lib/db/queries/users";

export const revalidate = 0;

export async function GET(request: Request) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	try {
		console.log("Cron job triggered successfully!");

		const expiredSessions = await getExpiredSessions();

		for (const session of expiredSessions) {
			await deleteSession(session);
		}

		return NextResponse.json({ success: true, message: "Task completed" });
	} catch (error) {
		return NextResponse.json(
			{ success: false, error: "Task failed" },
			{ status: 500 },
		);
	}
}
