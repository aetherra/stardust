import { getConfig } from "@/lib/config/index.js";
import { docker } from "@/lib/docker.js";
const { docker: config } = getConfig();

export default async function checkDockerNetwork() {
	const network = (await docker.listNetworks()).find((n) => n.Name === config.network);
	if (!network) {
		await docker.createNetwork({
			Name: config.network,
			Options: {
				"com.docker.network.bridge.enable_icc": `${config.enableIcc}` || "false", // CVE-2024-56630
			},
		});
		console.log("✨ Stardust: Created network %s", config.network);
	}
}
