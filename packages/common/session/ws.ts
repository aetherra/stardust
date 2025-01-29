import type { IncomingMessage } from "node:http";
import type { Socket } from "node:net";
import type { Duplex } from "node:stream";
import { getConfig } from "@stardust/config";
import db, { session as sessionSchema } from "@stardust/db";
import { eq } from "@stardust/db/utils";
import { createProxyMiddleware } from "http-proxy-middleware";
import type { SessionSchema } from "../auth";

export const shouldRoute = (req: IncomingMessage) =>
	Boolean(["vnc", "audio"].includes(req.url?.split("/")[1] || "") && req.url?.split("/")[2]);

export async function stardustdUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer) {
	const [, connectionType, slug] = req.url?.split("/") || [];
	const config = getConfig();
	const proto = req.headers["x-forwarded-proto"] || "http";
	const host = req.headers["x-forwarded-host"] || req.headers.host;
	const res = await fetch(`${proto}://${host}/api/auth/get-session`, {
		headers: {
			cookie: req.headers.cookie || "",
		},
	});
	const userSession: SessionSchema = await res.json();
	const session = await db.query.session.findFirst({
		where: (session, { and, eq }) => and(eq(sessionSchema.id, slug), eq(session.userId, userSession?.user.id || "")),
	});
	if (!session || session?.userId !== userSession?.user.id) return socket.end();
	const nodeConfig = config.nodes.find(({ id }) => id === session.node);
	if (connectionType === "vnc") {
		const intervalId = setInterval(async () => {
			try {
				console.log(`✨ Stardust: Updating keepalive for session ${session?.id}`);
				const expiresAt = new Date();
				expiresAt.setMinutes(expiresAt.getMinutes() + (config.session?.keepaliveDuration || 1440));
				await db
					.update(sessionSchema)
					.set({ expiresAt })
					.where(eq(sessionSchema.id, session?.id || ""));
			} catch (e) {
				console.log(`✨ Stardust: Error updating keepalive for session ${session?.id} - ${e}`);
			}
		}, 60000);

		socket.on("close", () => {
			console.log(`✨ Stardust: Client disconnected from ${session?.id} for ${connectionType}`);
			clearInterval(intervalId);
		});
	}
	const middleware = createProxyMiddleware({
		target: `ws://${nodeConfig?.hostname || "0.0.0.0"}:${nodeConfig?.port || 4000}/sessions/${session.id}/${connectionType}`,
		ignorePath: true,
		headers: {
			Authorization: `Bearer ${nodeConfig?.token}`,
		},
	});
	return middleware.upgrade(req, socket as Socket, head);
}
