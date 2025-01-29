import { loadavg } from "node:os";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import pkgJson from "~/../package.json";
import { authCheck } from "~/auth-middleware";
import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";
import sessionHandler from "~/session";
import workspaceHandler from "~/workspace";
import generateToken from "./lib/auth-token";
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
	.onError(({ error, path }) => {
		console.error(`✨ Stardust: [${path}] ${error}`);
		return {
			success: false,
			error: error.toString(),
		};
	})
	.get("/healthcheck", {
		success: true,
		cpu: loadavg()[0],
		mem: process.memoryUsage(),
		sessions: (await docker.listContainers()).filter((s) => s.HostConfig.NetworkMode === config.docker.network).length,
	})
	.use(sessionHandler)
	.use(workspaceHandler)
	.use(
		swagger({
			documentation: {
				info: {
					title: "Stardust Daemon API",
					version: pkgJson.version,
				},
				components: {
					securitySchemes: {
						bearerAuth: {
							type: "http",
							scheme: "bearer",
						},
					},
				},
				security: [
					{
						bearerAuth: [],
					},
				],
			},
			scalarConfig: {
				theme: "kepler",
				customCss: "\n",
			},
		}),
	);

// eden
export type App = typeof app;
