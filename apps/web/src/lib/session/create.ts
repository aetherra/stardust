"use server";

import auth from "@stardust/common/auth";
import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import db, { session } from "@stardust/db";
import { headers } from "next/headers";
import { getBestNode } from "./best-node";

export async function createSession(workspace: string, nodeId?: string) {
	try {
		console.log(`✨ Stardust: Creating session using workspace ${workspace}`);
		const config = getConfig();
		const userSession = await auth.api.getSession({ headers: await headers() });
		if (!userSession?.user) throw new Error("User not found");
		const sessionNode = config.nodes.find(({ id }) => id === nodeId) || config.nodes[await getBestNode(workspace)];
		const node = stardustConnector(sessionNode);
		if (nodeId !== "autoselect" || !nodeId) {
			const { data, error } = await node.healthcheck.get();
			if (error) {
				console.error(error);
				throw new Error("Failed to connect to node, contact server admin");
			}
			if (data?.limit && data.limit <= data.sessions) throw new Error("Instance limit exceeded");
		}
		if (config.session?.usageLimits?.user) {
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
			if (config.session.usageLimits.user && role !== "admin") {
				const userSessions = allSessions.filter((v) => v.userId === userSession.user.id);
				if (config.session?.usageLimits.user <= userSessions.length) throw new Error("User session limit exceeded");
			}
		}
		const { data: container, error } = await node.sessions.create.put({
			workspace,
			user: userSession.user.id,
			nodeId: sessionNode.id,
		});
		if (error) throw new Error("Failed to create session, contact server admin");
		const expiry = new Date();
		expiry.setMinutes(expiry.getMinutes() + (config.session?.keepaliveDuration || 1440));
		const dbEntry = await db
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
				await node.sessions(container).delete();
				throw e;
			});
		return { data: dbEntry[0] };
	} catch (e) {
		console.log(e);
		return { error: (e as Error).message, data: null };
	}
}
