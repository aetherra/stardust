import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";

const { docker: config } = getConfig();

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
	else if (network && config.enableCTHC) {
	  const subnet = await docker.getNetwork(config.network).inspect().IPAM.Config[0].Subnet;
    const process = Bun.spawnSync({
      cmd: [
        "bash",
        "-c",
        `iptables -L DOCKER-USER -s ${subnet} -d $(hostname -I | awk '{print $1}') -j DROP`
      ]
    })
    console.log("✨ Stardust: Initialized IPTables rules")
	}
}
