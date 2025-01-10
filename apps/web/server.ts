import { createServer } from "node:http";
import auth from "@stardust/common/auth";
import { fromNodeHeaders } from "better-auth/node";
import { createProxyMiddleware } from "http-proxy-middleware";
import next from "next";
const dev = process.env.NODE_ENV !== "production";
import type { Socket } from "node:net";
import { getConfig } from "@stardust/config";
const { nostrUrl } = getConfig();
const port = Number.parseInt(process.env.PORT as string) || 3000;
if (process.argv.includes("--turbo")) {
	process.env.TURBOPACK = "1";
}
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
httpServer.on("request", app.getRequestHandler());
httpServer.on("upgrade", (req, socket, head) =>
	req.url?.startsWith("/nostr")
		? nostrProxy.upgrade(req, socket as Socket, head)
		: app.getUpgradeHandler()(req, socket, head),
);
