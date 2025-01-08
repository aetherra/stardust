import type Dockerode from "dockerode";
import { docker } from "~/lib/docker.js";
export default async function manageSession(id: string, action: keyof Dockerode.Container) {
	const container = docker.getContainer(id);
	await container[action]();
	return container.inspect();
}
