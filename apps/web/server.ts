import "@stardust/config/load-config";
import { createServer } from "node:http";
import { shouldRoute, stardustdUpgrade } from "@stardust/common/session/ws";
import { getConfig, validateConfig } from "@stardust/config";
import next from "next";
import scheduleAutoDelete from "@/lib/session/auto-delete";

const config = getConfig();
if (!validateConfig(config)) {
	console.error("✨ Stardust: Config file schema invalid");
	process.exit(1);
}
const dev = process.env.NODE_ENV !== "production";
const port = config.port || 3000;
const hostname = config.hostname || "0.0.0.0";
console.log(`✨ Stardust: Starting ${dev ? "development" : "production"} server...`);
const httpServer = createServer();
const app = next({
	dev,
	port,
	httpServer,
	hostname: process.env.HOSTNAME,
	turbo: true,
	customServer: true,
});
await app.prepare();
scheduleAutoDelete();
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
