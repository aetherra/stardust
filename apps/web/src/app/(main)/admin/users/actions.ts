"use server";
import { check } from "@/lib/admin-check";
import { deleteSession } from "@/lib/session/manage";
import auth from "@stardust/common/auth";
import { hashPassword } from "@stardust/common/auth/lib";
import db, { account, session } from "@stardust/db";
import { and, eq } from "@stardust/db/utils";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
export const revalidateHandler = async () => revalidatePath("/admin/users");
export async function deleteUserSessions(id: string) {
	await db.transaction(async (tx) => {
		const sessions = await tx.select().from(session).where(eq(session.userId, id));
		await Promise.all(
			sessions.map((s) =>
				deleteSession({
					id: s.id,
					admin: true,
					dbClient: tx,
				}),
			),
		);
	});
	revalidateHandler();
}
// todo: move this to better auth callback
export async function safeDeleteUser(id: string) {
	await db.transaction(async (tx) => {
		const sessions = await tx.select().from(session).where(eq(session.userId, id));
		await Promise.all(
			sessions.map((s) =>
				deleteSession({
					id: s.id,
					admin: true,
					dbClient: tx,
				}),
			),
		);
	});
	const res = await auth.api.removeUser({
		body: {
			userId: id,
		},
		headers: await headers(),
	});
	if (res.success) {
		revalidateHandler();
		return res;
	}
}
export async function resetPassword(id: string, data: FormData) {
	await check();
	try {
		const where = and(eq(account.userId, id), eq(account.providerId, "credential"));
		const [dbEntry] = await db.select().from(account).where(where);
		if (!dbEntry) throw new Error("credentials signin not enabled for user");
		const newPassword = data.get("new-password")?.toString();
		if (!newPassword) throw new Error("No password specified");
		if (data.get("revoke-others")) {
			await auth.api.revokeUserSessions({
				body: {
					userId: id,
				},
				headers: await headers(),
			});
		}
		await db
			.update(account)
			.set({
				password: await hashPassword(newPassword),
			})
			.where(where);
	} catch (e) {
		return { error: (e as Error).message };
	}
}
