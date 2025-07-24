import type { Context } from "elysia";
import generateToken from "~/lib/auth-token";
export async function authCheck(c: Context) {
	const token = await generateToken();
	const authHeader = c.request.headers.get("Authorization");
	if (!authHeader) {
		c.set.status = 403;
		if (c.path.startsWith("/swagger")) c.set.headers["www-authenticate"] = 'Basic realm="stardust"';
		return { success: false, error: "Unauthorized Access: Missing header" };
	}
	const [type, credentials] = authHeader.split(" ");
	if (type === "Basic") {
		if (credentials !== Buffer.from(`stardust:${token}`).toString("base64")) {
			c.set.status = 403;
			c.set.headers["www-authenticate"] = 'Basic realm="stardust"';
			return { success: false, error: "Unauthorized Access: Basic Auth is missing or invalid" };
		}
	} else {
		if (credentials !== token) {
			c.set.status = 403;
			return { success: false, error: "Unauthorized Access: Token is missing or invalid" };
		}
	}
}
