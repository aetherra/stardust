import db, { session } from "@stardust/db";
import { eq, lte } from "@stardust/db/utils";
import { getNode } from "./client";

export default function scheduleAutoDelete() {
	const cb = async () => {
		console.log("✨ Stardust: Checking for expired sessions...");
		await db.transaction(async (tx) => {
			const staleSessions = await tx.select().from(session).where(lte(session.expiresAt, new Date()));
			await Promise.all(
				staleSessions.map(async (s) => {
					console.log(`✨ Stardust: Deleting expired session ${s.id}`);
					const node = getNode(s);
					const { data, error } = await node.sessions({ id: s.id }).delete();
					if (error || !data.success) console.error(error || new Error("session deletion failed"));
					await tx.delete(session).where(eq(session.id, s.id));
				}),
			);
		});
	};
	cb();
	return setInterval(cb, 60 * 1000);
}
