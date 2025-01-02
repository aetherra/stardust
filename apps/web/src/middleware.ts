import type { SessionSchema } from "@stardust/common/auth";
import { type NextRequest, NextResponse } from "next/server";

const allowedPaths = ["/auth/login", "/auth/error", "/auth/verify", "/auth/signup"];
export default async function authMiddleware(req: NextRequest) {
	const res = await fetch(`${req.nextUrl.protocol}//${req.nextUrl.origin}/api/auth/get-session`, {
		headers: {
			cookie: req.headers.get("cookie") || "",
		},
	});
	const session: SessionSchema = await res.json();
	if (session || allowedPaths.includes(req.nextUrl.pathname)) {
		return NextResponse.next();
	}
	const url = new URL("/auth/login", req.url);
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|icon.svg|websockify|api/auth|manifest.webmanifest).*)"],
};
