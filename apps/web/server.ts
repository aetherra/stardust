import "@stardust/config/load-config";
import { createServer } from "node:http";
import { shouldRoute, stardustdUpgrade } from "@stardust/common/session/ws";
import { getConfig } from "@stardust/config";
import next from "next";
const config = getConfig();
const dev = process.env.NODE_ENV !== "production";
const port = config.port || 3000;
const hostname = config.hostname || "0.0.0.0";
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
	.on("upgrade", (req, socket, head) =>
		shouldRoute(req) ? stardustdUpgrade(req, socket, head) : nextUpgrade(req, socket, head),
	)
	.listen(port, () => {
		console.log(`✨ Stardust: Server listening on ${hostname}:${port}`);
	});
