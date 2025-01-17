#!/usr/bin/env bun
import "./help-message";
import { getConfig, validateConfig } from "~/lib/config";
if (!validateConfig(getConfig())) {
	console.error("Invalid configuration");
	process.exit(1);
}
import { type Socket, connect } from "node:net";
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
const srv = Bun.serve<{ socket: Socket }>({
	async fetch(req, server) {
		const path = new URL(req.url).pathname;
		if (path.startsWith("/sessions") && path.split("/")[4] === "vnc") {
			const containerInfo = await docker.getContainer(path.split("/")[4]).inspect();
			const socket = connect(
				5901,
				containerInfo.NetworkSettings.Networks[config.docker.network || "stardust"].IPAddress,
			);
			const authToken = await generateToken();
			if (req.headers.get("Authorization") === authToken) {
				console.log("upgrd");
				server.upgrade(req, {
					data: { socket },
				});
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
				console.warn(`✨ Stardust: ${err.message}`);
				ws.close();
			});

			ws.data.socket.on("close", () => {
				ws.close();
			});
		},
		message({ data: { socket } }, message) {
			socket.write(message);
		},
		close({ data: { socket } }, code, reason) {
			console.info(
				`✨ Stardust: Connection closed with code ${code} and ${
					reason.toString() ? `reason ${reason.toString()}` : "no reason"
				}`,
			);
			socket.end();
		},
	},
	hostname: config.host,
	port: config.port || 4000,
});
console.log(`✨ Stardust daemon is running at ${srv.hostname}:${srv.port}`);
