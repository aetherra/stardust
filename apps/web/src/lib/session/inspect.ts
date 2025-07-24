import type { SelectSession } from "@stardust/db";
import { getNode } from "./client";

export async function inspectSession(session: SelectSession) {
	const node = getNode(session);
	const { data, error } = await node.sessions({ id: session.id }).get();
	if (error || !data.success) throw new Error(`Error while fetching session inspect: ${error}`);
	return data;
}
