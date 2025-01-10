import { stardustConnector } from "@stardust/common/daemon/client";
import { getConfig } from "@stardust/config";
import type { SelectSession } from "@stardust/db";

export function getNode(session: SelectSession) {
	const sessionNode = getConfig().nodes.find(({ id }) => id === session.node);
	if (!sessionNode) throw new Error("well this is awkward why does the session not have a node");
	return stardustConnector(`http://${sessionNode.hostname}:${sessionNode.port || 4000}`, sessionNode.token);
}
