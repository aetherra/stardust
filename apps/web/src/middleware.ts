import auth from "@stardust/common/auth";
import { type NextRequest, NextResponse } from "next/server";
const allowedPaths = ["/auth/signin", "/auth/error", "/auth/verify", "/auth/signup"];
export default async function middleware(req: NextRequest) {
	const session = await auth.api.getSession({ headers: req.headers });
	if (session || allowedPaths.includes(req.nextUrl.pathname)) {
		return NextResponse.next();
	}
	const url = new URL("/auth/signin", req.url);
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|icon.svg|api/auth|manifest.webmanifest).*)"],
	runtime: "nodejs",
};
