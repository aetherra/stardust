import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";
export default async function screenshot(id: string) {
	const container = await docker.getContainer(id).inspect();
	const authorization = container.Config.Env.find((e) => e.startsWith("VNCPASSWORD="))?.split("=")[1] as string;
	const ip = container.NetworkSettings.Networks[getConfig().docker.network || "stardust"].IPAddress;
	return fetch(`http://${ip}:6080/screenshot`, {
		headers: {
			authorization,
		},
	});
}
