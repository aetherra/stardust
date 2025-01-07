import { getConfig } from "@/lib/config/index.js";
import { docker } from "@/lib/docker.js";

export default async function createSession(workspace: string) {
	const config = getConfig();
	const container = await docker.createContainer({
		Image: workspace,
		HostConfig: {
			NetworkMode: config.docker.network,
		},
	});
	await container.start();
	return container;
}
