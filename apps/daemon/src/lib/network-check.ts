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
	if (!config.enableCTHC) {
		const inspect = await docker.getNetwork(config.network).inspect();
		const subnet = inspect.IPAM.Config[0].Subnet;
		if (process.platform === "linux") {
			// Check if rule exists
			const check = Bun.spawnSync({
				cmd: ["bash", "-c", `iptables -C DOCKER-USER -s ${subnet} -d $(hostname -I | awk '{print $1}') -j DROP`],
			});
			if (check.exitCode !== 0) {
				// Rule doesn't exist, add it
				Bun.spawnSync({
					cmd: ["bash", "-c", `iptables -I DOCKER-USER -s ${subnet} -d $(hostname -I | awk '{print $1}') -j DROP`],
				});
			}

			console.log("✨ Stardust: Initialized IPTables rules");
		} else if (process.platform === "darwin") {
			console.warn("Stardust is not natively supported on MacOS. Go forward if you know what you are doing. ");
		}
	}
	if (config.enableCTHC) {
		console.warn(`${RED}CAUTION: Container to host connectivity is enabled!`);
		console.warn(`Anybody using your instance of Stardust will be able to access sensitive information on your host.`);
		console.warn(
			`If you don't know what this means, please CTRL+C to exit and consult the documentation at https://stardust.aetherra.org/docs`,
		);
		console.warn(`Please disable this option immediately if you are using Stardust commercially.`);
		console.warn(`Stardust will continue running in 5 seconds.${RESET}`);
		await new Promise((res) => setTimeout(res, 5000));
	}
	if (config.enableIcc) {
		console.warn(`${RED}CAUTION: Inter-container connectivity is enabled!`);
		console.warn(
			`Anybody using your instance of Stardust will be able to access sensitive information on workspaces other than their own.`,
		);
		console.warn(
			`If you don't know what this means, please CTRL+C to exit and consult the documentation at https://stardust.aetherra.org/docs`,
		);
		console.warn(`Please disable this option immediately if you are using Stardust commercially.`);
		console.warn(`Stardust will continue running in 5 seconds.${RESET}`);
		await new Promise((res) => setTimeout(res, 5000));
	}
}
