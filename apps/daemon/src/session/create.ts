import { randomBytes } from "node:crypto";
import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";

const config = getConfig();
export const vncBaseFlags = `-screen 0 ${config.session.resolution || "1920x950"}x${config.session.bitDepth?.toString() || "24"}`;

export default async function createSession({
	workspace,
	user,
	password,
	environment = {},
	exposePorts,
	memory,
	nodeId,
	vncFlags,
}: {
	workspace: string;
	user: string;
	password?: string;
	environment?: Record<string, string>;
	exposePorts?: string[];
	memory?: number;
	nodeId: string;
	vncFlags?: string;
}) {
	const config = getConfig();
	const pass = password || config.session.vncPassword || Buffer.from(randomBytes(32)).toString("hex");
	const envArray = Object.entries(environment).map(([key, value]) => `${key}=${value}`);
	const sessionName = `stardust-${user}-${nodeId}-${Buffer.from(randomBytes(3)).toString("hex")}`;
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
		Env: [
			`STARDUST_USER=${user}`,
			`VNCPASSWORD=${pass}`,
			`WIPEVNCENV=${config.session.showVncPassword ? "false" : "true"}`,
			`VNCFLAGS=${vncBaseFlags + vncFlags}`,
			...envArray,
		],
		ExposedPorts: exposePorts ? Object.fromEntries(exposePorts.map((e) => [e, {}])) : undefined, // world class types by docker
	});
	await container.start().catch((e) => {
		container.remove({ force: true });
		throw new Error(`Container not started ${e.message}`);
	});
	return container.inspect();
}
