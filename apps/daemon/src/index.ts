import { Elysia } from "elysia";
import { authCheck } from "~/auth-middleware";
import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";
import sessionHandler from "~/session";
const config = getConfig();
export const app = new Elysia()
	.get("/", async (c) => {
		return {
			message:
				"✨ Stardust daemon by spaceness. \nSource tree: https://github.com/spaceness/stardust/tree/rewrite/apps/daemon",
			success: true,
			authenticated: (await authCheck(c))?.success !== false,
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
	.use(sessionHandler);

// eden
export type App = typeof app;
