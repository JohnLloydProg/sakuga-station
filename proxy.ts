import { NextRequest, NextResponse } from "next/server";
import { db } from "./lib/db";

export async function proxy(request: NextRequest) {
	const sessionCookie = request.cookies.get("sessionId");
	if (!sessionCookie)
		return NextResponse.redirect(new URL("/admin/login", request.url));

	const sessionId = sessionCookie.value;
	const session = await db.query.sessions.findFirst({
		where: {
			id: sessionId,
		},
	});
	if (!session) return NextResponse.redirect(new URL("/admin/login"));
	console.log(request.nextUrl);
	if (request.nextUrl.pathname === "/admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
}

export const config = {
	matcher: ["/admin/((?!login$).*)", "/admin"],
};
