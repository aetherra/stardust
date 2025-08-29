// todo: overhaul with sha256, kill processes on containers only, add admin exemption

import { execSync } from "node:child_process";
import { platform } from "node:os";
import { getConfig } from "~/lib/config";
import { docker } from "./docker";

const config = getConfig();
const blockedProcessNames = config.session.blockedProcessNames;

export function scheduleKillBlockedProcesses() {
	if (!blockedProcessNames?.length) return;
	if (!platform().startsWith("linux")) {
		console.error("Blocked process killing is only supported on Linux");
		return;
	}
	const kill = async () => {
		for (const { Id } of await docker.listContainers()) {
			const top: { Processes: string[] } = await docker.getContainer(Id).top({ ps_args: "-eo pid" });
			for (const process of top.Processes.flat()) {
				const names = execSync(`strings /proc/${process}/exe | grep -E "${blockedProcessNames.join("|")}"`);
				if (names.toString().trim().length) {
					await docker.getContainer(Id).exec({ Cmd: ["kill", "-9", process] });
					console.log(`Killed process ${process} on container ${Id}`);
				}
			}
		}
	};
	kill();
	setInterval(kill, 60 * 1000);
}
