import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import type { SelectSession } from "@stardust/db";

export async function inspectSession(session: SelectSession) {
	const config = getConfig();
	const sessionNode = config.nodes.find(({ id }) => id === session.node);
	if (!sessionNode) throw new Error("well this is awkward why does the session not have a node");
	const node = stardustConnector(`http://${sessionNode.hostname}:${sessionNode.port || 4000}`, sessionNode.token);
	// why tf are the types not working
	const { data, error } = await node.sessions({ id: session.id }).get();
	if (error || !data.success) throw new Error(`Error while fetching session inspect: ${error}`);
	return data;
}
