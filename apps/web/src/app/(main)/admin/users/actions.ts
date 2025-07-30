"use server";
import auth from "@stardust/common/auth";
import { fromEmail } from "@stardust/common/auth/gravatar";
import db, { account, session, user } from "@stardust/db";
import { and, eq } from "@stardust/db/utils";
import { revalidatePath } from "next/cache";
import { headers as getHeaders } from "next/headers";
import { check } from "@/lib/admin-check";
import { deleteSession } from "@/lib/session/manage";
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
		headers: await getHeaders(),
	});
	if (res.success) {
		revalidateHandler();
		return res;
	}
}
export async function resetPassword(id: string, data: FormData) {
	try {
		const headers = await getHeaders();
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
				headers,
			});
		}
		await auth.api.setUserPassword({
			body: {
				newPassword,
				userId: id,
			},
			headers,
		});
	} catch (e) {
		return { error: (e as Error).message };
	}
}
export async function updateUser(id: string, data: FormData) {
	await check();
	try {
		const where = eq(user.id, id);
		const [dbEntry] = await db.select().from(user).where(where);
		if (!dbEntry) throw new Error("no user found");
		const name = data.get("name")?.toString();
		const email = data.get("email")?.toString();
		let image = data.get("image")?.toString();
		const role = data.get("role")?.toString();
		if (image === "gravatar") {
			image = fromEmail(email || dbEntry.email);
		}
		const res = await db
			.update(user)
			.set({
				name,
				email,
				image,
				role,
			})
			.where(where)
			.returning();
		revalidateHandler();
		return {
			error: undefined,
			...res[0],
		};
	} catch (e) {
		return { error: (e as Error).message };
	}
}
