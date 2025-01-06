import { existsSync as exists, readFileSync as read, writeFileSync as write } from "node:fs";
import { getConfig, validateConfig } from "@/lib/config/index.js";
import { Elysia } from "elysia";
const config = getConfig();
if (!validateConfig(config)) {
	console.error("Invalid configuration");
	process.exit(1);
}
const app = new Elysia()
	.get("/", () => ({
		message:
			"✨ Stardust daemon by spaceness \nSource tree: https://github.com/spaceness/stardust/tree/main/apps/daemon",
		success: true,
	}))
	.listen({
		hostname: config.host,
		port: config.port || 4000,
	});

if (
	(exists("/usr/bin/systemd") || exists("/usr/local/bin/systemd")) &&
	!exists("/etc/systemd/system/stardustd.service")
) {
	const payload = read("./stardustd.service").toString();
	write("/etc/systemd/system/stardustd.service", payload, { flag: "wx" });
	const process = Bun.spawnSync(["systemctl", "daemon-reload"]);
	if (process.exitCode === 0) {
		console.log("✨ Stardust: Created systemd service");
	} else {
		console.log(`✨ Stardust: Failed to create systemd service (${process.stderr})`);
	}
}

console.log(`✨ Stardust daemon is running at ${app.server?.hostname}:${app.server?.port}`);
