import { getConfig } from "~/lib/config";
import { docker } from "~/lib/docker";
import { vncBaseFlags } from "./create";

export default async function addScreen(id: string) {
	const container = docker.getContainer(id);
	console.log(`hi${id}`);
	await container.restart(id);
	const exec = await container.exec({
		Cmd: ["export", "VNCFLAGS=", "'", vncBaseFlags, " -screen 1 1920x950x24", "'"],
	});
	await exec.start({});
	return true;
}
