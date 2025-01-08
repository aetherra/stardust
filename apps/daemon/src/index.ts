import "~/lib/config/validate.js";
import { Elysia } from "elysia";
import { docker } from "~/lib/docker.js";
import checkDockerNetwork from "~/lib/network-check.js";
import checkSystemService from "~/lib/service-check.js";
import sessionHandler from "~/session/index.js";
import { authCheck } from "./auth-middleware.js";
import { getConfig } from "./lib/config/index.js";
await checkDockerNetwork();
const config = getConfig();
if (typeof config.service !== "boolean" || config.service === true) {
	checkSystemService();
}

const app = new Elysia()
	.get("/", async (c) => {
		return {
			message:
				"✨ Stardust daemon by spaceness. \nSource tree: https://github.com/spaceness/stardust/tree/rewrite/apps/daemon",
			success: true,
			authenticated: authCheck(c)?.success !== false,
		};
	})
	.onBeforeHandle(authCheck)
	.onError(({ error }) => {
		return {
			success: false,
			error: error.toString(),
		};
	})
	.get("/healthcheck", {
		success: true,
		cpu: process.cpuUsage(),
		mem: process.memoryUsage(),
		sessions: (await docker.listContainers()).filter((s) => s.HostConfig.NetworkMode === config.docker.network).length,
	})
	.use(sessionHandler)
	.listen({
		hostname: config.host,
		port: config.port || 4000,
	});

console.log(`✨ Stardust daemon is running at ${app.server?.hostname}:${app.server?.port}`);
export type App = typeof app;
