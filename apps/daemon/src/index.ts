#!/usr/bin/env bun
import "./help-message";
import { getConfig, validateConfig } from "~/lib/config";
if (!validateConfig(getConfig())) {
	console.error("Invalid configuration");
	process.exit(1);
}
import { Elysia } from "elysia";
import { authCheck } from "~/auth-middleware";
import { docker } from "~/lib/docker";
import checkDockerNetwork from "~/lib/network-check";
import checkSystemService from "~/lib/service-check";
import sessionHandler from "~/session";
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
	.use(sessionHandler)
	.listen({
		hostname: config.host,
		port: config.port || 4000,
	});

console.log(`✨ Stardust daemon is running at ${app.server?.hostname}:${app.server?.port}`);

// eden
export type App = typeof app;
