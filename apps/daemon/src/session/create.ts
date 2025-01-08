import { randomBytes } from "node:crypto";
import { getConfig } from "~/lib/config/index.js";
import { docker } from "~/lib/docker.js";

export default async function createSession({
	workspace,
	user,
	environment,
	offline,
	exposePorts,
	memory,
}: {
	workspace: string;
	user: string;
	environment?: Record<string, string>;
	offline?: boolean;
	exposePorts?: string[];
	memory?: number;
}) {
	const config = getConfig();
	const envArray = Object.entries(environment || { STARDUST_USER: user }).map(([key, value]) => `${key}=${value}`);
	const container = await docker.createContainer({
		name: `stardust-session-${workspace.replaceAll("/", "_")}-${Buffer.from(randomBytes(4)).toString("hex")}`,
		Image: workspace,
		HostConfig: {
			ShmSize: 1024,
			NetworkMode: config.docker.network,
			Dns: config.dnsServers,
			Memory: memory,
		},
		Env: envArray,
		NetworkDisabled: offline || false,
		ExposedPorts: exposePorts ? Object.fromEntries(exposePorts.map((e) => [e, {}])) : undefined, // world class types by docker
	});
	await container.start().catch((e) => {
		container.remove({ force: true });
		throw new Error(`Container not started ${e.message}`);
	});
	return container.inspect();
}
