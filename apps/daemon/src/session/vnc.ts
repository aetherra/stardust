import { type Socket, connect } from "node:net";
import generateToken from "~/lib/auth-token";
import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";

export const vncWs = Bun.serve<{ socket: Socket }>({
	async fetch(req, server) {
		const containerInfo = await docker.getContainer(new URL(req.url).pathname.split("/")[0]).inspect();
		const socket = connect(
			5901,
			containerInfo.NetworkSettings.Networks[getConfig().docker.network || "stardust"].IPAddress,
		);
		const authToken = await generateToken();
		if (req.headers.get("Authorization") === authToken) {
			server.upgrade(req, {
				data: { socket },
			});
		}
		return new Response(null, { status: 401 });
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
});
