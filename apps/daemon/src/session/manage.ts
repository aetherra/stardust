import { docker } from "@/lib/docker.js";
import type Dockerode from "dockerode";
export default async function manageSession(id: string, action: keyof Dockerode.Container) {
	const container = docker.getContainer(id);
	await container[action]();
	return container;
}
