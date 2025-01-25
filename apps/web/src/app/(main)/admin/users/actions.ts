"use server";
import { deleteSession } from "@/lib/session/manage";
import db, { session } from "@stardust/db";
import { eq } from "@stardust/db/utils";
import { revalidatePath } from "next/cache";
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
