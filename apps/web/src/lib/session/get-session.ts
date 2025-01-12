"use server";
import auth from "@stardust/common/auth";
import type { SelectSession } from "@stardust/db";
import db from "@stardust/db";
import { headers } from "next/headers";
export default async function getSession(id: string, admin?: boolean): Promise<SelectSession> {
	const userSession = await auth.api.getSession({ headers: await headers() });
	const res = await db.query.session.findFirst({
		where: (session, { and, eq }) => {
			const base = eq(session.id, id);
			if (admin && userSession?.user.role === "admin") {
				return and(base, eq(session.userId, userSession?.user.id || ""));
			}
			return base;
		},
	});
	if (!res) throw new Error("session does not exist or is not tied to the current user");
	return res;
}
