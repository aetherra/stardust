#!/usr/bin/env bun
import "./help-message";
import { getConfig, validateConfig } from "~/lib/config";

if (process.platform === "win32") {
	console.error("Stardust is not supported on Windows");
	process.exit(1);
}
if (!validateConfig(getConfig())) {
	console.error("Invalid configuration");
	process.exit(1);
}

import { connect, type Socket } from "node:net";
import generateToken from "~/lib/auth-token";
import { docker } from "~/lib/docker";
import checkDockerNetwork from "~/lib/network-check";
import checkSystemService from "~/lib/service-check";
import { app } from ".";

await checkDockerNetwork();
const config = getConfig();
if (typeof config.service !== "boolean" || config.service === true) {
	checkSystemService();
}
// biome-ignore lint: no
const srv = Bun.serve<{ socket: Socket; path: string }, {}>({
	async fetch(req, server) {
		const path = new URL(req.url).pathname;
		const portMap: Record<string, number> = {
			vnc: 5901,
			audio: 4713,
		};
		if (path.startsWith("/sessions") && Object.keys(portMap).includes(path.split("/")[3])) {
			const containerInfo = await docker.getContainer(path.split("/")[2]).inspect();
			const socket = connect(
				portMap[path.split("/")[3]],
				containerInfo.NetworkSettings.Networks[config.docker.network || "stardust"].IPAddress,
			);
			const authToken = await generateToken();
			if (req.headers.get("Authorization") === `Bearer ${authToken}`) {
				if (
					server.upgrade(req, {
						data: { socket, path },
					})
				) {
					return;
				}
			}
		}
		return app.handle(req);
	},
	websocket: {
		open(ws) {
			ws.data.socket.on("data", (data) => {
				ws.send(data);
			});

			ws.data.socket.on("error", (err) => {
				console.error(`✨ Stardust: [${ws.data.path}] ${err.message}`);
				ws.close();
			});

			ws.data.socket.on("close", () => {
				ws.close();
			});
		},
		message(ws, message) {
			ws.data.socket.write(message);
		},
		close(ws, code, reason) {
			console.info(
				`✨ Stardust: [${ws.data.path}] Connection closed with code ${code} and ${
					reason.toString() ? `reason ${reason.toString()}` : "no reason"
				}`,
			);
			ws.data.socket.end();
		},
	},
	hostname: config.host,
	port: config.port || 4000,
	idleTimeout: 60,
});
console.log(`✨ Stardust daemon is running at ${srv.hostname}:${srv.port}`);
