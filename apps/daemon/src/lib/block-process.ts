// todo: overhaul with sha256, kill processes on containers only, add admin exemption

import { getConfig } from "~/lib/config";

const config = getConfig();
const blockedProcessNames = config.session.blockedProcessNames;

export function scheduleKillBlockedProcesses() {
	const kill = async () => {
		if (blockedProcessNames) {
			const cmd = ["killall", "-q", "-9", ...blockedProcessNames];
			Bun.spawn(cmd);
		}
	};
	setInterval(kill, 10000);
}
