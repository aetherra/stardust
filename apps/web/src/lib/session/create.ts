"use server";

import auth from "@stardust/common/auth";
import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import db, { session } from "@stardust/db";
import { headers } from "next/headers";

export async function createSession(workspace: string) {
	console.log(`✨ Stardust: Creating session using workspace ${workspace}`);
	const config = getConfig();
	const userSession = await auth.api.getSession({ headers: await headers() });
	if (!userSession?.user) throw new Error("User not found");
	// todo: move these limits to each node instead
	if (config.session?.usageLimits) {
		const { role, allSessions } = await db.transaction(async (tx) => ({
			role: (
				await tx.query.user.findFirst({
					where: (user, { eq }) => eq(user.id, userSession?.user?.id as string),
					columns: {
						role: true,
					},
				})
			)?.role,
			allSessions: await tx.select().from(session),
		}));
		if (config.session?.usageLimits.instance && config.session?.usageLimits.instance <= allSessions.length)
			throw new Error("Instance limit exceeded");
		if (config.session.usageLimits.user && role !== "admin") {
			const userSessions = allSessions.filter((v) => v.userId === userSession.user.id);
			if (config.session?.usageLimits.user <= userSessions.length) throw new Error("User session limit exceeded");
		}
	}
	// todo: make this pick node with lowest resource usage
	const sessionNode = config.nodes[0];
	const node = stardustConnector(`http://${sessionNode.hostname}:${sessionNode.port || 4000}`, sessionNode.token);
	const { data: container, error } = await node.sessions.create.put({
		workspace,
		user: userSession.user.id,
	});
	if (error) throw error;
	const expiry = new Date();
	expiry.setMinutes(expiry.getMinutes() + (config.session?.keepaliveDuration || 1440));
	return db
		.insert(session)
		.values({
			id: container.id,
			dockerImage: workspace,
			createdAt: new Date(container.created),
			expiresAt: expiry,
			userId: userSession.user.id,
			node: sessionNode.id,
		})
		.returning()
		.catch(async (e) => {
			await node.sessions({ ...container }).delete();
			throw e;
		});
}
