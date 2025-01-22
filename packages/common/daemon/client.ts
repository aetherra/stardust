import { treaty } from "@elysiajs/eden";
import type { NodeConfig } from "@stardust/config/config";
import type { App } from "daemon";

export const stardustConnector = (node: NodeConfig) =>
	treaty<App>(`${node.proto || "http"}://${node.hostname}:${node.port || 4000}`, {
		headers: {
			authorization: node.token,
		},
	});
