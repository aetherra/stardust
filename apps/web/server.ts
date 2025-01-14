import { createServer } from "node:http";
import type { Socket } from "node:net";
import auth from "@stardust/common/auth";
import { fromNodeHeaders } from "@stardust/common/auth/lib";
import { stardustConnector } from "@stardust/common/daemon/client";
import parseSessionId from "@stardust/common/daemon/parse-session-id";
import { getConfig } from "@stardust/config";
import db, { session } from "@stardust/db";
import { eq } from "@stardust/db/utils";
import { createProxyMiddleware } from "http-proxy-middleware";
import next from "next";
if (process.argv.includes("--turbo")) {
	process.env.TURBOPACK = "1";
}
const dev = process.env.NODE_ENV !== "production";
const { nostrUrl, nodes, ...appConfig } = getConfig();
const port = Number.parseInt(process.env.PORT as string) || 3000;
console.log(
	`✨ Stardust: Starting ${dev ? "development" : "production"} server ${process.env.TURBOPACK ? "With turbopack" : ""}...`,
);
const httpServer = createServer();
const nostrProxy = createProxyMiddleware({
	target: nostrUrl,
	ws: true,
});
const app = next({
	dev,
	port,
	httpServer,
});
await app.prepare();
httpServer
	.on("request", app.getRequestHandler())
	.on("upgrade", async (req, socket: Socket, head) => {
		if (req.url?.startsWith("/nostr")) {
			const parsed = parseSessionId(req.url?.split("/")[2]);
			const userSession = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
			if (parsed?.user !== userSession?.user.id) socket.destroy();
			const intervalId = setInterval(async () => {
				try {
					console.log(`✨ Stardust: Updating keepalive for session ${parsed?.code}@${parsed?.node}`);
					const sessionNode = nodes.find((n) => n.id === parsed?.node);
					if (!sessionNode) throw new Error("Node not found");
					const { data, error } = await stardustConnector(sessionNode).sessions.list.get();
					if (!data?.containers) throw new Error(`Error fetching container info: ${error}`);
					const expiresAt = new Date();
					expiresAt.setMinutes(expiresAt.getMinutes() + (appConfig.session?.keepaliveDuration || 1440));
					await db
						.update(session)
						.set({ expiresAt })
						.where(eq(session.id, data.containers.find((c) => c.Names[0] === req.url?.split("/")[2])?.Id || ""));
				} catch (e) {
					console.log(`✨ Stardust: Error updating keepalive for session ${parsed?.code}@${parsed?.node} - ${e}`);
				}
			}, 60000);

			socket.on("close", () => {
				clearInterval(intervalId);
				console.log(`✨ Stardust: Connection closed for session ${parsed?.code}@${parsed?.node}`);
			});
			return nostrProxy.upgrade(req, socket, head);
		}
		return app.getUpgradeHandler()(req, socket, head);
	})
	.listen(port, () => {
		console.log(`✨ Stardust: Server listening on ${port}`);
	});
