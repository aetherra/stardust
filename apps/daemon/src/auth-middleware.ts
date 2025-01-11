import type { Context } from "elysia";
import generateToken from "~/lib/auth-token";
export async function authCheck(c: Context) {
	const authHeader = c.request.headers.get("Authorization");
	if (!authHeader || authHeader !== (await generateToken())) {
		c.set.status = 401;
		return { success: false, error: "Unauthorized Access: Token is missing or invalid" };
	}
}
