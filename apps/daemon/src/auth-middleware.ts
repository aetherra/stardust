import type { Context } from "elysia";
import generateToken from "~/lib/auth-token";
export async function authCheck(c: Context) {
	const token = await generateToken();
	const authHeader = c.request.headers.get("Authorization");
	if (c.path.startsWith("/swagger")) {
		if (!authHeader || authHeader !== `Basic ${Buffer.from(`stardust:${token}`).toString("base64")}`) {
			c.set.status = 401;
			c.set.headers["www-authenticate"] = 'Basic realm="stardust"';
			return { success: false, error: "Unauthorized Access: Basic Auth is missing or invalid" };
		}
	} else {
		if (!authHeader || authHeader !== `Bearer ${token}`) {
			c.set.status = 401;
			return { success: false, error: "Unauthorized Access: Token is missing or invalid" };
		}
	}
}
