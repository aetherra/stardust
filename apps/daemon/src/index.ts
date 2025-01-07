import { getConfig, validateConfig } from "@/lib/config/index.js";
import checkDockerNetwork from "@/lib/network-check.js";
import checkSystemService from "@/lib/service-check.js";
import sessionHandler from "@/session/index.js";
import { Elysia } from "elysia";
const config = getConfig();
if (!validateConfig(config)) {
	console.error("Invalid configuration");
	process.exit(1);
}

await checkDockerNetwork();

if (typeof config.service !== "boolean" || config.service === true) {
	checkSystemService();
}

export const app = new Elysia()
	.get("/", () => ({
		message:
			"✨ Stardust daemon by spaceness. \nSource tree: https://github.com/spaceness/stardust/tree/rewrite/apps/daemon",
		success: true,
	}))
	.use(sessionHandler);

app.listen({
	hostname: config.host,
	port: config.port || 4000,
});

console.log(`✨ Stardust daemon is running at ${app.server?.hostname}:${app.server?.port}`);

// eden
export type App = typeof app;
