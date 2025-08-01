import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";

const { docker: config } = getConfig();

const RESET = "\x1b[0m";
const RED = "\x1b[31m";

export default async function checkDockerNetwork() {
	const network = (await docker.listNetworks()).find((n) => n.Name === config.network);
	if (!network) {
		await docker.createNetwork({
			Name: config.network,
			Options: {
				// @ts-expect-error get out
				"com.docker.network.bridge.enable_icc": `${config.enableIcc}` || false, // CVE-2024-56630
			},
		});
		console.log("✨ Stardust: Created network %s", config.network);
	}
	if (network && !config.enableCTHC) {
		const subnet = await docker.getNetwork(config.network).inspect().IPAM.Config[0].Subnet;
		Bun.spawnSync({
			cmd: ["bash", "-c", `iptables -L DOCKER-USER -s ${subnet} -d $(hostname -I | awk '{print $1}') -j DROP`],
		});
		console.log("✨ Stardust: Initialized IPTables rules");
	}
	if (config.enableCTHC) {
		console.log(`${RED}CAUTION: Container to host connectivity is enabled!`);
		console.log(`Anybody using your instance of Stardust will be able to access sensitive information on your host.`);
		console.log(
			`If you don't know what this means, please CTRL+C to exit and consult the documentation at https://stardust.aethera.org/docs`,
		);
		console.log(`Please disable this option immediately if you are using Stardust commercially.`);
		console.log(`Stardust will continue running in 5 seconds.${RESET}`);
		await new Promise((res) => setTimeout(res, 5000));
	}
	if (config.enableIcc) {
		console.log(`${RED}CAUTION: Inter-container connectivity is enabled!`);
		console.log(
			`Anybody using your instance of Stardust will be able to access sensitive information on workspaces other than their own.`,
		);
		console.log(
			`If you don't know what this means, please CTRL+C to exit and consult the documentation at https://stardust.aethera.org/docs`,
		);
		console.log(`Please disable this option immediately if you are using Stardust commercially.`);
		console.log(`Stardust will continue running in 5 seconds.${RESET}`);
		await new Promise((res) => setTimeout(res, 5000));
	}
}
