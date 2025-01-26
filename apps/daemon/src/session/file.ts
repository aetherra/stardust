import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";

export async function filesFetch(id: string, path: `/${string}`, method = "GET", body?: Buffer) {
	const container = await docker.getContainer(id).inspect();
	const authorization = container.Config.Env.find((e) => e.startsWith("VNCPASSWORD="))?.split("=")[1] as string;
	const ip = container.NetworkSettings.Networks[getConfig().docker.network || "stardust"].IPAddress;
	return fetch(`http://${ip}:6080${path}`, {
		method,
		body,
		headers: {
			authorization,
		},
	});
}
