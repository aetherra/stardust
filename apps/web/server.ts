import { createServer } from "node:http";
import type { Socket } from "node:net";
import { getNode } from "@/lib/session/client";
import type { SessionSchema } from "@stardust/common/auth";
import { getConfig } from "@stardust/config";
import db, { session } from "@stardust/db";
import { eq } from "@stardust/db/utils";
import { createProxyMiddleware } from "http-proxy-middleware";
import next from "next";
const dev = process.env.NODE_ENV !== "production";
const config = getConfig();
const port = Number.parseInt(process.env.PORT as string) || 3000;
console.log(
	`✨ Stardust: Starting ${dev ? "development" : "production"} server ${process.argv.includes("--turbo") ? "with turbopack" : ""}...`,
);
const httpServer = createServer();
const app = next({
	dev,
	port,
	httpServer,
	customServer: true,
	hostname: process.env.HOSTNAME,
	turbopack: process.argv.includes("--turbo"),
});
await app.prepare();
const nextRequest = app.getRequestHandler();
const nextUpgrade = app.getUpgradeHandler();
httpServer
	.on("request", nextRequest)
	.on("upgrade", async (req, socket, head) => {
		if (req.url?.startsWith("/vnc") && req.url?.split("/")[2]) {
			const proto = req.headers["x-forwarded-proto"] || "http";
			const host = req.headers["x-forwarded-host"] || req.headers.host;
			const res = await fetch(`${proto}://${host}/api/auth/get-session`, {
				headers: {
					cookie: req.headers.cookie || "",
				},
			});
			const userSession: SessionSchema = await res.json();
			const dbSession = await db.query.session.findFirst({
				where: (session, { and, eq }) =>
					and(eq(session.id, req.url?.split("/")[2] as string), eq(session.userId, userSession?.user.id || "")),
			});
			if (!dbSession || dbSession?.userId !== userSession?.user.id) return socket.end();
			const nodeConfig = config.nodes.find(({ id }) => id === dbSession.node);
			const intervalId = setInterval(async () => {
				try {
					console.log(`✨ Stardust: Updating keepalive for session ${session?.id}`);
					const expiresAt = new Date();
					expiresAt.setMinutes(expiresAt.getMinutes() + (config.session?.keepaliveDuration || 1440));
					await db
						.update(session)
						.set({ expiresAt })
						.where(eq(session.id, dbSession?.id || ""));
				} catch (e) {
					console.log(`✨ Stardust: Error updating keepalive for session ${session?.id} - ${e}`);
				}
			}, 60000);

			socket.on("close", () => {
				clearInterval(intervalId);
			});
			const middleware = createProxyMiddleware({
				target: `ws://${nodeConfig?.hostname || "0.0.0.0"}:${nodeConfig?.port || 4000}/${session.id}/vnc`,
				headers: {
					Authorization: nodeConfig?.token as string,
				},
			});
			middleware.upgrade(req, socket as Socket, head);
		}
		nextUpgrade(req, socket, head);
	})
	.listen(port, () => {
		console.log(`✨ Stardust: Server listening on ${port}`);
	});
