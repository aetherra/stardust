import auth from "@stardust/common/auth";
import { headers } from "next/headers";
import { forbidden } from "next/navigation";
export async function check() {
	const userSession = await auth.api.getSession({ headers: await headers() });
	if (userSession?.user.role !== "admin") forbidden();
}
