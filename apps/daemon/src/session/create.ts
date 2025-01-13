import { randomBytes } from "node:crypto";
import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";

export default async function createSession({
	workspace,
	user,
	nostrUrl,
	environment = {},
	offline,
	exposePorts,
	memory,
	password,
}: {
	workspace: string;
	user: string;
	password: string;
	nostrUrl: string;
	environment?: Record<string, string>;
	offline?: boolean;
	exposePorts?: string[];
	memory?: number;
}) {
	const config = getConfig();
	const envArray = Object.entries(environment).map(([key, value]) => `${key}=${value}`);
	const sessionName =  `stardust-session-${user}-${Buffer.from(randomBytes(4)).toString("hex")}`
	const container = await docker.createContainer({
		name: sessionName,
		Image: workspace,
		Tty: true,
		HostConfig: {
			ShmSize: 1024,
			NetworkMode: config.docker.network,
			Dns: config.dnsServers,
			Memory: memory,
		},
		Env: [`STARDUST_USER=${user}`, `VNCPASSWORD=${password}`, `STARLIGHT_NOSTR=${nostrUrl}`,`STARLIGHT_ID=${sessionName}`, ...envArray],
		NetworkDisabled: offline || false,
		ExposedPorts: exposePorts ? Object.fromEntries(exposePorts.map((e) => [e, {}])) : undefined, // world class types by docker
	});
	await container.start().catch((e) => {
		container.remove({ force: true });
		throw new Error(`Container not started ${e.message}`);
	});
	return container.inspect();
}
