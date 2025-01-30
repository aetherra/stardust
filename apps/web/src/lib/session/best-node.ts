"use server";

import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import type { NodeConfig } from "@stardust/config/config";

export async function getBestNode() {
	const nodes: Record<number, number> = {};
	await Promise.all(
		getConfig().nodes.map(async (n: NodeConfig, i) => {
			const node = stardustConnector(n);
			const { data } = await node.healthcheck.get();
			nodes[i] = Number(data?.cpu) || 0;
		}),
	);
	const minVal = Math.min(...Object.values(nodes));
	const minKey = Object.keys(nodes)
		.map(Number)
		.find((key) => nodes[key] === minVal); // shoot me
	return minKey;
}
