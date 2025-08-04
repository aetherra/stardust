import { timingSafeEqual } from "node:crypto";
import type { Context } from "elysia";
import generateToken from "~/lib/auth-token";

function safeEqual(a: string, b: string) {
	const bufA = Buffer.from(a);
	const bufB = Buffer.from(b);
	return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function authCheck(c: Context) {
	const token = await generateToken();
	const authHeader = c.request.headers.get("Authorization");
	if (!authHeader) {
		c.set.status = 401;
		if (c.path.startsWith("/swagger")) c.set.headers["www-authenticate"] = 'Basic realm="stardust"';
		return { success: false, error: "Unauthorized Access: Missing header" };
	}
	const [type, credentials] = authHeader.split(" ");
	switch (type) {
		case "Basic":
			if (!safeEqual(credentials, Buffer.from(`stardust:${token}`).toString("base64"))) {
				c.set.status = 401;
				c.set.headers["www-authenticate"] = 'Basic realm="stardust"';
				return { success: false, error: "Unauthorized Access: Basic Auth is missing or invalid" };
			}
			break;
		case "Bearer":
			if (!safeEqual(credentials, token)) {
				c.set.status = 401;
				return { success: false, error: "Unauthorized Access: Token is missing or invalid" };
			}
			break;
		default:
			c.set.status = 401;
			return { success: false, error: "Unauthorized Access: Invalid authentication type" };
	}
}
