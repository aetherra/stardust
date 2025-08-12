import os from "node:os";
import { swagger } from "@elysiajs/swagger";
import scalarCss from "@stardust/theme/scalar-css";
import { Elysia } from "elysia";
import pkgJson from "~/../package.json";
import { authCheck } from "~/auth-middleware";
import generateToken from "~/lib/auth-token";
import { getConfig } from "~/lib/config";
import { getCpuUsage } from "~/lib/cpu";
import { docker } from "~/lib/docker";
import sessionHandler from "~/session";
import workspaceHandler from "~/workspace";

const config = getConfig();
export const app = new Elysia()
	.get("/", async (c) => {
		return {
			message:
				"✨ Stardust daemon by aetherra. Source tree: https://github.com/aetherra/stardust/tree/rewrite/apps/daemon",
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
	.get("/healthcheck", async () => ({
		success: true,
		cpu: getCpuUsage().toFixed(2),
		mem: (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(2),
		os: `${os.type()} ${os.release()}`,
		version: pkgJson.version,
		sessions: (await docker.listContainers()).filter((s) => s.HostConfig.NetworkMode === config.docker.network).length,
		limit: config.session.limit,
	}))
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
				theme: "none",
				customCss: scalarCss,
				authentication: {
					http: {
						bearer: {
							token: await generateToken(),
						},
						basic: {
							username: "stardust",
							password: await generateToken(),
						},
					},
				},
			},
		}),
	);

// eden
export type App = typeof app;
